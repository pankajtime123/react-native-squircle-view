/**
 * AnimatedSquircleBackground.tsx
 *
 * Internal component — renders an AnimatedPath inside a fixed-size SVG,
 * driven entirely by Reanimated's UI-thread worklet system.
 *
 * NOT part of the public API.
 *
 * Architecture note:
 *   Hooks must not be called inside render-prop callbacks (Rules of Hooks).
 *   `AnimatedSvgContent` is a real component that receives measured dimensions
 *   as props and calls `useAnimatedSquircleProps` at its own top level.
 */

import * as React from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

import type { AnimatedSquircleParams } from '../types/animated'
import { useAnimatedSquircleProps } from '../hooks/useAnimatedSquircleProps'
import { GradientDefs } from './GradientDefs'
import { Rect } from './Rect'

// Create a Reanimated-wrapped Path so animated props are applied on the UI thread
const AnimatedPath = Animated.createAnimatedComponent(Path)

// ─── Inner component (hook-safe, receives measured dimensions as props) ───────

interface AnimatedSvgContentProps {
  params: AnimatedSquircleParams
  width: number
  height: number
}

/**
 * Separated from the outer component so hooks are called at a component's
 * top level — not inside a render-prop callback, which violates Rules of Hooks.
 */
function AnimatedSvgContent({
  params,
  width,
  height,
}: AnimatedSvgContentProps): React.ReactElement {
  const { animatedPathProps } = useAnimatedSquircleProps({ params, width, height })
  const { gradient } = params

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      {gradient && <GradientDefs gradient={gradient} />}
      <AnimatedPath animatedProps={animatedPathProps} />
    </Svg>
  )
}

// ─── Outer component (handles layout measurement) ─────────────────────────────

interface AnimatedSquircleBackgroundProps {
  params: AnimatedSquircleParams
}

export function AnimatedSquircleBackground({
  params,
}: AnimatedSquircleBackgroundProps): React.ReactElement {
  return (
    <Rect style={StyleSheet.absoluteFill}>
      {({ width, height }) => (
        // AnimatedSvgContent is a proper component — hooks inside are valid
        <AnimatedSvgContent params={params} width={width} height={height} />
      )}
    </Rect>
  )
}
