"use strict";

/**
 * AnimatedSquircleView.tsx
 *
 * Public component for animated squircles.
 *
 * Works exactly like Animated.View from react-native-reanimated:
 *  - Pass SharedValue<number> to any numeric squircle param → smooth shape animation
 *  - Pass useAnimatedStyle() to `style` → same as <Animated.View>
 *
 * ─── Implementation note ─────────────────────────────────────────────────────
 * This component does NOT use `useAnimatedProps` / Reanimated worklets
 * internally. The reason: the react-native-worklets Babel plugin (which
 * transforms `'worklet'` directives) processes files ONE AT A TIME and cannot
 * be guaranteed to run on library source files in a monorepo/Expo Go setup.
 *
 * Instead, we use a requestAnimationFrame loop on the JS thread to read the
 * current value of each SharedValue (`.value` is always accessible from JS)
 * and update React state only when something actually changed. In practice this
 * delivers visually smooth ~60 fps animations for shape morphing.
 *
 * The outer <Animated.View> wrapper is kept so consumers can still pass
 * useAnimatedStyle() results to the `style` prop.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import { SquircleBackground } from "./SquircleBackground.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Reads the current raw JS value from a plain value or a Reanimated
 * SharedValue. SharedValues have a `.value` property; primitives are returned
 * as-is. This is safe to call on the JS thread at any time.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function resolveJS(v) {
  if (v !== null && v !== undefined && typeof v === 'object' && 'value' in v) {
    return v.value;
  }
  return v;
}

/** Snapshot all animated params to plain values at the current instant. */
function snapshot(p) {
  return {
    cornerRadius: resolveJS(p.cornerRadius ?? 0),
    topLeftCornerRadius: p.topLeftCornerRadius != null ? resolveJS(p.topLeftCornerRadius) : undefined,
    topRightCornerRadius: p.topRightCornerRadius != null ? resolveJS(p.topRightCornerRadius) : undefined,
    bottomRightCornerRadius: p.bottomRightCornerRadius != null ? resolveJS(p.bottomRightCornerRadius) : undefined,
    bottomLeftCornerRadius: p.bottomLeftCornerRadius != null ? resolveJS(p.bottomLeftCornerRadius) : undefined,
    cornerSmoothing: resolveJS(p.cornerSmoothing),
    fillColor: resolveJS(p.fillColor ?? '#000000'),
    gradient: p.gradient,
    strokeColor: resolveJS(p.strokeColor ?? '#000000'),
    strokeWidth: resolveJS(p.strokeWidth ?? 0)
  };
}

/** Shallow equality check on SquircleParams to avoid redundant re-renders. */
function paramsEqual(a, b) {
  return a.cornerRadius === b.cornerRadius && a.topLeftCornerRadius === b.topLeftCornerRadius && a.topRightCornerRadius === b.topRightCornerRadius && a.bottomRightCornerRadius === b.bottomRightCornerRadius && a.bottomLeftCornerRadius === b.bottomLeftCornerRadius && a.cornerSmoothing === b.cornerSmoothing && a.fillColor === b.fillColor && a.strokeColor === b.strokeColor && a.strokeWidth === b.strokeWidth && a.gradient === b.gradient;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Drives a RAF loop that reads SharedValues every frame and updates React
 * state only when something actually changed. When no animation is running
 * (all values stable), the shallow-equal guard short-circuits and no
 * re-renders occur.
 */
function useResolvedSquircleParams(animated) {
  const ref = useRef(animated);
  ref.current = animated;
  const [params, setParams] = useState(() => snapshot(animated));
  useEffect(() => {
    let rafId;
    const tick = () => {
      const next = snapshot(ref.current);
      setParams(prev => paramsEqual(prev, next) ? prev : next);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []); // intentionally empty — RAF loop runs for the lifetime of the component

  return params;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnimatedSquircleView({
  animatedSquircleParams,
  children,
  ...viewProps
}) {
  const params = useResolvedSquircleParams(animatedSquircleParams);
  return (
    /*#__PURE__*/
    /**
     * Animated.View lets consumers pass useAnimatedStyle() to `style`, exactly
     * as they would with a regular <Animated.View>. It does NOT receive any
     * animatedProps from us — only the static `style` spread from the user.
     */
    _jsxs(Animated.View, {
      ...viewProps,
      children: [/*#__PURE__*/_jsx(SquircleBackground, {
        ...params
      }), children]
    })
  );
}
//# sourceMappingURL=AnimatedSquircleView.js.map