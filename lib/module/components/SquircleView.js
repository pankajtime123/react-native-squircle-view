"use strict";

/**
 * SquircleView.tsx
 *
 * Public root component — a drop-in replacement for React Native's <View>
 * that clips its background to a Figma-style squircle shape.
 *
 * All standard ViewProps are forwarded to the underlying <View>, and
 * children are rendered on top of the squircle background layer.
 *
 * @example
 * <SquircleView
 *   squircleParams={{
 *     cornerRadius: 24,
 *     cornerSmoothing: 0.6,
 *     fillColor: '#6C47FF',
 *   }}
 *   style={{ width: 200, height: 100 }}
 * >
 *   <Text>Hello squircle</Text>
 * </SquircleView>
 *
 * @example — with a linear gradient
 * <SquircleView
 *   squircleParams={{
 *     cornerRadius: 24,
 *     cornerSmoothing: 0.6,
 *     gradient: {
 *       type: 'linear',
 *       stops: [
 *         { offset: '0%',   color: '#FF6B6B' },
 *         { offset: '100%', color: '#6C47FF' },
 *       ],
 *     },
 *   }}
 *   style={{ width: 200, height: 100 }}
 * />
 */

import * as React from 'react';
import { View } from 'react-native';
import { SquircleBackground } from "./SquircleBackground.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SquircleView({
  squircleParams,
  children,
  ...viewProps
}) {
  return /*#__PURE__*/_jsxs(View, {
    ...viewProps,
    children: [/*#__PURE__*/_jsx(SquircleBackground, {
      ...squircleParams
    }), children]
  });
}
//# sourceMappingURL=SquircleView.js.map