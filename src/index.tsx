/**
 * src/index.tsx — Public API barrel
 *
 * This file is the single entry-point for library consumers.
 * It intentionally re-exports only what belongs to the public API.
 * Internal implementation details (Rect, SquircleBackground, hooks, etc.)
 * are NOT re-exported so they can be refactored freely without semver bumps.
 */

// ── Components ────────────────────────────────────────────────────────────────
export { SquircleView } from './components/SquircleView'

// ── Types (consumers may need these for typing their own wrappers) ────────────
export type {
  SquircleParams,
  SquircleViewProps,
  GradientParams,
  LinearGradientParams,
  RadialGradientParams,
  GradientStop,
} from './types'

// ── Utilities (escape hatch for advanced custom SVG use-cases) ────────────────
export { getSvgPath } from 'figma-squircle'
