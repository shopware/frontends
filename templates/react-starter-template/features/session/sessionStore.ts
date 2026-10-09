import type { ApiClient, Schemas } from "#shopware";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";

import { anonymousSession } from "./anonymousSession";
import { createBrowserClient, loadPublicConfig } from "./browserClient";
import type { SessionActions } from "./components/SessionActionsContext";
import { READ_TIMEOUT_MS } from "./readTimeout";
import { createSessionActions } from "./sessionActions";
import type { SessionNotification } from "./sessionActions";
import { toStorefrontSession, unavailableSession } from "./sessionFromContext";
import { getStorefrontUrl } from "./storefrontUrl";
import type { StorefrontSession } from "./types";

export type SessionStore = {
  getSnapshot(): StorefrontSession;
  subscribe(listener: () => void): () => void;
  start(): Promise<void>;
  refresh(): Promise<void>;
  retry(): Promise<StorefrontSession>;
  createActions(
    notify: (notification: SessionNotification) => void,
  ): SessionActions;
};

function logReadFailure(error: unknown): void {
  console.error("[Session] reading the session failed", error);
}

export function createSessionStore(): SessionStore {
  let snapshot = anonymousSession;
  const listeners = new Set<() => void>();
  let pendingClient: Promise<ApiClient> | null = null;
  let initialRead: Promise<void> | null = null;
  let readCount = 0;
  let publicConfig: PublicShopwareConfig | null = null;
  let context: Schemas["SalesChannelContext"] | null = null;

  function publish(next: StorefrontSession): void {
    snapshot = next;
    for (const listener of listeners) listener();
  }

  function connect(): Promise<ApiClient> {
    if (!pendingClient) {
      const pending = loadPublicConfig().then((config) => {
        publicConfig = config;
        return createBrowserClient(config);
      });
      pendingClient = pending;
      pending.catch(() => {
        if (pendingClient === pending) pendingClient = null;
      });
    }
    return pendingClient;
  }

  async function refresh(): Promise<void> {
    readCount += 1;
    const read = readCount;
    try {
      const client = await connect();
      const { data } = await client.invoke("readContext get /context", {
        fetchOptions: { timeout: READ_TIMEOUT_MS },
      });
      if (read !== readCount) return;
      context = data;
      publish(toStorefrontSession(data));
    } catch (error) {
      if (read === readCount) {
        context = null;
        publish(unavailableSession);
      }
      throw error;
    }
  }

  function start(): Promise<void> {
    initialRead ??= refresh().catch((error: unknown) => {
      logReadFailure(error);
      initialRead = null;
    });
    return initialRead;
  }

  async function retry(): Promise<StorefrontSession> {
    await initialRead;
    if (!initialRead) {
      await start();
    } else if (snapshot.status === "error") {
      await refresh().catch(logReadFailure);
    }
    return snapshot;
  }

  async function resolveStorefrontUrl(): Promise<string> {
    await connect();
    return getStorefrontUrl({
      devStorefrontUrl: publicConfig?.devStorefrontUrl ?? null,
      origin: window.location.origin,
      context,
    });
  }

  function createActions(
    notify: (notification: SessionNotification) => void,
  ): SessionActions {
    const actions = createSessionActions({
      client: {
        invoke: async (operation, ...params) =>
          (await connect()).invoke(operation, ...params),
      },
      refreshSession: refresh,
      getStorefrontUrl: resolveStorefrontUrl,
      notify,
    });
    return {
      login: async (input) => {
        await start();
        return actions.login(input);
      },
      register: async (input) => {
        await start();
        return actions.register(input);
      },
      logout: async () => {
        await start();
        return actions.logout();
      },
      retrySession: retry,
    };
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    start,
    refresh,
    retry,
    createActions,
  };
}
