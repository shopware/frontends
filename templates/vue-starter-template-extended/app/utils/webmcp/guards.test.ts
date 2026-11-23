import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import type { NavigationGuard } from "vue-router";

import { countNavigations, whenSet } from "./guards";

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

describe("countNavigations", () => {
  function fakeRouter() {
    const guards = new Set<NavigationGuard>();
    return {
      beforeEach(guard: NavigationGuard) {
        guards.add(guard);
        return () => guards.delete(guard);
      },
      navigate() {
        for (const guard of guards) {
          void (guard as () => unknown)();
        }
      },
      guards,
    };
  }

  it("tells a call whether the shopper started a navigation since", () => {
    const router = fakeRouter();
    const { sinceNow } = countNavigations(router);
    const movedOn = sinceNow();
    expect(movedOn()).toBe(false);

    router.navigate();
    expect(movedOn()).toBe(true);
    expect(sinceNow()()).toBe(false);
  });

  it("removes its router guard when stopped", () => {
    const router = fakeRouter();
    const { stop } = countNavigations(router);
    expect(router.guards.size).toBe(1);
    stop();
    expect(router.guards.size).toBe(0);
  });
});
