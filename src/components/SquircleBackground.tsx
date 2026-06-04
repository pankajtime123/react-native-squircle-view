/**
 * SquircleBackground.tsx
 *
 * Renders the SVG squircle shape (with optional gradient and/or stroke) as an
 * absolutely-positioned layer that fills its parent container.
 *
 * Responsibilities (single):
 *  - Resolve the SVG path from figma-squircle using the measured size.
 *  - Handle stroke-inset math so the stroke stays inside the shape.
 *  - Delegate gradient <defs> rendering to <GradientDefs>.
 *  - Delegate size measurement to <Rect>.
 *
 * This component is intentionally NOT exported from the library's public API.
 */

import * as React from 'react'
import { StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { getSvgPath } from 'figma-squircle'

import type { SquircleParams } from '../types'
import { GRADIENT_DEF_ID } from '../constants'
import { getInnerRadius, clampStrokeWidth } from '../utils/geometry'
import { GradientDefs } from './GradientDefs'
import { Rect } from './Rect'

export function SquircleBackground({
  cornerRadius = 0,
  topLeftCornerRadius,
  topRightCornerRadius,
  bottomRightCornerRadius,
  bottomLeftCornerRadius,
  cornerSmoothing,
  fillColor = '#000',
  gradient,
  strokeColor = '#000',
  strokeWidth = 0,
}: SquircleParams): React.ReactElement {
  const pathFill = gradient
    ? `url(#${GRADIENT_DEF_ID})`
    : (fillColor as string)

  const hasStroke = strokeWidth > 0

  return (
    <Rect style={StyleSheet.absoluteFill}>
      {({ width, height }) => {
        // ── No stroke: simple filled squircle ─────────────────────────────
        if (!hasStroke) {
          const squirclePath = getSvgPath({
            width,
            height,
            cornerSmoothing,
            cornerRadius,
            topLeftCornerRadius,
            topRightCornerRadius,
            bottomRightCornerRadius,
            bottomLeftCornerRadius,
          })

          return (
            <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
              {gradient && <GradientDefs gradient={gradient} />}
              <Path d={squirclePath} fill={pathFill} />
            </Svg>
          )
        }

        // ── With stroke: inset path by strokeWidth / 2 ────────────────────
        // Clamp the stroke so it never exceeds the smallest corner radius.
        const clampedStroke = clampStrokeWidth(
          strokeWidth,
          cornerRadius,
          topLeftCornerRadius,
          topRightCornerRadius,
          bottomLeftCornerRadius,
          bottomRightCornerRadius
        )
        const inset = clampedStroke / 2

        const insetPath = getSvgPath({
          width: width - clampedStroke,
          height: height - clampedStroke,
          cornerSmoothing,
          cornerRadius: getInnerRadius(cornerRadius, inset),
          topLeftCornerRadius: getInnerRadius(topLeftCornerRadius, inset),
          topRightCornerRadius: getInnerRadius(topRightCornerRadius, inset),
          bottomRightCornerRadius: getInnerRadius(
            bottomRightCornerRadius,
            inset
          ),
          bottomLeftCornerRadius: getInnerRadius(bottomLeftCornerRadius, inset),
        })

        return (
          <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            {gradient && <GradientDefs gradient={gradient} />}
            <Path
              d={insetPath}
              fill={pathFill}
              stroke={strokeColor}
              strokeWidth={clampedStroke}
              translate={inset}
            />
          </Svg>
        )
      }}
    </Rect>
  )
}
