"use strict";

/**
 * platform.ts
 *
 * React Native platform / architecture detection utilities.
 */

import { Platform } from 'react-native';

/**
 * Returns true when synchronous layout measurement (`measureInWindow`) is
 * available in the current runtime.
 *
 * - **Web**: always available via the DOM.
 * - **Native**: only available on the new architecture (bridgeless mode).
 *
 * @throws Will not throw here — callers are responsible for acting on the
 *         return value and surfacing errors to the user.
 */
export function isSyncLayoutAccessAvailable() {
  if (Platform.OS === 'web') return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return globalThis.RN$Bridgeless === true;
}
//# sourceMappingURL=platform.js.map