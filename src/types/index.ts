import type { ViewProps, ColorValue } from 'react-native'
import type { ReactNode } from 'react'

// ─── Gradient types ───────────────────────────────────────────────────────────

/** A single color stop inside an SVG gradient. */
export interface GradientStop {
  /** Position along the gradient axis — 0–1 or '0%'–'100%'. */
  offset: string | number
  color: string
  opacity?: number
}

/** Configuration for a linear gradient fill. */
export interface LinearGradientParams {
  type: 'linear'
  /** Gradient start x (default '0%'). */
  x1?: string | number
  /** Gradient start y (default '0%'). */
  y1?: string | number
  /** Gradient end x (default '100%'). */
  x2?: string | number
  /** Gradient end y (default '0%'). */
  y2?: string | number
  stops: readonly GradientStop[]
}

/** Configuration for a radial gradient fill. */
export interface RadialGradientParams {
  type: 'radial'
  /** Center x (default '50%'). */
  cx?: string | number
  /** Center y (default '50%'). */
  cy?: string | number
  /** Radius (default '50%'). */
  r?: string | number
  /** Focal point x (defaults to cx). */
  fx?: string | number
  /** Focal point y (defaults to cy). */
  fy?: string | number
  stops: readonly GradientStop[]
}

/** Union of all supported gradient types. */
export type GradientParams = LinearGradientParams | RadialGradientParams

// ─── Squircle types ───────────────────────────────────────────────────────────

/** Squircle shape & fill parameters. */
export interface SquircleParams {
  cornerRadius?: number
  topLeftCornerRadius?: number
  topRightCornerRadius?: number
  bottomRightCornerRadius?: number
  bottomLeftCornerRadius?: number
  cornerSmoothing: number
  /** Solid fill color. Ignored when `gradient` is provided. */
  fillColor?: ColorValue
  /** SVG gradient fill. Takes priority over `fillColor`. */
  gradient?: GradientParams
  strokeColor?: ColorValue
  strokeWidth?: number
}

/** Props for the public <SquircleView> component. */
export interface SquircleViewProps extends ViewProps {
  squircleParams: SquircleParams
}

// ─── Internal types ───────────────────────────────────────────────────────────

/** Resolved layout size from the Rect measurement helper. */
export interface ViewSize {
  width: number
  height: number
}

/** Internal render-prop interface for the <Rect> measurement helper. */
export interface RectProps extends Omit<ViewProps, 'children'> {
  children: (rect: ViewSize) => ReactNode
}

// ─── Animated types (re-exported for convenience) ─────────────────────────────
export type {
  MaybeAnimated,
  AnimatedSquircleParams,
  AnimatedSquircleViewProps,
} from './animated'
