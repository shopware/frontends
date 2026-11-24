import { toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { RouteLocationRaw, Router } from "vue-router";

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
 * Remembers when the shopper last started a navigation. The tools open pages
 * through `own()`: only the navigation to that page does not count, so a
 * shopper's click while it loads still does.
 */
export function trackNavigations(
  router: Pick<Router, "beforeEach" | "resolve" | "isReady">,
) {
  let last = -Infinity;
  let ownTarget: string | undefined;
  // The page load's own first navigation is not the shopper's.
  let ready = false;
  const setReady = () => {
    ready = true;
  };
  router.isReady().then(setReady, setReady);
  const stop = router.beforeEach((to, from) => {
    // The app also navigates to the page it is on, for example right after start.
    if (!ready || to.fullPath === from.fullPath) return;
    if (ownTarget !== undefined && to.fullPath === ownTarget) {
      ownTarget = undefined;
      return;
    }
    last = performance.now();
  });
  return {
    /** A check that says whether the shopper navigated after `time`. */
    since: (time: number) => () => last > time,
    async own<T>(to: RouteLocationRaw, navigate: () => T) {
      ownTarget = router.resolve(to).fullPath;
      try {
        return await navigate();
      } finally {
        ownTarget = undefined;
      }
    },
    stop,
  };
}

export type NavigationTracker = ReturnType<typeof trackNavigations>;
