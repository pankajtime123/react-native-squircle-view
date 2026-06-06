"use strict";

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

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getSvgPath } from 'figma-squircle';
import { GRADIENT_DEF_ID } from "../constants/index.js";
import { getInnerRadius, clampStrokeWidth } from "../utils/geometry.js";
import { GradientDefs } from "./GradientDefs.js";
import { Rect } from "./Rect.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
  strokeWidth = 0
}) {
  const pathFill = gradient ? `url(#${GRADIENT_DEF_ID})` : fillColor;
  const hasStroke = strokeWidth > 0;

  // ── Clamp inputs to valid ranges ──────────────────────────────────────────
  // Spring animations can overshoot: cornerSmoothing > 1 makes arcSectionLength
  // negative inside figma-squircle, producing `--x` (double negative) in the
  // SVG path which react-native-svg rejects. Clamping here is safe and covers
  // both animated and static usage.
  const safeSmoothing = Math.min(1, Math.max(0, cornerSmoothing));
  const safeRadius = Math.max(0, cornerRadius);
  const safeTL = topLeftCornerRadius != null ? Math.max(0, topLeftCornerRadius) : undefined;
  const safeTR = topRightCornerRadius != null ? Math.max(0, topRightCornerRadius) : undefined;
  const safeBR = bottomRightCornerRadius != null ? Math.max(0, bottomRightCornerRadius) : undefined;
  const safeBL = bottomLeftCornerRadius != null ? Math.max(0, bottomLeftCornerRadius) : undefined;
  return /*#__PURE__*/_jsx(Rect, {
    style: StyleSheet.absoluteFill,
    children: ({
      width,
      height
    }) => {
      // ── No stroke: simple filled squircle ─────────────────────────────
      if (!hasStroke) {
        const squirclePath = getSvgPath({
          width,
          height,
          cornerSmoothing: safeSmoothing,
          cornerRadius: safeRadius,
          topLeftCornerRadius: safeTL,
          topRightCornerRadius: safeTR,
          bottomRightCornerRadius: safeBR,
          bottomLeftCornerRadius: safeBL
        });
        return /*#__PURE__*/_jsxs(Svg, {
          width: "100%",
          height: "100%",
          viewBox: `0 0 ${width} ${height}`,
          children: [gradient && /*#__PURE__*/_jsx(GradientDefs, {
            gradient: gradient
          }), /*#__PURE__*/_jsx(Path, {
            d: squirclePath,
            fill: pathFill
          })]
        });
      }

      // ── With stroke: inset path by strokeWidth / 2 ────────────────────
      // Clamp the stroke so it never exceeds the smallest corner radius.
      const clampedStroke = clampStrokeWidth(strokeWidth, safeRadius, safeTL, safeTR, safeBL, safeBR);
      const inset = clampedStroke / 2;
      const insetPath = getSvgPath({
        width: width - clampedStroke,
        height: height - clampedStroke,
        cornerSmoothing: safeSmoothing,
        cornerRadius: getInnerRadius(safeRadius, inset),
        topLeftCornerRadius: getInnerRadius(safeTL, inset),
        topRightCornerRadius: getInnerRadius(safeTR, inset),
        bottomRightCornerRadius: getInnerRadius(safeBR, inset),
        bottomLeftCornerRadius: getInnerRadius(safeBL, inset)
      });
      return /*#__PURE__*/_jsxs(Svg, {
        width: "100%",
        height: "100%",
        viewBox: `0 0 ${width} ${height}`,
        children: [gradient && /*#__PURE__*/_jsx(GradientDefs, {
          gradient: gradient
        }), /*#__PURE__*/_jsx(Path, {
          d: insetPath,
          fill: pathFill,
          stroke: strokeColor,
          strokeWidth: clampedStroke,
          translate: inset
        })]
      });
    }
  });
}
//# sourceMappingURL=SquircleBackground.js.map