/**
 * useAnimatedSquircleProps.ts
 *
 * Core hook that bridges Reanimated SharedValues with SVG path props.
 *
 * ─── WHY everything is in one file ──────────────────────────────────────────
 * The react-native-worklets Babel plugin (used by Reanimated 4) transforms
 * worklets ONE FILE AT A TIME — it does NOT follow `import` statements.
 * Cross-file worklet calls therefore fail at runtime because the UI thread
 * cannot resolve imported symbols.
 *
 * Solution: every function called from inside `useAnimatedProps` must be
 * defined WITH the `'worklet'` directive IN THIS SAME FILE so the plugin
 * inlines them all into the single worklet closure.
 *
 * `squirclePathWorklet.ts` is kept for the public `getSvgPathWorklet` export
 * (useful for non-animated, JS-thread path computation), but is NOT imported
 * here.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { AnimatedSquircleParams } from '../types/animated';
interface UseAnimatedSquirclePropsInput {
    params: AnimatedSquircleParams;
    width: number;
    height: number;
}
export declare function useAnimatedSquircleProps({ params, width, height, }: UseAnimatedSquirclePropsInput): {
    animatedPathProps: Partial<{
        d: string;
        fill: string;
        stroke: string;
        strokeWidth: number;
    }>;
};
export {};
//# sourceMappingURL=useAnimatedSquircleProps.d.ts.map