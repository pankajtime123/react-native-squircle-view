/**
 * useViewSize.ts
 *
 * Custom hook that measures a View's rendered width & height using
 * `measureInWindow` (new-arch / bridgeless only).
 *
 * Returns `null` until the first measurement is available, so callers can
 * defer rendering child content until real dimensions are known.
 */

import { useState, useRef, useLayoutEffect } from 'react'
import type { ViewSize } from '../types'
import { isSyncLayoutAccessAvailable } from '../utils/platform'

interface UseViewSizeResult {
  /** Resolved layout size, or null before first measurement. */
  size: ViewSize | null
  /** Ref to attach to the measured <View>. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: React.RefObject<any>
}

/**
 * Measures the width/height of a View after its first layout.
 *
 * @example
 * function MyComponent() {
 *   const { size, ref } = useViewSize()
 *   return (
 *     <View ref={ref}>
 *       {size && <Text>{size.width} x {size.height}</Text>}
 *     </View>
 *   )
 * }
 */
export function useViewSize(): UseViewSizeResult {
  const [size, setSize] = useState<ViewSize | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null)

  useLayoutEffect(() => {
    if (!isSyncLayoutAccessAvailable()) {
      throw new Error(
        "react-native-squircle-view requires React Native's new architecture (bridgeless mode)."
      )
    }

    // TODO: Migrate to `getBoundingClientRect` once it is stable in RN.
    // https://gist.github.com/lunaleaps/148756563999c83220887757f2e549a3
    ref.current?.measureInWindow(
      (_x: number, _y: number, width: number, height: number) => {
        setSize({ width, height })
      }
    )
  }, [])

  return { size, ref }
}
