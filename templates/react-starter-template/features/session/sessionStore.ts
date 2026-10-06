import type { ApiClient, Schemas } from "#shopware";
import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/translate";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import {
  findLanguageId,
  toLanguageOptions,
} from "@/platform/shopware/reads/languageOptions";
import type {
  LanguageOption,
  SalesChannelLanguages,
} from "@/platform/shopware/reads/languageOptions";

import { anonymousSession } from "./anonymousSession";
import { createBrowserClient, loadPublicConfig } from "./browserClient";
import type { SessionActions } from "./components/SessionActionsContext";
import { READ_TIMEOUT_MS } from "./readTimeout";
import { createSessionActions } from "./sessionActions";
import type { SessionNotification } from "./sessionActions";
import { toStorefrontSession, unavailableSession } from "./sessionFromContext";
import { getStorefrontUrl } from "./storefrontUrl";
import type { StorefrontSession } from "./types";

export type SessionRefreshOptions = { keepLastGood?: boolean };

export type SessionStoreOptions = { locale?: Locale | null };

export type SessionStore = {
  getSnapshot(): StorefrontSession;
  subscribe(listener: () => void): () => void;
  start(): Promise<void>;
  refresh(options?: SessionRefreshOptions): Promise<void>;
  retry(): Promise<StorefrontSession>;
  getClient(): Promise<ApiClient>;
  getLanguages(): Promise<LanguageOption[]>;
  loadLanguages(): Promise<SalesChannelLanguages>;
  setLocale(locale: Locale): void;
  createActions(
    notify: (notification: SessionNotification) => void,
    t: Translate,
  ): SessionActions;
};

function logReadFailure(error: unknown): void {
  console.error("[Session] reading the session failed", error);
}

function logLocaleFailure(error: unknown): void {
  console.error("[Session] applying the locale to the session failed", error);
}

export function createSessionStore({
  locale: initialLocale = null,
}: SessionStoreOptions = {}): SessionStore {
  let snapshot = anonymousSession;
  const listeners = new Set<() => void>();
  let pendingClient: Promise<ApiClient> | null = null;
  let initialRead: Promise<void> | null = null;
  let readCount = 0;
  let publicConfig: PublicShopwareConfig | null = null;
  let context: Schemas["SalesChannelContext"] | null = null;
  let locale: Locale | null = initialLocale;
  let languages: Promise<LanguageOption[]> | null = null;
  let localeTask: Promise<void> = Promise.resolve();

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

  async function refresh({
    keepLastGood = false,
  }: SessionRefreshOptions = {}): Promise<void> {
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
        if (keepLastGood && context) {
          publish({ ...snapshot, status: "error" });
        } else {
          context = null;
          publish(unavailableSession);
        }
      }
      throw error;
    }
  }

  function readLanguages(client: ApiClient): Promise<LanguageOption[]> {
    if (!languages) {
      const pending = client
        .invoke("readLanguagesGet get /language", {
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        })
        .then(({ data }) => toLanguageOptions(data.elements ?? []));
      languages = pending;
      pending.catch(() => {
        if (languages === pending) languages = null;
      });
    }
    return languages;
  }

  function localeLanguageId(
    options: LanguageOption[],
    target: Locale,
  ): string | null {
    return (
      findLanguageId(options, target) ??
      context?.salesChannel?.languageId ??
      null
    );
  }

  async function applyLocale(): Promise<void> {
    const target = locale;
    if (!target || !context) return;
    const client = await connect();
    const languageId = localeLanguageId(await readLanguages(client), target);
    if (!languageId) return;
    client.defaultHeaders.apply({ "sw-language-id": languageId });
    if (languageId === context.context?.languageIdChain?.[0]) return;
    await client.invoke("updateContext patch /context", {
      body: { languageId },
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    });
    await refresh({ keepLastGood: true });
  }

  function scheduleLocale(): Promise<void> {
    const run = localeTask.then(applyLocale).catch(logLocaleFailure);
    localeTask = run;
    return run;
  }

  function setLocale(next: Locale): void {
    if (next === locale) return;
    locale = next;
    if (context) void scheduleLocale();
  }

  function start(): Promise<void> {
    initialRead ??= refresh().then(scheduleLocale, (error: unknown) => {
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
      await refresh({ keepLastGood: true }).catch(logReadFailure);
    }
    return snapshot;
  }

  async function getClient(): Promise<ApiClient> {
    await start();
    return connect();
  }

  async function getLanguages(): Promise<LanguageOption[]> {
    await initialRead;
    await localeTask;
    const pending = languages;
    return pending ? pending.catch(() => []) : [];
  }

  async function loadLanguages(): Promise<SalesChannelLanguages> {
    await start();
    const options = await readLanguages(await connect());
    return {
      languages: options,
      defaultLanguageId: context?.salesChannel?.languageId ?? null,
    };
  }

  async function refreshSession(): Promise<void> {
    await start();
    await refresh({ keepLastGood: true }).catch(logReadFailure);
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
    t: Translate,
  ): SessionActions {
    const actions = createSessionActions({
      client: {
        invoke: async (operation, ...params) =>
          (await connect()).invoke(operation, ...params),
      },
      refreshSession: () => refresh(),
      getStorefrontUrl: resolveStorefrontUrl,
      notify,
      t,
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
      refreshSession,
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
    getClient,
    getLanguages,
    loadLanguages,
    setLocale,
    createActions,
  };
}
