import React, { useEffect, memo } from 'react'
import { Pressable } from 'react-native'
import { Text, HStack, Box } from 'native-base'
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  withDelay,
  interpolateColor,
  useAnimatedStyle,
  withSequence
} from 'react-native-reanimated'

interface Props {
  strikeThrough: boolean
  textColor: string
  inactiveTextColor: string
  onPress?: () => void
  children?: React.ReactNode
}

const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedHStack = Animated.createAnimatedComponent(HStack)
const AnimatedText = Animated.createAnimatedComponent(Text)

const AnimatedTaskLabel = memo((props: Props) => {
  const { strikeThrough, textColor, inactiveTextColor, onPress, children } =
    props

  const hstackOffset = useSharedValue(0)
  const hstackAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: hstackOffset.value }]
  }))
  const textColorProgress = useSharedValue(0)
  const textColorAnimatedStyles = useAnimatedStyle(
    () => ({
      color: interpolateColor(
        textColorProgress.value,
        [0, 1],
        [textColor, inactiveTextColor]
      )
    }),
    [strikeThrough, textColor, inactiveTextColor]
  )
  const strikeThroughWidth = useSharedValue(0)
  const strikeThroughAnimatedStyles = useAnimatedStyle(
    () => ({
      width: `${strikeThroughWidth.value * 100}%`,
      borderBottomColor: interpolateColor(
        textColorProgress.value,
        [0, 1],
        [textColor, inactiveTextColor]
      )
    }),
    [strikeThroughWidth, textColor, inactiveTextColor]
  )

  useEffect(() => {
    const easing = Easing.out(Easing.quad)
    if (strikeThrough) {
      hstackOffset.value = withSequence(
        withTiming(4, { duration: 200, easing }),
        withTiming(0, { duration: 200, easing })
      )
      textColorProgress.value = withDelay(
        100,
        withTiming(1, { duration: 400, easing })
      )
      strikeThroughWidth.value = withTiming(1, { duration: 400, easing })
      textColorProgress.value = withDelay(
        1000,
        withTiming(1, { duration: 400, easing })
      )
    } else {
      strikeThroughWidth.value = withTiming(0, { duration: 400, easing })
      textColorProgress.value = withTiming(0, { duration: 400, easing })
    }
  })

  return (
    <Pressable onPress={onPress}>
      <AnimatedHStack alignItems="center" style={hstackAnimatedStyles}>
        <AnimatedText
          fontSize={19}
          noOfLines={1}
          isTruncated
          px={1}
          style={[textColorAnimatedStyles]}
        >
          {children}
        </AnimatedText>
        <AnimatedBox
          position="absolute"
          h={1}
          borderBottomWidth={1}
          style={[strikeThroughAnimatedStyles]}
        />
      </AnimatedHStack>
    </Pressable>
  )
})

export default AnimatedTaskLabel
