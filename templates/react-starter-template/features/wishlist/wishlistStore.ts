import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import type { StorefrontSession } from "@/features/session/types";
import type { Translate } from "@/i18n/translate";

import {
  CUSTOMER_NOT_LOGGED_IN,
  addWishlistProduct,
  hasApiErrorCode,
  readWishlistIds,
  removeWishlistProduct,
} from "./wishlistApi";
import type { WishlistClient, WishlistWriteOutcome } from "./wishlistApi";

export type WishlistStatus = "loading" | "ready" | "error";

export type WishlistState = {
  status: WishlistStatus;
  productIds: readonly string[];
  count: number;
};

export type WishlistActionResult = {
  ok: boolean;
  inWishlist: boolean;
  message?: string;
  loggedOut?: boolean;
};

export type WishlistStore = {
  getSnapshot(): WishlistState;
  subscribe(listener: () => void): () => void;
  syncSession(session: StorefrontSession): void;
  setTranslate(t: Translate): void;
  refresh(): Promise<void>;
  add(productId: string): Promise<WishlistActionResult>;
  remove(productId: string): Promise<WishlistActionResult>;
};

export const loadingWishlist: WishlistState = {
  status: "loading",
  productIds: [],
  count: 0,
};

const guestWishlist: WishlistState = {
  status: "ready",
  productIds: [],
  count: 0,
};

const GUEST_KEY = "guest";

export function wishlistSessionKey(session: StorefrontSession): string | null {
  if (session.status === "loading") return null;
  if (!session.isLoggedIn) return GUEST_KEY;
  return session.context?.customer?.id ?? null;
}

export function applyWishlistWrite(
  state: WishlistState,
  productId: string,
  adding: boolean,
  outcome: WishlistWriteOutcome,
): WishlistState {
  const others = state.productIds.filter((id) => id !== productId);
  const counted = state.status === "ready" && outcome === "changed";
  if (adding) {
    return {
      ...state,
      productIds: [productId, ...others],
      count: counted ? state.count + 1 : state.count,
    };
  }
  return {
    ...state,
    productIds: others,
    count: counted ? Math.max(0, state.count - 1) : state.count,
  };
}

function logReadFailure(error: unknown): void {
  console.error("[Wishlist] reading the wishlist failed", error);
}

function settle(): void {}

export function createWishlistStore(
  getClient: () => Promise<WishlistClient>,
  t: Translate,
): WishlistStore {
  let snapshot = loadingWishlist;
  let translate = t;
  const listeners = new Set<() => void>();
  let tail: Promise<void> = Promise.resolve();
  let sessionKey: string | null = null;
  let generation = 0;

  function publish(next: WishlistState): void {
    snapshot = next;
    for (const listener of listeners) listener();
  }

  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = tail.then(task);
    tail = run.then(settle, settle);
    return run;
  }

  function hasCustomer(): boolean {
    return sessionKey !== null && sessionKey !== GUEST_KEY;
  }

  function has(productId: string): boolean {
    return snapshot.productIds.includes(productId);
  }

  async function readIds(readGeneration: number): Promise<void> {
    try {
      const { productIds, total } = await readWishlistIds(await getClient());
      if (readGeneration !== generation) return;
      publish({ status: "ready", productIds, count: total });
    } catch (error) {
      if (readGeneration !== generation) return;
      logReadFailure(error);
      publish({ ...snapshot, status: "error" });
    }
  }

  function refresh(): Promise<void> {
    if (!hasCustomer()) return Promise.resolve();
    const readGeneration = generation;
    return enqueue(() => readIds(readGeneration));
  }

  function write(
    productId: string,
    adding: boolean,
  ): Promise<WishlistActionResult> {
    const writeGeneration = generation;
    return enqueue(async () => {
      if (writeGeneration !== generation || !hasCustomer()) {
        return { ok: false, inWishlist: has(productId) };
      }
      try {
        const client = await getClient();
        const outcome = adding
          ? await addWishlistProduct(client, productId)
          : await removeWishlistProduct(client, productId);
        if (writeGeneration === generation) {
          const reconcile =
            outcome === "unchanged" || snapshot.status !== "ready";
          publish(applyWishlistWrite(snapshot, productId, adding, outcome));
          if (reconcile) void refresh();
        }
        return { ok: true, inWishlist: adding };
      } catch (error) {
        return {
          ok: false,
          inWishlist: has(productId),
          message: resolveApiErrorMessages(error, translate)[0],
          ...(hasApiErrorCode(error, CUSTOMER_NOT_LOGGED_IN)
            ? { loggedOut: true }
            : {}),
        };
      }
    });
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    syncSession(session) {
      const key = wishlistSessionKey(session);
      if (key === null || key === sessionKey) return;
      sessionKey = key;
      generation += 1;
      if (key === GUEST_KEY) {
        publish(guestWishlist);
        return;
      }
      publish(loadingWishlist);
      void refresh();
    },
    setTranslate(next) {
      translate = next;
    },
    refresh,
    add: (productId) => write(productId, true),
    remove: (productId) => write(productId, false),
  };
}
