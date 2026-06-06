"use strict";

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

import * as React from 'react';
import { Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { GRADIENT_DEF_ID } from "../constants/index.js";

// ─── SVG peer-dependency type wrappers ───────────────────────────────────────
// The installed version of react-native-svg omits `children` from gradient
// props even though the components accept <Stop> children at runtime.
// Narrow wrappers satisfy TypeScript without casting at every call-site.
import { jsx as _jsx } from "react/jsx-runtime";
const SvgLinearGradient = LinearGradient;
const SvgRadialGradient = RadialGradient;

// ─── Component ───────────────────────────────────────────────────────────────

export function GradientDefs({
  gradient
}) {
  const stops = gradient.stops.map((stop, index) => /*#__PURE__*/_jsx(Stop, {
    offset: stop.offset,
    stopColor: stop.color,
    stopOpacity: stop.opacity ?? 1
  }, index));
  if (gradient.type === 'linear') {
    return /*#__PURE__*/_jsx(Defs, {
      children: /*#__PURE__*/_jsx(SvgLinearGradient, {
        id: GRADIENT_DEF_ID,
        x1: gradient.x1 ?? '0%',
        y1: gradient.y1 ?? '0%',
        x2: gradient.x2 ?? '100%',
        y2: gradient.y2 ?? '0%',
        children: stops
      })
    });
  }

  // type === 'radial'
  return /*#__PURE__*/_jsx(Defs, {
    children: /*#__PURE__*/_jsx(SvgRadialGradient, {
      id: GRADIENT_DEF_ID,
      cx: gradient.cx ?? '50%',
      cy: gradient.cy ?? '50%',
      r: gradient.r ?? '50%',
      fx: gradient.fx,
      fy: gradient.fy,
      children: stops
    })
  });
}
//# sourceMappingURL=GradientDefs.js.map