import { toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { Router } from "vue-router";

/** Resolves when `source` first has a value, or after `timeout` ms. */
export function whenSet(source: MaybeRefOrGetter<unknown>, timeout: number) {
  return new Promise<void>((resolve) => {
    if (toValue(source)) return resolve();
    const timer = setTimeout(done, timeout);
    const unwatch = watch(
      () => toValue(source),
      (value) => value && done(),
    );
    function done() {
      clearTimeout(timer);
      unwatch();
      resolve();
    }
  });
}

/** Settles like `promise`, or rejects with the stop reason when `stop` fires first. */
export function unlessStopped<T>(stop: AbortSignal, promise: Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(stop.reason);
    stop.addEventListener("abort", abort, { once: true });
    if (stop.aborted) abort();
    promise
      .then(resolve, reject)
      .finally(() => stop.removeEventListener("abort", abort));
  });
}

/**
 * Remembers when the shopper last started a navigation. The tools wrap
 * their own navigations in `own()`, so those do not count.
 */
export function trackNavigations(router: Pick<Router, "beforeEach">) {
  let last = -Infinity;
  let own = 0;
  const stop = router.beforeEach(() => {
    if (!own) last = performance.now();
  });
  return {
    /** A check that says whether the shopper navigated after `time`. */
    since: (time: number) => () => last > time,
    async own<T>(navigate: () => T) {
      own++;
      try {
        return await navigate();
      } finally {
        own--;
      }
    },
    stop,
  };
}
