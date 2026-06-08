/**
 * src/index.tsx — Public API barrel
 *
 * This file is the single entry-point for library consumers.
 * It intentionally re-exports only what belongs to the public API.
 * Internal implementation details (Rect, hooks, etc.)
 * are NOT re-exported so they can be refactored freely without semver bumps.
 */

import type { ReactElement, PropsWithChildren } from 'react'
import type { SquircleViewProps, SquircleParams, AnimatedSquircleViewProps } from './types'

import { SquircleView as _SquircleView } from './components/SquircleView'
export const SquircleView: (props: PropsWithChildren<SquircleViewProps>) => ReactElement = _SquircleView
export default _SquircleView

import { SquircleBackground as _SquircleBackground } from './components/SquircleBackground'
export const SquircleBackground: (props: PropsWithChildren<SquircleParams>) => ReactElement = _SquircleBackground

// ── Animated components (requires react-native-reanimated peer dep) ───────────
import { AnimatedSquircleView as _AnimatedSquircleView } from './components/AnimatedSquircleView'
export const AnimatedSquircleView: (props: PropsWithChildren<AnimatedSquircleViewProps>) => ReactElement = _AnimatedSquircleView
export const AnimatedSquircleBackground: (props: PropsWithChildren<AnimatedSquircleViewProps>) => ReactElement = _AnimatedSquircleView

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  // Base types
  SquircleParams,
  SquircleViewProps,
  GradientParams,
  LinearGradientParams,
  RadialGradientParams,
  GradientStop,
  // Animated types
  MaybeAnimated,
  AnimatedSquircleParams,
  AnimatedSquircleViewProps,
} from './types'

// ── Utilities (escape hatch for advanced custom SVG use-cases) ────────────────
export { getSvgPath } from 'figma-squircle'

/**
 * getSvgPathWorklet — worklet-compatible path generator.
 * Use this if you need to compute the squircle path inside your own
 * `useAnimatedProps` worklet.
 */
export { getSvgPathWorklet } from './utils/squirclePathWorklet'
