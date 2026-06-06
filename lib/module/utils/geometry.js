"use strict";

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
export function getInnerRadius(radius, insetAmount) {
  if (radius != null && radius > 0) {
    return Math.max(0, radius - insetAmount);
  }
  return radius;
}

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
export function clampStrokeWidth(strokeWidth, cornerRadius, topLeftCornerRadius, topRightCornerRadius, bottomLeftCornerRadius, bottomRightCornerRadius) {
  const definedRadii = [cornerRadius, topLeftCornerRadius, topRightCornerRadius, bottomLeftCornerRadius, bottomRightCornerRadius].filter(r => r != null && r > 0);
  if (definedRadii.length === 0) return strokeWidth;
  const maxAllowed = Math.min(...definedRadii);
  return Math.min(strokeWidth, maxAllowed);
}
//# sourceMappingURL=geometry.js.map