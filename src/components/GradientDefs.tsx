/**
 * GradientDefs.tsx
 *
 * Renders the SVG <defs> block for either a linear or radial gradient.
 *
 * Keeping this as a dedicated component means:
 *  - The switch between gradient types is isolated here.
 *  - Adding a new gradient type (e.g. "conic") only requires editing this file.
 *  - SquircleBackground stays focused on path geometry.
 */

import * as React from 'react'
import {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  type LinearGradientProps,
  type RadialGradientProps,
} from 'react-native-svg'
import type { GradientParams } from '../types'
import { GRADIENT_DEF_ID } from '../constants'

// ─── SVG peer-dependency type wrappers ───────────────────────────────────────
// The installed version of react-native-svg omits `children` from gradient
// props even though the components accept <Stop> children at runtime.
// Narrow wrappers satisfy TypeScript without casting at every call-site.

type SvgLinearGradientComponent = React.ComponentType<
  LinearGradientProps & { children?: React.ReactNode }
>
type SvgRadialGradientComponent = React.ComponentType<
  RadialGradientProps & { children?: React.ReactNode }
>

const SvgLinearGradient =
  LinearGradient as unknown as SvgLinearGradientComponent
const SvgRadialGradient =
  RadialGradient as unknown as SvgRadialGradientComponent

// ─── Component ───────────────────────────────────────────────────────────────

interface GradientDefsProps {
  gradient: GradientParams
}

export function GradientDefs({
  gradient,
}: GradientDefsProps): React.ReactElement {
  const stops = gradient.stops.map((stop, index) => (
    <Stop
      key={index}
      offset={stop.offset}
      stopColor={stop.color}
      stopOpacity={stop.opacity ?? 1}
    />
  ))

  if (gradient.type === 'linear') {
    return (
      <Defs>
        <SvgLinearGradient
          id={GRADIENT_DEF_ID}
          x1={gradient.x1 ?? '0%'}
          y1={gradient.y1 ?? '0%'}
          x2={gradient.x2 ?? '100%'}
          y2={gradient.y2 ?? '0%'}
        >
          {stops}
        </SvgLinearGradient>
      </Defs>
    )
  }

  // type === 'radial'
  return (
    <Defs>
      <SvgRadialGradient
        id={GRADIENT_DEF_ID}
        cx={gradient.cx ?? '50%'}
        cy={gradient.cy ?? '50%'}
        r={gradient.r ?? '50%'}
        fx={gradient.fx}
        fy={gradient.fy}
      >
        {stops}
      </SvgRadialGradient>
    </Defs>
  )
}
