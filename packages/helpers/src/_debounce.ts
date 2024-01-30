/**
 * Debouce helper to invoke a method with a delay
 *
 * @deprecated - use useDebounceFn from @vueuse/core instead
 */

// biome-ignore lint/suspicious/noExplicitAny: deprecated method, will be removed
export function _debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
): T {
  let prevTimer: number | null = null;
  // biome-ignore lint/suspicious/noExplicitAny: deprecated method, will be removed
  return ((...args: any[]) => {
    if (prevTimer) {
      clearTimeout(prevTimer);
    }
    prevTimer = window.setTimeout(() => {
      fn(...args);
      prevTimer = null;
    }, delay);
    // biome-ignore lint/suspicious/noExplicitAny: deprecated method, will be removed
  }) as any;
}
