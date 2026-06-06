/**
 * squirclePathWorklet.ts
 *
 * A faithful, worklet-compatible port of the figma-squircle algorithm.
 * All functions in this file are annotated with `'worklet'` so they can be
 * called from Reanimated's `useAnimatedProps` on the UI thread without any
 * JS-thread involvement per animation frame.
 *
 * Source reference:
 *   node_modules/figma-squircle/src/draw.ts
 *   node_modules/figma-squircle/src/distribute.ts
 *   node_modules/figma-squircle/src/index.ts
 *
 * No external imports — pure math only (worklet constraint).
 */
interface SquirclePathInput {
    width: number;
    height: number;
    cornerRadius?: number;
    topLeftCornerRadius?: number;
    topRightCornerRadius?: number;
    bottomRightCornerRadius?: number;
    bottomLeftCornerRadius?: number;
    cornerSmoothing: number;
    preserveSmoothing?: boolean;
}
/**
 * getSvgPathWorklet
 *
 * Worklet-compatible equivalent of `figma-squircle`'s `getSvgPath`.
 * Call this inside `useAnimatedProps` to compute the SVG path on the UI thread.
 *
 * @example
 * const animatedProps = useAnimatedProps(() => {
 *   'worklet'
 *   return {
 *     d: getSvgPathWorklet({
 *       width: width.value,
 *       height: height.value,
 *       cornerRadius: cornerRadius.value,
 *       cornerSmoothing: 0.6,
 *     }),
 *   }
 * })
 */
export declare function getSvgPathWorklet({ width, height, cornerRadius, topLeftCornerRadius, topRightCornerRadius, bottomRightCornerRadius, bottomLeftCornerRadius, cornerSmoothing, preserveSmoothing, }: SquirclePathInput): string;
export {};
//# sourceMappingURL=squirclePathWorklet.d.ts.map