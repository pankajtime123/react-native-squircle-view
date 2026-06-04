/**
 * Rect.tsx
 *
 * A render-prop component that measures its own layout dimensions and passes
 * the resolved { width, height } to its children function.
 *
 * This pattern cleanly separates "how big am I?" from "what should I draw?",
 * keeping SquircleBackground focused purely on SVG rendering.
 *
 * Inspired by https://reach.tech/rect/
 */

import * as React from 'react'
import { View } from 'react-native'
import { useViewSize } from '../hooks/useViewSize'
import type { RectProps } from '../types'

export function Rect({ children, ...viewProps }: RectProps): React.ReactElement {
  const { size, ref } = useViewSize()

  return (
    <View ref={ref} {...viewProps}>
      {size != null ? children(size) : null}
    </View>
  )
}
