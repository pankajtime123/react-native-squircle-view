/**
 * geometry.ts
 *
 * Pure, side-effect-free geometry helpers.
 * All functions here are stateless and have no React dependencies.
 */
/**
 * Returns the inner corner radius after subtracting the stroke inset.
 * Clamps to 0 so we never produce a negative radius.
 *
 * @param radius     - Original corner radius (may be undefined).
 * @param insetAmount - Half of the stroke width to subtract.
 */
export declare function getInnerRadius(radius: number | undefined, insetAmount: number): number | undefined;
/**
 * Clamps `strokeWidth` so it never exceeds the smallest defined corner radius.
 * This prevents the stroke from visually overflowing the squircle shape.
 *
 * @param strokeWidth             - Desired stroke width.
 * @param cornerRadius            - Uniform corner radius.
 * @param topLeftCornerRadius     - Optional per-corner override.
 * @param topRightCornerRadius    - Optional per-corner override.
 * @param bottomLeftCornerRadius  - Optional per-corner override.
 * @param bottomRightCornerRadius - Optional per-corner override.
 */
export declare function clampStrokeWidth(strokeWidth: number, cornerRadius: number, topLeftCornerRadius?: number, topRightCornerRadius?: number, bottomLeftCornerRadius?: number, bottomRightCornerRadius?: number): number;
//# sourceMappingURL=geometry.d.ts.map