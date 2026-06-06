/**
 * platform.ts
 *
 * React Native platform / architecture detection utilities.
 */
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
export declare function isSyncLayoutAccessAvailable(): boolean;
//# sourceMappingURL=platform.d.ts.map