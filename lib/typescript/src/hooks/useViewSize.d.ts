/**
 * useViewSize.ts
 *
 * Custom hook that captures a View's rendered width & height using the
 * `onLayout` event.
 *
 * Using `onLayout` instead of `measureInWindow`:
 *  - Works on BOTH the old bridge architecture and the new (bridgeless) arch.
 *  - Does not require `useRef` or `useLayoutEffect`, keeping the hook count
 *    minimal and predictable — which matters when parent components are wrapped
 *    by Reanimated's `createAnimatedComponent`.
 *  - `onLayout` fires after the native layout pass with exact pixel dimensions.
 */
import type { LayoutChangeEvent } from 'react-native';
import type { ViewSize } from '../types';
interface UseViewSizeResult {
    /** Resolved layout size, or null before first layout event. */
    size: ViewSize | null;
    /** Pass this handler to the View's `onLayout` prop. */
    onLayout: (e: LayoutChangeEvent) => void;
}
/**
 * Returns a `size` state and an `onLayout` handler.
 * The size is null until the View's first layout event fires.
 *
 * @example
 * function MyComponent() {
 *   const { size, onLayout } = useViewSize()
 *   return (
 *     <View onLayout={onLayout}>
 *       {size && <Text>{size.width} x {size.height}</Text>}
 *     </View>
 *   )
 * }
 */
export declare function useViewSize(): UseViewSizeResult;
export {};
//# sourceMappingURL=useViewSize.d.ts.map