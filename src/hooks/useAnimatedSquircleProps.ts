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

import { useAnimatedProps } from 'react-native-reanimated'
import type { SharedValue } from '../types/animated'
import type { AnimatedSquircleParams } from '../types/animated'
import { GRADIENT_DEF_ID } from '../constants'

// ─────────────────────────────────────────────────────────────────────────────
// Worklet helpers — ALL must live in this file
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves a MaybeAnimated<T> on the UI thread.
 * SharedValues are objects; plain number/string params are JS primitives.
 */
function resolveW<T>(v: T | SharedValue<T>): T {
  'worklet'
  if (v !== null && typeof v === 'object') {
    return (v as SharedValue<T>).value
  }
  return v as T
}

// ─── Inline worklet port of figma-squircle ────────────────────────────────
// Copied from squirclePathWorklet.ts so the Babel plugin sees everything
// in a single file and can inline it into the worklet closure.

function toRadW(deg: number): number {
  'worklet'
  return (deg * Math.PI) / 180
}

function fix4W(n: number): string {
  'worklet'
  return n.toFixed(4)
}

interface CornerW {
  a: number; b: number; c: number; d: number
  p: number; cornerRadius: number; arcSectionLength: number
}

function cornerParamsW(
  cr: number, cs: number, preserveSmoothing: boolean, budget: number
): CornerW {
  'worklet'
  let _cs = cs
  let p = (1 + _cs) * cr
  if (!preserveSmoothing) {
    _cs = Math.min(_cs, budget / cr - 1)
    p = Math.min(p, budget)
  }
  const arcMeasure = 90 * (1 - _cs)
  const arcLen = Math.sin(toRadW(arcMeasure / 2)) * cr * Math.sqrt(2)
  const alpha = (90 - arcMeasure) / 2
  const p3p4 = cr * Math.tan(toRadW(alpha / 2))
  const beta = 45 * _cs
  const c = p3p4 * Math.cos(toRadW(beta))
  const d = c * Math.tan(toRadW(beta))
  let b = (p - arcLen - c - d) / 3
  let a = 2 * b
  if (preserveSmoothing && p > budget) {
    const max = budget - d - arcLen - c
    b = Math.min(b, max - max / 6)
    a = max - b
    p = Math.min(p, budget)
  }
  return { a, b, c, d, p, cornerRadius: cr, arcSectionLength: arcLen }
}

function drawTRW(cp: CornerW): string {
  'worklet'
  if (cp.cornerRadius) {
    return `c ${fix4W(cp.a)} 0 ${fix4W(cp.a+cp.b)} 0 ${fix4W(cp.a+cp.b+cp.c)} ${fix4W(cp.d)} a ${fix4W(cp.cornerRadius)} ${fix4W(cp.cornerRadius)} 0 0 1 ${fix4W(cp.arcSectionLength)} ${fix4W(cp.arcSectionLength)} c ${fix4W(cp.d)} ${fix4W(cp.c)} ${fix4W(cp.d)} ${fix4W(cp.b+cp.c)} ${fix4W(cp.d)} ${fix4W(cp.a+cp.b+cp.c)}`
  }
  return `l ${fix4W(cp.p)} 0`
}

function drawBRW(cp: CornerW): string {
  'worklet'
  if (cp.cornerRadius) {
    return `c 0 ${fix4W(cp.a)} 0 ${fix4W(cp.a+cp.b)} ${fix4W(-cp.d)} ${fix4W(cp.a+cp.b+cp.c)} a ${fix4W(cp.cornerRadius)} ${fix4W(cp.cornerRadius)} 0 0 1 -${fix4W(cp.arcSectionLength)} ${fix4W(cp.arcSectionLength)} c ${fix4W(-cp.c)} ${fix4W(cp.d)} ${fix4W(-(cp.b+cp.c))} ${fix4W(cp.d)} ${fix4W(-(cp.a+cp.b+cp.c))} ${fix4W(cp.d)}`
  }
  return `l 0 ${fix4W(cp.p)}`
}

function drawBLW(cp: CornerW): string {
  'worklet'
  if (cp.cornerRadius) {
    return `c ${fix4W(-cp.a)} 0 ${fix4W(-(cp.a+cp.b))} 0 ${fix4W(-(cp.a+cp.b+cp.c))} ${fix4W(-cp.d)} a ${fix4W(cp.cornerRadius)} ${fix4W(cp.cornerRadius)} 0 0 1 -${fix4W(cp.arcSectionLength)} -${fix4W(cp.arcSectionLength)} c ${fix4W(-cp.d)} ${fix4W(-cp.c)} ${fix4W(-cp.d)} ${fix4W(-(cp.b+cp.c))} ${fix4W(-cp.d)} ${fix4W(-(cp.a+cp.b+cp.c))}`
  }
  return `l ${fix4W(-cp.p)} 0`
}

function drawTLW(cp: CornerW): string {
  'worklet'
  if (cp.cornerRadius) {
    return `c 0 ${fix4W(-cp.a)} 0 ${fix4W(-(cp.a+cp.b))} ${fix4W(cp.d)} ${fix4W(-(cp.a+cp.b+cp.c))} a ${fix4W(cp.cornerRadius)} ${fix4W(cp.cornerRadius)} 0 0 1 ${fix4W(cp.arcSectionLength)} -${fix4W(cp.arcSectionLength)} c ${fix4W(cp.c)} ${fix4W(-cp.d)} ${fix4W(cp.b+cp.c)} ${fix4W(-cp.d)} ${fix4W(cp.a+cp.b+cp.c)} ${fix4W(-cp.d)}`
  }
  return `l 0 ${fix4W(-cp.p)}`
}

function assembleSvgPathW(
  w: number, h: number,
  tl: CornerW, tr: CornerW, br: CornerW, bl: CornerW
): string {
  'worklet'
  return (
    `M ${fix4W(w - tr.p)} 0 ` + drawTRW(tr) +
    ` L ${fix4W(w)} ${fix4W(h - br.p)} ` + drawBRW(br) +
    ` L ${fix4W(bl.p)} ${fix4W(h)} ` + drawBLW(bl) +
    ` L 0 ${fix4W(tl.p)} ` + drawTLW(tl) + ' Z'
  )
}

function distributeBudgetW(
  tlR: number, trR: number, brR: number, blR: number, w: number, h: number
): { tl: {r: number; b: number}; tr: {r: number; b: number}; br: {r: number; b: number}; bl: {r: number; b: number} } {
  'worklet'
  let tlB = -1, trB = -1, brB = -1, blB = -1
  let _tlR = tlR, _trR = trR, _brR = brR, _blR = blR

  const adj: Record<string, Array<[string, number]>> = {
    tl: [['tr', w], ['bl', h]], tr: [['tl', w], ['br', h]],
    bl: [['br', w], ['tl', h]], br: [['bl', w], ['tr', h]],
  }

  const getR = (k: string) => {
    'worklet'
    if (k === 'tl') return _tlR; if (k === 'tr') return _trR
    if (k === 'br') return _brR; return _blR
  }
  const getB = (k: string) => {
    'worklet'
    if (k === 'tl') return tlB; if (k === 'tr') return trB
    if (k === 'br') return brB; return blB
  }
  const setB = (k: string, v: number) => {
    'worklet'
    if (k === 'tl') tlB = v; else if (k === 'tr') trB = v
    else if (k === 'br') brB = v; else blB = v
  }
  const setR = (k: string, v: number) => {
    'worklet'
    if (k === 'tl') _tlR = v; else if (k === 'tr') _trR = v
    else if (k === 'br') _brR = v; else _blR = v
  }

  const keys = ['tl', 'tr', 'br', 'bl']
    .map(k => ({ k, r: getR(k) }))
    .sort((a, b) => b.r - a.r)

  for (const { k } of keys) {
    const r = getR(k)
    let budget = Number.MAX_VALUE
    for (const [ak, side] of adj[k]!) {
      const ar = getR(ak)
      if (r === 0 && ar === 0) { budget = Math.min(budget, 0); continue }
      const ab = getB(ak)
      budget = Math.min(budget, ab >= 0 ? side - ab : (r / (r + ar)) * side)
    }
    setB(k, budget)
    setR(k, Math.min(r, budget))
  }

  return {
    tl: { r: _tlR, b: tlB }, tr: { r: _trR, b: trB },
    br: { r: _brR, b: brB }, bl: { r: _blR, b: blB },
  }
}

function computeSquirclePathW(
  width: number, height: number,
  cornerRadius: number, tlcr: number | undefined,
  trcr: number | undefined, brcr: number | undefined, blcr: number | undefined,
  cornerSmoothing: number
): string {
  'worklet'
  const tlR = tlcr ?? cornerRadius
  const trR = trcr ?? cornerRadius
  const brR = brcr ?? cornerRadius
  const blR = blcr ?? cornerRadius

  // Fast path: all corners equal
  if (tlR === trR && trR === brR && brR === blR) {
    const budget = Math.min(width, height) / 2
    const cr = Math.min(tlR, budget)
    const p = cornerParamsW(cr, cornerSmoothing, false, budget)
    return assembleSvgPathW(width, height, p, p, p, p)
  }

  // Mixed corners
  const { tl, tr, br, bl } = distributeBudgetW(tlR, trR, brR, blR, width, height)
  return assembleSvgPathW(
    width, height,
    cornerParamsW(tl.r, cornerSmoothing, false, tl.b),
    cornerParamsW(tr.r, cornerSmoothing, false, tr.b),
    cornerParamsW(br.r, cornerSmoothing, false, br.b),
    cornerParamsW(bl.r, cornerSmoothing, false, bl.b),
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Public hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseAnimatedSquirclePropsInput {
  params: AnimatedSquircleParams
  width: number
  height: number
}

export function useAnimatedSquircleProps({
  params,
  width,
  height,
}: UseAnimatedSquirclePropsInput) {
  const {
    cornerRadius,
    topLeftCornerRadius,
    topRightCornerRadius,
    bottomRightCornerRadius,
    bottomLeftCornerRadius,
    cornerSmoothing,
    fillColor,
    gradient,
    strokeColor,
    strokeWidth,
  } = params

  const animatedPathProps = useAnimatedProps(() => {
    'worklet'

    const cr  = resolveW(cornerRadius ?? 0)
    const tlcr = topLeftCornerRadius     != null ? resolveW(topLeftCornerRadius)     : undefined
    const trcr = topRightCornerRadius    != null ? resolveW(topRightCornerRadius)    : undefined
    const brcr = bottomRightCornerRadius != null ? resolveW(bottomRightCornerRadius) : undefined
    const blcr = bottomLeftCornerRadius  != null ? resolveW(bottomLeftCornerRadius)  : undefined
    const cs  = resolveW(cornerSmoothing)
    const sw  = resolveW(strokeWidth ?? 0)
    const fc  = resolveW(fillColor ?? '#000')
    const sc  = resolveW(strokeColor ?? '#000')

    const fill = gradient ? `url(#${GRADIENT_DEF_ID})` : fc

    if (sw <= 0) {
      const d = computeSquirclePathW(width, height, cr, tlcr, trcr, brcr, blcr, cs)
      return { d, fill, stroke: sc, strokeWidth: 0 }
    }

    const inset = sw / 2
    const d = computeSquirclePathW(
      width - sw, height - sw,
      cr  > 0 ? Math.max(0, cr  - inset) : cr,
      tlcr != null ? Math.max(0, tlcr - inset) : tlcr,
      trcr != null ? Math.max(0, trcr - inset) : trcr,
      brcr != null ? Math.max(0, brcr - inset) : brcr,
      blcr != null ? Math.max(0, blcr - inset) : blcr,
      cs,
    )
    return { d, fill, stroke: sc, strokeWidth: sw }
  })

  return { animatedPathProps }
}
