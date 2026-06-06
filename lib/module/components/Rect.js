"use strict";

/**
 * Rect.tsx
 *
 * A render-prop component that measures its own layout dimensions and passes
 * the resolved { width, height } to its children function.
 *
 * Uses `onLayout` (not `measureInWindow`) so it:
 *  - Works on both old-bridge and new-arch React Native.
 *  - Has exactly ONE hook (useState inside useViewSize), which keeps the
 *    hook count stable across renders and avoids Reanimated's internal
 *    `createAnimatedComponent` from triggering a hook-order violation in
 *    the parent fiber.
 *
 * Inspired by https://reach.tech/rect/
 */

import * as React from 'react';
import { View } from 'react-native';
import { useViewSize } from "../hooks/useViewSize.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Rect({
  children,
  ...viewProps
}) {
  const {
    size,
    onLayout
  } = useViewSize();
  return /*#__PURE__*/_jsx(View, {
    onLayout: onLayout,
    ...viewProps,
    children: size != null ? children(size) : null
  });
}
//# sourceMappingURL=Rect.js.map