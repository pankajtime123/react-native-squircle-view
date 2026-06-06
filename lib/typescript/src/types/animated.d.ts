/**
 * animated.ts
 *
 * Types specific to the Reanimated-powered animated API.
 * Kept separate from types/index.ts so the base library remains
 * import-free from react-native-reanimated.
 */
import type { AnimatedProps } from 'react-native-reanimated';
import type { ViewProps } from 'react-native';
import type { GradientParams } from './index';
/**
 * Minimal structural duck-type for a Reanimated SharedValue<T>.
 *
 * We intentionally do NOT import `SharedValue` from 'react-native-reanimated'
 * here. In a monorepo / library setup the consumer's app and the library itself
 * can resolve *different* copies of reanimated, which makes the two nominal
 * `SharedValue` types incompatible even though they are structurally identical.
 * By defining our own minimal interface (matching the public surface) TypeScript
 * resolves compatibility structurally, so both copies are accepted.
 */
export interface SharedValue<T> {
    value: T;
    get(): T;
    set(value: T | ((current: T) => T)): void;
    addListener(id: number, listener: (value: T) => void): void;
    removeListener(id: number): void;
    modify(modifier?: (value: T) => T, forceUpdate?: boolean): void;
}
/**
 * A prop that can be either a plain value or a Reanimated SharedValue.
 * Mirrors the pattern used by Reanimated's own animated components.
 */
export type MaybeAnimated<T> = T | SharedValue<T>;
/**
 * Animatable version of SquircleParams.
 *
 * Every numeric field accepts either a raw `number` or a `SharedValue<number>`.
 * When a SharedValue is passed, the SVG path is recomputed on the UI thread
 * every frame — no JS-thread involvement after mount.
 *
 * `gradient` is intentionally kept non-animated: react-native-svg does not
 * support driving SVG <Stop> props via useAnimatedProps.
 */
export interface AnimatedSquircleParams {
    cornerRadius?: MaybeAnimated<number>;
    topLeftCornerRadius?: MaybeAnimated<number>;
    topRightCornerRadius?: MaybeAnimated<number>;
    bottomRightCornerRadius?: MaybeAnimated<number>;
    bottomLeftCornerRadius?: MaybeAnimated<number>;
    cornerSmoothing: MaybeAnimated<number>;
    /** Solid fill color. Animatable via SharedValue<string>. */
    fillColor?: MaybeAnimated<string>;
    /** SVG gradient fill — not animatable, stays as plain GradientParams. */
    gradient?: GradientParams;
    strokeColor?: MaybeAnimated<string>;
    strokeWidth?: MaybeAnimated<number>;
}
/**
 * Props for the public <AnimatedSquircleView> component.
 *
 * Extends `AnimatedProps<ViewProps>` (rather than plain `ViewProps`) so that
 * all Reanimated layout-animation props — `entering`, `exiting`, `layout`,
 * `animatedProps`, etc. — are accepted without TypeScript errors. This mirrors
 * how `Animated.View` itself is typed internally by Reanimated.
 */
export interface AnimatedSquircleViewProps extends AnimatedProps<ViewProps> {
    animatedSquircleParams: AnimatedSquircleParams;
}
//# sourceMappingURL=animated.d.ts.map