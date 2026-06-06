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
import type { PropsWithChildren } from 'react';
import type { AnimatedSquircleViewProps } from '../types/animated';
export declare function AnimatedSquircleView({ animatedSquircleParams, children, ...viewProps }: PropsWithChildren<AnimatedSquircleViewProps>): React.ReactElement;
//# sourceMappingURL=AnimatedSquircleView.d.ts.map