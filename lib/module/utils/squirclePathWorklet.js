"use strict";

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

// ─── Types (inlined — no import allowed inside worklets) ─────────────────────

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toRadiansW(degrees) {
  'worklet';

  return degrees * Math.PI / 180;
}
function fixedW(n) {
  'worklet';

  return n.toFixed(4);
}

// ─── Corner params computation ────────────────────────────────────────────────

function getPathParamsForCornerW(cornerRadius, cornerSmoothing, preserveSmoothing, roundingAndSmoothingBudget) {
  'worklet';

  let cs = cornerSmoothing;
  let p = (1 + cs) * cornerRadius;
  if (!preserveSmoothing) {
    const maxCornerSmoothing = roundingAndSmoothingBudget / cornerRadius - 1;
    cs = Math.min(cs, maxCornerSmoothing);
    p = Math.min(p, roundingAndSmoothingBudget);
  }
  const arcMeasure = 90 * (1 - cs);
  const arcSectionLength = Math.sin(toRadiansW(arcMeasure / 2)) * cornerRadius * Math.sqrt(2);
  const angleAlpha = (90 - arcMeasure) / 2;
  const p3ToP4Distance = cornerRadius * Math.tan(toRadiansW(angleAlpha / 2));
  const angleBeta = 45 * cs;
  const c = p3ToP4Distance * Math.cos(toRadiansW(angleBeta));
  const d = c * Math.tan(toRadiansW(angleBeta));
  let b = (p - arcSectionLength - c - d) / 3;
  let a = 2 * b;
  if (preserveSmoothing && p > roundingAndSmoothingBudget) {
    const p1ToP3MaxDistance = roundingAndSmoothingBudget - d - arcSectionLength - c;
    const minA = p1ToP3MaxDistance / 6;
    const maxB = p1ToP3MaxDistance - minA;
    b = Math.min(b, maxB);
    a = p1ToP3MaxDistance - b;
    p = Math.min(p, roundingAndSmoothingBudget);
  }
  return {
    a,
    b,
    c,
    d,
    p,
    arcSectionLength,
    cornerRadius
  };
}

// ─── Corner path segments ─────────────────────────────────────────────────────

function drawTopRightW(params) {
  'worklet';

  const {
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  } = params;
  if (cornerRadius) {
    return `c ${fixedW(a)} 0 ${fixedW(a + b)} 0 ${fixedW(a + b + c)} ${fixedW(d)} ` + `a ${fixedW(cornerRadius)} ${fixedW(cornerRadius)} 0 0 1 ${fixedW(arcSectionLength)} ${fixedW(arcSectionLength)} ` + `c ${fixedW(d)} ${fixedW(c)} ${fixedW(d)} ${fixedW(b + c)} ${fixedW(d)} ${fixedW(a + b + c)}`;
  }
  return `l ${fixedW(p)} 0`;
}
function drawBottomRightW(params) {
  'worklet';

  const {
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  } = params;
  if (cornerRadius) {
    return `c 0 ${fixedW(a)} 0 ${fixedW(a + b)} ${fixedW(-d)} ${fixedW(a + b + c)} ` + `a ${fixedW(cornerRadius)} ${fixedW(cornerRadius)} 0 0 1 -${fixedW(arcSectionLength)} ${fixedW(arcSectionLength)} ` + `c ${fixedW(-c)} ${fixedW(d)} ${fixedW(-(b + c))} ${fixedW(d)} ${fixedW(-(a + b + c))} ${fixedW(d)}`;
  }
  return `l 0 ${fixedW(p)}`;
}
function drawBottomLeftW(params) {
  'worklet';

  const {
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  } = params;
  if (cornerRadius) {
    return `c ${fixedW(-a)} 0 ${fixedW(-(a + b))} 0 ${fixedW(-(a + b + c))} ${fixedW(-d)} ` + `a ${fixedW(cornerRadius)} ${fixedW(cornerRadius)} 0 0 1 -${fixedW(arcSectionLength)} -${fixedW(arcSectionLength)} ` + `c ${fixedW(-d)} ${fixedW(-c)} ${fixedW(-d)} ${fixedW(-(b + c))} ${fixedW(-d)} ${fixedW(-(a + b + c))}`;
  }
  return `l ${fixedW(-p)} 0`;
}
function drawTopLeftW(params) {
  'worklet';

  const {
    cornerRadius,
    a,
    b,
    c,
    d,
    p,
    arcSectionLength
  } = params;
  if (cornerRadius) {
    return `c 0 ${fixedW(-a)} 0 ${fixedW(-(a + b))} ${fixedW(d)} ${fixedW(-(a + b + c))} ` + `a ${fixedW(cornerRadius)} ${fixedW(cornerRadius)} 0 0 1 ${fixedW(arcSectionLength)} -${fixedW(arcSectionLength)} ` + `c ${fixedW(c)} ${fixedW(-d)} ${fixedW(b + c)} ${fixedW(-d)} ${fixedW(a + b + c)} ${fixedW(-d)}`;
  }
  return `l 0 ${fixedW(-p)}`;
}

// ─── SVG path assembly ────────────────────────────────────────────────────────

function getSVGPathFromParamsW(width, height, tl, tr, br, bl) {
  'worklet';

  return `M ${fixedW(width - tr.p)} 0 ` + drawTopRightW(tr) + ' ' + `L ${fixedW(width)} ${fixedW(height - br.p)} ` + drawBottomRightW(br) + ' ' + `L ${fixedW(bl.p)} ${fixedW(height)} ` + drawBottomLeftW(bl) + ' ' + `L 0 ${fixedW(tl.p)} ` + drawTopLeftW(tl) + ' Z';
}

// ─── Distribute & normalize (handles mixed corner radii) ─────────────────────

/**
 * Replicates figma-squircle's `distributeAndNormalize`.
 * Distributes the rounding/smoothing budget across corners so that adjacent
 * corners never overlap, regardless of how large they are.
 */
function distributeAndNormalizeW(tlR, trR, brR, blR, width, height) {
  'worklet';

  // Budget map — -1 means "not yet assigned"
  let tlBudget = -1;
  let trBudget = -1;
  let brBudget = -1;
  let blBudget = -1;

  // Process corners from largest to smallest radius (largest corners get priority)
  const corners = [{
    key: 'tl',
    radius: tlR
  }, {
    key: 'tr',
    radius: trR
  }, {
    key: 'br',
    radius: brR
  }, {
    key: 'bl',
    radius: blR
  }].sort((a, b) => b.radius - a.radius);
  const getRadius = key => {
    'worklet';

    if (key === 'tl') return tlR;
    if (key === 'tr') return trR;
    if (key === 'br') return brR;
    return blR;
  };
  const getBudget = key => {
    'worklet';

    if (key === 'tl') return tlBudget;
    if (key === 'tr') return trBudget;
    if (key === 'br') return brBudget;
    return blBudget;
  };
  const setBudget = (key, value) => {
    'worklet';

    if (key === 'tl') tlBudget = value;else if (key === 'tr') trBudget = value;else if (key === 'br') brBudget = value;else blBudget = value;
  };
  const setRadius = (key, value) => {
    'worklet';

    if (key === 'tl') tlR = value;else if (key === 'tr') trR = value;else if (key === 'br') brR = value;else blR = value;
  };

  // adjacents: [corner, side-length]
  const adjacents = {
    tl: [['tr', width], ['bl', height]],
    tr: [['tl', width], ['br', height]],
    bl: [['br', width], ['tl', height]],
    br: [['bl', width], ['tr', height]]
  };
  for (const {
    key
  } of corners) {
    const radius = getRadius(key);
    const adjs = adjacents[key];
    let budget = Number.MAX_VALUE;
    for (const [adjKey, sideLength] of adjs) {
      const adjRadius = getRadius(adjKey);
      if (radius === 0 && adjRadius === 0) {
        budget = Math.min(budget, 0);
        continue;
      }
      const adjBudget = getBudget(adjKey);
      if (adjBudget >= 0) {
        budget = Math.min(budget, sideLength - adjBudget);
      } else {
        budget = Math.min(budget, radius / (radius + adjRadius) * sideLength);
      }
    }
    setBudget(key, budget);
    setRadius(key, Math.min(radius, budget));
  }
  return {
    tl: {
      radius: tlR,
      roundingAndSmoothingBudget: tlBudget
    },
    tr: {
      radius: trR,
      roundingAndSmoothingBudget: trBudget
    },
    br: {
      radius: brR,
      roundingAndSmoothingBudget: brBudget
    },
    bl: {
      radius: blR,
      roundingAndSmoothingBudget: blBudget
    }
  };
}

// ─── Public worklet entry point ───────────────────────────────────────────────

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
export function getSvgPathWorklet({
  width,
  height,
  cornerRadius = 0,
  topLeftCornerRadius,
  topRightCornerRadius,
  bottomRightCornerRadius,
  bottomLeftCornerRadius,
  cornerSmoothing,
  preserveSmoothing = false
}) {
  'worklet';

  const tlR = topLeftCornerRadius ?? cornerRadius;
  const trR = topRightCornerRadius ?? cornerRadius;
  const brR = bottomRightCornerRadius ?? cornerRadius;
  const blR = bottomLeftCornerRadius ?? cornerRadius;

  // ── All corners equal → fast path (same as figma-squircle) ────────────────
  if (tlR === trR && trR === brR && brR === blR) {
    const budget = Math.min(width, height) / 2;
    const clampedRadius = Math.min(tlR, budget);
    const params = getPathParamsForCornerW(clampedRadius, cornerSmoothing, preserveSmoothing, budget);
    return getSVGPathFromParamsW(width, height, params, params, params, params);
  }

  // ── Mixed corners → distribute budget ─────────────────────────────────────
  const normalized = distributeAndNormalizeW(tlR, trR, brR, blR, width, height);
  const tlParams = getPathParamsForCornerW(normalized.tl.radius, cornerSmoothing, preserveSmoothing, normalized.tl.roundingAndSmoothingBudget);
  const trParams = getPathParamsForCornerW(normalized.tr.radius, cornerSmoothing, preserveSmoothing, normalized.tr.roundingAndSmoothingBudget);
  const brParams = getPathParamsForCornerW(normalized.br.radius, cornerSmoothing, preserveSmoothing, normalized.br.roundingAndSmoothingBudget);
  const blParams = getPathParamsForCornerW(normalized.bl.radius, cornerSmoothing, preserveSmoothing, normalized.bl.roundingAndSmoothingBudget);
  return getSVGPathFromParamsW(width, height, tlParams, trParams, brParams, blParams);
}
//# sourceMappingURL=squirclePathWorklet.js.map