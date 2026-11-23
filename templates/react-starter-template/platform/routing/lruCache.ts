export type CacheLookup<V> = { value: V; state: "fresh" | "stale" };

export type LruCache<V> = {
  get(key: string): CacheLookup<V> | undefined;
  set(
    key: string,
    value: V,
    lifetime: { ttlMs: number; staleMs: number },
  ): void;
  clear(): void;
  readonly size: number;
};

type Entry<V> = { value: V; freshUntil: number; staleUntil: number };

export function createLruCache<V>({
  max,
  now = Date.now,
}: {
  max: number;
  now?: () => number;
}): LruCache<V> {
  const entries = new Map<string, Entry<V>>();

  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry) return undefined;
      const time = now();
      if (time >= entry.staleUntil) {
        entries.delete(key);
        return undefined;
      }
      entries.delete(key);
      entries.set(key, entry);
      return {
        value: entry.value,
        state: time < entry.freshUntil ? "fresh" : "stale",
      };
    },
    set(key, value, { ttlMs, staleMs }) {
      const time = now();
      entries.delete(key);
      entries.set(key, {
        value,
        freshUntil: time + ttlMs,
        staleUntil: time + ttlMs + staleMs,
      });
      while (entries.size > max) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined) break;
        entries.delete(oldest);
      }
    },
    clear() {
      entries.clear();
    },
    get size() {
      return entries.size;
    },
  };
}
