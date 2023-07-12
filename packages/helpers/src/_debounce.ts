/**
 * Debouce helper to invoke a method with a delay
 *
 * @deprecated - use useDebounceFn from @vueuse/core instead
 */
export function _debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): T {
  let prevTimer: number | null = null;
  return ((...args: any[]) => {
    if (prevTimer) {
      clearTimeout(prevTimer);
    }
    prevTimer = window.setTimeout(() => {
      fn(...args);
      prevTimer = null;
    }, delay);
  }) as any;
}
