import { describe, expect, it } from "vitest";

import { createLruCache } from "./lruCache";

function clock(start = 0) {
  let time = start;
  return {
    now: () => time,
    advance(ms: number) {
      time += ms;
    },
  };
}

describe("createLruCache", () => {
  it("serves an entry fresh, then stale, then forgets it", () => {
    const time = clock();
    const cache = createLruCache<string>({ max: 10, now: time.now });
    cache.set("a", "A", { ttlMs: 100, staleMs: 50 });

    expect(cache.get("a")).toEqual({ value: "A", state: "fresh" });
    time.advance(100);
    expect(cache.get("a")).toEqual({ value: "A", state: "stale" });
    time.advance(50);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it("evicts the least recently used entry", () => {
    const cache = createLruCache<string>({ max: 2, now: clock().now });
    const lifetime = { ttlMs: 1000, staleMs: 0 };
    cache.set("a", "A", lifetime);
    cache.set("b", "B", lifetime);
    cache.get("a");
    cache.set("c", "C", lifetime);

    expect(cache.get("a")?.value).toBe("A");
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("c")?.value).toBe("C");
  });

  it("replaces an entry and clears everything", () => {
    const cache = createLruCache<string>({ max: 2, now: clock().now });
    cache.set("a", "A", { ttlMs: 10, staleMs: 0 });
    cache.set("a", "B", { ttlMs: 10, staleMs: 0 });

    expect(cache.get("a")?.value).toBe("B");
    expect(cache.size).toBe(1);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});
