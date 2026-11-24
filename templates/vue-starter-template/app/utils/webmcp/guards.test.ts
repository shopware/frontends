import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import type { NavigationGuard } from "vue-router";

import { trackNavigations, unlessStopped, whenSet } from "./guards";

describe("whenSet", () => {
  it("resolves at once when the value is there", async () => {
    const done = vi.fn();
    void whenSet(ref({ lineItems: [] }), 1000).then(done);
    await nextTick();
    await Promise.resolve();
    expect(done).toHaveBeenCalled();
  });

  it("waits until the value arrives", async () => {
    const cart = ref<object>();
    const done = vi.fn();
    void whenSet(cart, 1000).then(done);
    await nextTick();
    expect(done).not.toHaveBeenCalled();

    cart.value = { lineItems: [] };
    await nextTick();
    await Promise.resolve();
    expect(done).toHaveBeenCalled();
  });

  it("gives up after the time limit", async () => {
    vi.useFakeTimers();
    const done = vi.fn();
    void whenSet(ref(), 10_000).then(done);
    await vi.advanceTimersByTimeAsync(9_999);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe("unlessStopped", () => {
  it("gives the answer when nothing stops it", async () => {
    const stop = new AbortController().signal;
    await expect(unlessStopped(stop, Promise.resolve("cart"))).resolves.toBe(
      "cart",
    );
  });

  it("stops waiting when the call is stopped, and ignores a late failure", async () => {
    const controller = new AbortController();
    let fail = (_error: Error) => {};
    const read = new Promise((_resolve, reject) => {
      fail = reject;
    });
    const answer = unlessStopped(controller.signal, read);
    controller.abort(new Error("cancelled"));
    await expect(answer).rejects.toThrow("cancelled");
    fail(new Error("too late"));
    await Promise.resolve();
  });

  it("does not wait at all when the call is already stopped", async () => {
    const controller = new AbortController();
    controller.abort(new Error("cancelled"));
    await expect(
      unlessStopped(controller.signal, new Promise(() => {})),
    ).rejects.toThrow("cancelled");
  });
});

describe("trackNavigations", () => {
  function fakeRouter(loaded = Promise.resolve()) {
    const guards = new Set<NavigationGuard>();
    return {
      beforeEach(guard: NavigationGuard) {
        guards.add(guard);
        return () => guards.delete(guard);
      },
      resolve: (to: unknown) => ({ fullPath: String(to) }) as never,
      isReady: () => loaded,
      navigate(fullPath: string, from = "/") {
        type Guard = (to: object, from: object) => unknown;
        for (const guard of guards) {
          void (guard as Guard)({ fullPath }, { fullPath: from });
        }
      },
      guards,
    };
  }

  const later = () => new Promise((resolve) => setTimeout(resolve, 2));

  it("tells a call whether the shopper navigated after it was made", async () => {
    const router = fakeRouter();
    const { since } = trackNavigations(router);
    const movedOn = since(performance.now());
    expect(movedOn()).toBe(false);

    await later();
    router.navigate("/wooden-iplug");
    expect(movedOn()).toBe(true);
    expect(since(performance.now())()).toBe(false);
  });

  it("does not count the tools' own navigations", async () => {
    const router = fakeRouter();
    const { own, since } = trackNavigations(router);
    const movedOn = since(performance.now());
    await later();
    await own("/search", () => router.navigate("/search"));
    expect(movedOn()).toBe(false);
  });

  it("counts a shopper's click while the tools' own page loads", async () => {
    // The click can come after the tools' guard, before it, or cancel the
    // tools' navigation so that its guard never runs.
    for (const clicks of [
      ["/search", "/wooden-iplug"],
      ["/wooden-iplug", "/search"],
      ["/wooden-iplug"],
    ]) {
      const router = fakeRouter();
      const { own, since } = trackNavigations(router);
      const movedOn = since(performance.now());
      await later();
      await own("/search", () => {
        for (const path of clicks) router.navigate(path);
      });
      expect(movedOn()).toBe(true);
    }
  });

  it("does not count the page load's own first navigation", async () => {
    let load = () => {};
    const router = fakeRouter(
      new Promise<void>((resolve) => {
        load = resolve;
      }),
    );
    const { since } = trackNavigations(router);
    const movedOn = since(performance.now());
    await later();
    router.navigate("/wooden-iplug");
    expect(movedOn()).toBe(false);

    load();
    await later();
    router.navigate("/search");
    expect(movedOn()).toBe(true);
  });

  it("does not count a navigation to the page the shopper is on", async () => {
    const router = fakeRouter();
    const { since } = trackNavigations(router);
    const movedOn = since(performance.now());
    await later();
    router.navigate("/candles?order=name-asc", "/candles?order=name-asc");
    expect(movedOn()).toBe(false);
  });

  it("removes its router guard when stopped", () => {
    const router = fakeRouter();
    const { stop } = trackNavigations(router);
    expect(router.guards.size).toBe(1);
    stop();
    expect(router.guards.size).toBe(0);
  });
});
