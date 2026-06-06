/**
 * GradientDefs.tsx
 *
 * Renders the SVG <defs> block for either a linear or radial gradient.
 *
 * Keeping this as a dedicated component means:
 *  - The switch between gradient types is isolated here.
 *  - Adding a new gradient type (e.g. "conic") only requires editing this file.
 *  - SquircleBackground stays focused on path geometry.
 */
import * as React from 'react';
import type { GradientParams } from '../types';
interface GradientDefsProps {
    gradient: GradientParams;
}
export declare function GradientDefs({ gradient, }: GradientDefsProps): React.ReactElement;
export {};
//# sourceMappingURL=GradientDefs.d.ts.map