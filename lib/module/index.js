"use strict";

/**
 * src/index.tsx — Public API barrel
 *
 * This file is the single entry-point for library consumers.
 * It intentionally re-exports only what belongs to the public API.
 * Internal implementation details (Rect, hooks, etc.)
 * are NOT re-exported so they can be refactored freely without semver bumps.
 */

// ── Static components ─────────────────────────────────────────────────────────
export { SquircleView } from "./components/SquircleView.js";
export { SquircleBackground } from "./components/SquircleBackground.js";

// ── Animated components (requires react-native-reanimated peer dep) ───────────
export { AnimatedSquircleView } from "./components/AnimatedSquircleView.js";
export { AnimatedSquircleView as AnimatedSquircleBackground } from "./components/AnimatedSquircleView.js";

// ── Types ─────────────────────────────────────────────────────────────────────

// ── Utilities (escape hatch for advanced custom SVG use-cases) ────────────────
export { getSvgPath } from 'figma-squircle';

/**
 * getSvgPathWorklet — worklet-compatible path generator.
 * Use this if you need to compute the squircle path inside your own
 * `useAnimatedProps` worklet.
 */
export { getSvgPathWorklet } from "./utils/squirclePathWorklet.js";
//# sourceMappingURL=index.js.map