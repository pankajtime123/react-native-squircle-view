/**
 * SquircleBackground.tsx
 *
 * Renders the SVG squircle shape (with optional gradient and/or stroke) as an
 * absolutely-positioned layer that fills its parent container.
 *
 * Responsibilities (single):
 *  - Resolve the SVG path from figma-squircle using the measured size.
 *  - Handle stroke-inset math so the stroke stays inside the shape.
 *  - Delegate gradient <defs> rendering to <GradientDefs>.
 *  - Delegate size measurement to <Rect>.
 *
 * This component is intentionally NOT exported from the library's public API.
 */
import * as React from 'react';
import type { SquircleParams } from '../types';
export declare function SquircleBackground({ cornerRadius, topLeftCornerRadius, topRightCornerRadius, bottomRightCornerRadius, bottomLeftCornerRadius, cornerSmoothing, fillColor, gradient, strokeColor, strokeWidth, }: SquircleParams): React.ReactElement;
//# sourceMappingURL=SquircleBackground.d.ts.map