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

/**
 * Counts the router's navigations. `sinceNow()` returns a check that says
 * whether any navigation started after it was taken.
 */
export function countNavigations(router: Pick<Router, "beforeEach">) {
  let started = 0;
  const stop = router.beforeEach(() => {
    started++;
  });
  return {
    sinceNow() {
      const start = started;
      return () => started !== start;
    },
    stop,
  };
}
