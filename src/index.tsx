/**
 * src/index.tsx — Public API barrel
 *
 * This file is the single entry-point for library consumers.
 * It intentionally re-exports only what belongs to the public API.
 * Internal implementation details (Rect, hooks, etc.)
 * are NOT re-exported so they can be refactored freely without semver bumps.
 */

// ── Components ────────────────────────────────────────────────────────────────
export { SquircleView } from './components/SquircleView'
export { SquircleBackground } from './components/SquircleBackground'
export { AnimatedSquircleView } from './components/AnimatedSquircleView'
export { AnimatedSquircleView as AnimatedSquircleBackground } from './components/AnimatedSquircleView'

// ── Default export ────────────────────────────────────────────────────────────
export { SquircleView as default } from './components/SquircleView'

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  SquircleParams,
  SquircleViewProps,
  GradientParams,
  LinearGradientParams,
  RadialGradientParams,
  GradientStop,
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
