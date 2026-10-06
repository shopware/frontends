import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import { testTranslator } from "@/test/i18n";

import { READ_TIMEOUT_MS } from "./readTimeout";
import { customer, salesChannelContext } from "./session.fixture";
import { createSessionStore } from "./sessionStore";

const browser = vi.hoisted(() => ({
  loadPublicConfig: vi.fn<() => Promise<PublicShopwareConfig>>(),
  createBrowserClient: vi.fn<(config: PublicShopwareConfig) => ApiClient>(),
}));

vi.mock("@/features/session/browserClient", () => ({
  CONTEXT_TOKEN_COOKIE: "sw-context-token",
  loadPublicConfig: browser.loadPublicConfig,
  createBrowserClient: browser.createBrowserClient,
}));

const config: PublicShopwareConfig = {
  endpoint: "https://shop.test/store-api/",
  accessToken: "SWSCTEST",
  devStorefrontUrl: null,
};

const READ_CONTEXT = "readContext get /context";
const LOGIN = "loginCustomer post /account/login";
const READ_CONTEXT_PARAMS = { fetchOptions: { timeout: READ_TIMEOUT_MS } };

type ContextAnswer = Promise<{ data: Schemas["SalesChannelContext"] }>;

function answerReads(...answers: ContextAnswer[]) {
  const invoke = vi.fn(() => {
    const answer = answers.shift();
    if (!answer) throw new Error("Unexpected read");
    return answer;
  });
  browser.createBrowserClient.mockReturnValue({
    invoke,
  } as unknown as ApiClient);
  return invoke;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((settle, fail) => {
    resolve = settle;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function silenceConsoleError() {
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

beforeEach(() => {
  browser.loadPublicConfig.mockReset();
  browser.createBrowserClient.mockReset();
  browser.loadPublicConfig.mockResolvedValue(config);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createSessionStore", () => {
  it("does nothing until it is started", () => {
    const store = createSessionStore();

    expect(store.getSnapshot().status).toBe("loading");
    expect(browser.loadPublicConfig).not.toHaveBeenCalled();
    expect(browser.createBrowserClient).not.toHaveBeenCalled();
  });

  it("notifies subscribers until they unsubscribe", async () => {
    answerReads(
      Promise.resolve({ data: salesChannelContext(null) }),
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    await store.start();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      isLoggedIn: false,
    });

    unsubscribe();
    await store.refresh();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().isLoggedIn).toBe(true);
  });

  it("keeps the newest read when an older one answers later", async () => {
    const olderRead = deferred<{ data: Schemas["SalesChannelContext"] }>();
    answerReads(
      olderRead.promise,
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();

    const started = store.start();
    await vi.waitFor(() =>
      expect(browser.createBrowserClient).toHaveBeenCalled(),
    );
    await store.refresh();
    olderRead.resolve({ data: salesChannelContext(null) });
    await started;

    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      isLoggedIn: true,
    });
  });

  it("keeps the newest read when an older one fails later", async () => {
    const consoleError = silenceConsoleError();
    const olderRead = deferred<{ data: Schemas["SalesChannelContext"] }>();
    answerReads(
      olderRead.promise,
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();

    const started = store.start();
    await vi.waitFor(() =>
      expect(browser.createBrowserClient).toHaveBeenCalled(),
    );
    await store.refresh();
    olderRead.reject(new Error("offline"));
    await started;

    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      isLoggedIn: true,
    });
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it("reads the context with the read timeout", async () => {
    const invoke = answerReads(
      Promise.resolve({ data: salesChannelContext(null) }),
    );
    const store = createSessionStore();

    await store.start();

    expect(invoke).toHaveBeenCalledWith(READ_CONTEXT, READ_CONTEXT_PARAMS);
  });

  it("lets an action run after the context read timed out", async () => {
    silenceConsoleError();
    const invoke = vi.fn(async (operation: string) => {
      if (operation === READ_CONTEXT) {
        throw new DOMException(
          "The operation was aborted due to timeout",
          "TimeoutError",
        );
      }
      return { data: {}, status: 200 };
    });
    browser.createBrowserClient.mockReturnValue({
      invoke,
    } as unknown as ApiClient);
    const store = createSessionStore();
    await store.start();
    expect(store.getSnapshot().status).toBe("error");

    const actions = store.createActions(() => {}, testTranslator());

    await expect(
      actions.login({ username: "jane@example.com", password: "secret" }),
    ).resolves.toEqual({ ok: true });
    expect(invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
      READ_CONTEXT,
      LOGIN,
      READ_CONTEXT,
    ]);
  });

  it("reads the context again on the next start after the first read failed", async () => {
    const consoleError = silenceConsoleError();
    const invoke = answerReads(
      Promise.reject(new TypeError("Failed to fetch")),
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();

    await store.start();
    expect(store.getSnapshot()).toMatchObject({
      status: "error",
      isLoggedIn: false,
    });
    expect(consoleError).toHaveBeenCalledTimes(1);

    await store.start();
    await store.start();

    expect(invoke).toHaveBeenCalledTimes(2);
    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      isLoggedIn: true,
    });
  });

  it("retries the first read that failed and returns the new session", async () => {
    silenceConsoleError();
    const invoke = answerReads(
      Promise.reject(new TypeError("Failed to fetch")),
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();
    await store.start();

    await expect(store.retry()).resolves.toMatchObject({
      status: "ready",
      isLoggedIn: true,
    });
    expect(invoke).toHaveBeenCalledTimes(2);
  });

  it("retries a failed re-read even though the first read succeeded", async () => {
    silenceConsoleError();
    const invoke = answerReads(
      Promise.resolve({ data: salesChannelContext(customer()) }),
      Promise.reject(new TypeError("Failed to fetch")),
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();
    await store.start();
    await expect(store.refresh()).rejects.toThrow("Failed to fetch");
    expect(store.getSnapshot().status).toBe("error");

    await expect(store.retry()).resolves.toMatchObject({
      status: "ready",
      isLoggedIn: true,
    });
    expect(invoke).toHaveBeenCalledTimes(3);
  });

  it("does not read again when retried with a ready session", async () => {
    const invoke = answerReads(
      Promise.resolve({ data: salesChannelContext(null) }),
    );
    const store = createSessionStore();
    await store.start();

    await expect(store.retry()).resolves.toBe(store.getSnapshot());
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("resolves the error session when the retry fails again", async () => {
    const consoleError = silenceConsoleError();
    answerReads(
      Promise.reject(new TypeError("Failed to fetch")),
      Promise.reject(new TypeError("Failed to fetch")),
    );
    const store = createSessionStore();
    await store.start();

    await expect(store.retry()).resolves.toMatchObject({
      status: "error",
      isLoggedIn: false,
    });
    expect(consoleError).toHaveBeenCalledTimes(2);
  });

  it("keeps the context and the guest flag of the last read in the snapshot", async () => {
    const context = salesChannelContext(
      customer({ guest: true }),
      "guest-token",
    );
    answerReads(Promise.resolve({ data: context }));
    const store = createSessionStore();

    await store.start();

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      isLoggedIn: false,
      isGuestSession: true,
      customerName: null,
      wishlistCount: 0,
      context,
    });
  });

  it("starts only once", async () => {
    const invoke = answerReads(
      Promise.resolve({ data: salesChannelContext(null) }),
    );
    const store = createSessionStore();

    await Promise.all([store.start(), store.start()]);

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(browser.createBrowserClient).toHaveBeenCalledTimes(1);
  });
});

describe("createSessionStore getClient", () => {
  it("resolves the browser client only after the first context read", async () => {
    const firstRead = deferred<{ data: Schemas["SalesChannelContext"] }>();
    const invoke = answerReads(firstRead.promise);
    const store = createSessionStore();

    let resolved: ApiClient | undefined;
    const pending = store.getClient().then((client) => {
      resolved = client;
    });
    await vi.waitFor(() => expect(invoke).toHaveBeenCalledTimes(1));
    await new Promise((settle) => setTimeout(settle, 0));
    expect(resolved).toBeUndefined();

    firstRead.resolve({ data: salesChannelContext(null) });
    await pending;

    expect(resolved).toBe(browser.createBrowserClient.mock.results[0]?.value);
    expect(store.getSnapshot().status).toBe("ready");
  });

  it("shares one client and one first read between callers", async () => {
    const invoke = answerReads(
      Promise.resolve({ data: salesChannelContext(null) }),
    );
    const store = createSessionStore();

    const [first, second] = await Promise.all([
      store.getClient(),
      store.getClient(),
    ]);
    await store.start();

    expect(first).toBe(second);
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(browser.createBrowserClient).toHaveBeenCalledTimes(1);
  });

  it("reads the context again before it resolves after the first read failed", async () => {
    silenceConsoleError();
    const invoke = answerReads(
      Promise.reject(new TypeError("Failed to fetch")),
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();
    await store.start();
    expect(store.getSnapshot().status).toBe("error");

    await store.getClient();

    expect(invoke).toHaveBeenCalledTimes(2);
    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      isLoggedIn: true,
    });
  });

  it("rejects while the public config cannot be loaded", async () => {
    silenceConsoleError();
    browser.loadPublicConfig.mockRejectedValue(new Error("config down"));
    const store = createSessionStore();

    await expect(store.getClient()).rejects.toThrow("config down");
    expect(browser.createBrowserClient).not.toHaveBeenCalled();
  });
});

describe("createSessionStore refreshSession action", () => {
  it("re-reads the context and publishes the new session", async () => {
    const invoke = answerReads(
      Promise.resolve({ data: salesChannelContext(null) }),
      Promise.resolve({
        data: salesChannelContext(customer(), "context-token-2"),
      }),
    );
    const store = createSessionStore();
    await store.start();
    const actions = store.createActions(() => {}, testTranslator());

    await expect(actions.refreshSession()).resolves.toBeUndefined();

    expect(invoke.mock.calls).toEqual([
      [READ_CONTEXT, READ_CONTEXT_PARAMS],
      [READ_CONTEXT, READ_CONTEXT_PARAMS],
    ]);
    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      isLoggedIn: true,
      context: { token: "context-token-2" },
    });
  });

  it("waits for the first context read before it reads again", async () => {
    const firstRead = deferred<{ data: Schemas["SalesChannelContext"] }>();
    const invoke = answerReads(
      firstRead.promise,
      Promise.resolve({ data: salesChannelContext(customer()) }),
    );
    const store = createSessionStore();
    const actions = store.createActions(() => {}, testTranslator());

    const refreshed = actions.refreshSession();
    await vi.waitFor(() => expect(invoke).toHaveBeenCalledTimes(1));
    await new Promise((settle) => setTimeout(settle, 0));
    expect(invoke).toHaveBeenCalledTimes(1);

    firstRead.resolve({ data: salesChannelContext(null) });
    await refreshed;

    expect(invoke).toHaveBeenCalledTimes(2);
    expect(store.getSnapshot().isLoggedIn).toBe(true);
  });

  it("resolves, logs and keeps the last session when the re-read fails", async () => {
    const consoleError = silenceConsoleError();
    const context = salesChannelContext(customer());
    answerReads(
      Promise.resolve({ data: context }),
      Promise.reject(new TypeError("Failed to fetch")),
    );
    const store = createSessionStore();
    await store.start();
    const ready = store.getSnapshot();
    const actions = store.createActions(() => {}, testTranslator());

    await expect(actions.refreshSession()).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toEqual({ ...ready, status: "error" });
    expect(store.getSnapshot().context).toBe(context);
  });

  it("keeps the last session when a retry after a failed re-read fails too", async () => {
    silenceConsoleError();
    const context = salesChannelContext(customer({ guest: true }));
    const invoke = answerReads(
      Promise.resolve({ data: context }),
      Promise.reject(new TypeError("Failed to fetch")),
      Promise.reject(new TypeError("Failed to fetch")),
    );
    const store = createSessionStore();
    await store.start();
    const actions = store.createActions(() => {}, testTranslator());
    await actions.refreshSession();

    await expect(actions.retrySession()).resolves.toMatchObject({
      status: "error",
      isGuestSession: true,
      context,
    });
    expect(invoke).toHaveBeenCalledTimes(3);
  });

  it("forgets the last session when the re-read after a login fails", async () => {
    silenceConsoleError();
    let contextReads = 0;
    const invoke = vi.fn(async (operation: string) => {
      if (operation === LOGIN) return { data: {}, status: 200 };
      contextReads += 1;
      if (contextReads === 1) {
        return { data: salesChannelContext(null), status: 200 };
      }
      throw new TypeError("Failed to fetch");
    });
    browser.createBrowserClient.mockReturnValue({
      invoke,
    } as unknown as ApiClient);
    const store = createSessionStore();
    await store.start();
    const actions = store.createActions(() => {}, testTranslator());

    await expect(
      actions.login({ username: "jane@example.com", password: "secret" }),
    ).resolves.toEqual({ ok: true });

    expect(invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
      LOGIN,
      READ_CONTEXT,
    ]);
    expect(store.getSnapshot()).toMatchObject({
      status: "error",
      isLoggedIn: false,
      context: null,
    });
  });
});

const READ_LANGUAGES = "readLanguagesGet get /language";
const UPDATE_CONTEXT = "updateContext patch /context";
const READ_LANGUAGES_PARAMS = { fetchOptions: { timeout: READ_TIMEOUT_MS } };

function updateLanguage(languageId: string) {
  return {
    body: { languageId },
    fetchOptions: { timeout: READ_TIMEOUT_MS },
  };
}

const shopLanguages = [
  { id: "language-en", translationCode: { code: "en-GB" } },
  { id: "language-de", translationCode: { code: "de-DE" } },
];

function languageBackend({
  languages = async () => shopLanguages,
  languageId = "language-en",
  defaultLanguageId = "language-en",
}: {
  languages?: () => Promise<unknown>;
  languageId?: string;
  defaultLanguageId?: string;
} = {}) {
  const backend = { languageId, languageReads: 0 };
  const invoke = vi.fn(async (operation: string, params?: unknown) => {
    switch (operation) {
      case READ_CONTEXT: {
        const context = salesChannelContext(null);
        return {
          data: {
            ...context,
            context: { languageIdChain: [backend.languageId] },
            salesChannel: {
              ...context.salesChannel,
              languageId: defaultLanguageId,
            },
          },
        };
      }
      case READ_LANGUAGES:
        backend.languageReads += 1;
        return { data: { elements: await languages() } };
      case UPDATE_CONTEXT:
        backend.languageId = (
          params as { body: { languageId: string } }
        ).body.languageId;
        return { data: { contextToken: "context-token-1" } };
      default:
        throw new Error(`Unexpected operation ${operation}`);
    }
  });
  const apply = vi.fn();
  browser.createBrowserClient.mockReturnValue({
    invoke,
    defaultHeaders: { apply },
  } as unknown as ApiClient);
  return { backend, invoke, apply };
}

describe("createSessionStore locale", () => {
  it("does not read the languages without a locale", async () => {
    const { invoke } = languageBackend();
    const store = createSessionStore();

    await store.start();

    expect(invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
    ]);
  });

  it("switches the context to the language of the locale after the first read", async () => {
    const { invoke, apply } = languageBackend();
    const store = createSessionStore({ locale: "de-DE" });

    await store.start();

    expect(invoke.mock.calls).toEqual([
      [READ_CONTEXT, READ_CONTEXT_PARAMS],
      [READ_LANGUAGES, READ_LANGUAGES_PARAMS],
      [UPDATE_CONTEXT, updateLanguage("language-de")],
      [READ_CONTEXT, READ_CONTEXT_PARAMS],
    ]);
    expect(apply).toHaveBeenCalledExactlyOnceWith({
      "sw-language-id": "language-de",
    });
    expect(apply.mock.invocationCallOrder[0]).toBeLessThan(
      invoke.mock.invocationCallOrder[2] ?? 0,
    );
    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      context: { context: { languageIdChain: ["language-de"] } },
    });
  });

  it("hands out the client only after the language was applied", async () => {
    const languages = Promise.withResolvers<unknown>();
    const { invoke } = languageBackend({ languages: () => languages.promise });
    const store = createSessionStore({ locale: "de-DE" });

    let resolved = false;
    const pending = store.getClient().then(() => {
      resolved = true;
    });
    await vi.waitFor(() =>
      expect(invoke).toHaveBeenCalledWith(
        READ_LANGUAGES,
        READ_LANGUAGES_PARAMS,
      ),
    );
    await new Promise((settle) => setTimeout(settle, 0));
    expect(resolved).toBe(false);

    languages.resolve(shopLanguages);
    await pending;

    expect(invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
      UPDATE_CONTEXT,
      READ_CONTEXT,
    ]);
  });

  it("pins the language of the locale without patching a context that already has it", async () => {
    const { invoke, apply } = languageBackend();
    const store = createSessionStore({ locale: "en-GB" });

    await store.start();

    expect(invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
    ]);
    expect(apply).toHaveBeenCalledExactlyOnceWith({
      "sw-language-id": "language-en",
    });
  });

  it("keeps sending the language of the locale after another tab changed the context language", async () => {
    const { backend, invoke, apply } = languageBackend();
    const store = createSessionStore({ locale: "en-GB" });
    await store.start();

    backend.languageId = "language-de";
    await store.refresh();

    expect(apply).toHaveBeenCalledExactlyOnceWith({
      "sw-language-id": "language-en",
    });
    expect(
      invoke.mock.calls.filter(([operation]) => operation === UPDATE_CONTEXT),
    ).toEqual([]);
  });

  it("keeps the default language when no language matches the locale, like the Vue starter", async () => {
    const { invoke, apply } = languageBackend({
      languages: async () => [
        { id: "language-us", translationCode: { code: "en-US" } },
      ],
      languageId: "language-us",
      defaultLanguageId: "language-us",
    });
    const store = createSessionStore({ locale: "pl-PL" });

    await store.start();

    expect(invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
    ]);
    expect(apply).toHaveBeenCalledExactlyOnceWith({
      "sw-language-id": "language-us",
    });
    expect(store.getSnapshot().status).toBe("ready");
  });

  it("switches back to the sales channel default language when no language matches the locale", async () => {
    const { invoke, apply } = languageBackend({
      languageId: "language-de",
      defaultLanguageId: "language-en",
    });
    const store = createSessionStore({ locale: "pl-PL" });

    await store.start();

    expect(invoke.mock.calls).toEqual([
      [READ_CONTEXT, READ_CONTEXT_PARAMS],
      [READ_LANGUAGES, READ_LANGUAGES_PARAMS],
      [UPDATE_CONTEXT, updateLanguage("language-en")],
      [READ_CONTEXT, READ_CONTEXT_PARAMS],
    ]);
    expect(apply).toHaveBeenCalledExactlyOnceWith({
      "sw-language-id": "language-en",
    });
    expect(store.getSnapshot()).toMatchObject({
      status: "ready",
      context: { context: { languageIdChain: ["language-en"] } },
    });
  });

  it("switches a language without a supported locale back to the sales channel default", async () => {
    const { invoke, apply } = languageBackend({
      languages: async () => [
        ...shopLanguages,
        { id: "language-fr", translationCode: { code: "fr-FR" } },
      ],
      languageId: "language-fr",
      defaultLanguageId: "language-en",
    });
    const store = createSessionStore({ locale: "pl-PL" });

    await store.start();

    expect(
      invoke.mock.calls.filter(([operation]) => operation === UPDATE_CONTEXT),
    ).toEqual([[UPDATE_CONTEXT, updateLanguage("language-en")]]);
    expect(apply).toHaveBeenCalledExactlyOnceWith({
      "sw-language-id": "language-en",
    });
  });

  it("returns to the default language when the locale changes to one without a language", async () => {
    const { backend, invoke, apply } = languageBackend();
    const store = createSessionStore({ locale: "de-DE" });
    await store.start();
    expect(backend.languageId).toBe("language-de");

    store.setLocale("pl-PL");
    await vi.waitFor(() =>
      expect(store.getSnapshot().context?.context?.languageIdChain).toEqual([
        "language-en",
      ]),
    );

    expect(backend.languageReads).toBe(1);
    expect(apply.mock.calls).toEqual([
      [{ "sw-language-id": "language-de" }],
      [{ "sw-language-id": "language-en" }],
    ]);
    expect(
      invoke.mock.calls.filter(([operation]) => operation === UPDATE_CONTEXT),
    ).toEqual([
      [UPDATE_CONTEXT, updateLanguage("language-de")],
      [UPDATE_CONTEXT, updateLanguage("language-en")],
    ]);
  });

  it("logs a failed language read, keeps the session and reads the languages again on the next locale", async () => {
    const consoleError = silenceConsoleError();
    const failure = new TypeError("Failed to fetch");
    const { backend, invoke } = languageBackend({
      languages: () => Promise.reject(failure),
    });
    const store = createSessionStore({ locale: "de-DE" });

    await store.start();

    expect(store.getSnapshot().status).toBe("ready");
    expect(consoleError).toHaveBeenCalledExactlyOnceWith(
      "[Session] applying the locale to the session failed",
      failure,
    );

    browser.createBrowserClient.mock.results[0]?.value.invoke.mockImplementation(
      async (operation: string, params?: unknown) => {
        if (operation === READ_LANGUAGES) {
          backend.languageReads += 1;
          return { data: { elements: shopLanguages } };
        }
        if (operation === UPDATE_CONTEXT) {
          backend.languageId = (
            params as { body: { languageId: string } }
          ).body.languageId;
          return { data: {} };
        }
        return {
          data: {
            ...salesChannelContext(null),
            context: { languageIdChain: [backend.languageId] },
          },
        };
      },
    );
    store.setLocale("en-GB");
    store.setLocale("de-DE");
    await vi.waitFor(() =>
      expect(store.getSnapshot().context?.context?.languageIdChain).toEqual([
        "language-de",
      ]),
    );
    expect(backend.languageReads).toBe(2);
    expect(invoke).toHaveBeenCalledWith(
      UPDATE_CONTEXT,
      updateLanguage("language-de"),
    );
  });

  it("applies a locale that changes after the first read and reads the languages once", async () => {
    const { backend, invoke, apply } = languageBackend();
    const store = createSessionStore({ locale: "en-GB" });
    await store.start();

    store.setLocale("de-DE");
    await vi.waitFor(() =>
      expect(store.getSnapshot().context?.context?.languageIdChain).toEqual([
        "language-de",
      ]),
    );
    store.setLocale("en-GB");
    await vi.waitFor(() =>
      expect(store.getSnapshot().context?.context?.languageIdChain).toEqual([
        "language-en",
      ]),
    );

    expect(backend.languageReads).toBe(1);
    expect(apply.mock.calls).toEqual([
      [{ "sw-language-id": "language-en" }],
      [{ "sw-language-id": "language-de" }],
      [{ "sw-language-id": "language-en" }],
    ]);
    expect(
      invoke.mock.calls.filter(([operation]) => operation === UPDATE_CONTEXT),
    ).toEqual([
      [UPDATE_CONTEXT, updateLanguage("language-de")],
      [UPDATE_CONTEXT, updateLanguage("language-en")],
    ]);
  });

  it("logs a language patch that times out and still hands out the client and the languages", async () => {
    const consoleError = silenceConsoleError();
    const timeout = new DOMException(
      "The operation timed out.",
      "TimeoutError",
    );
    const { invoke } = languageBackend();
    invoke.mockImplementation(async (operation: string) => {
      switch (operation) {
        case READ_CONTEXT:
          return {
            data: {
              ...salesChannelContext(null),
              context: { languageIdChain: ["language-en"] },
            },
          };
        case READ_LANGUAGES:
          return { data: { elements: shopLanguages } };
        case UPDATE_CONTEXT:
          throw timeout;
        default:
          throw new Error(`Unexpected operation ${operation}`);
      }
    });
    const store = createSessionStore({ locale: "de-DE" });

    await expect(store.getClient()).resolves.toBeDefined();
    await expect(store.getLanguages()).resolves.toEqual([
      { id: "language-en", code: "en-GB" },
      { id: "language-de", code: "de-DE" },
    ]);

    expect(invoke).toHaveBeenCalledWith(
      UPDATE_CONTEXT,
      updateLanguage("language-de"),
    );
    expect(store.getSnapshot().status).toBe("ready");
    expect(consoleError).toHaveBeenCalledExactlyOnceWith(
      "[Session] applying the locale to the session failed",
      timeout,
    );
  });

  it("waits for the first read when the locale changes before it", async () => {
    const { invoke } = languageBackend();
    const store = createSessionStore();

    store.setLocale("de-DE");
    expect(invoke).not.toHaveBeenCalled();
    await store.start();

    expect(invoke.mock.calls.map(([operation]) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
      UPDATE_CONTEXT,
      READ_CONTEXT,
    ]);
  });
});

describe("createSessionStore loadLanguages", () => {
  it("reads the languages and the default language of the sales channel", async () => {
    const { backend } = languageBackend({ defaultLanguageId: "language-de" });
    const store = createSessionStore();

    await expect(store.loadLanguages()).resolves.toEqual({
      languages: [
        { id: "language-en", code: "en-GB" },
        { id: "language-de", code: "de-DE" },
      ],
      defaultLanguageId: "language-de",
    });
    await store.loadLanguages();
    expect(backend.languageReads).toBe(1);
  });

  it("reads the languages again after a failed read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new TypeError("Failed to fetch");
    let fail = true;
    const { backend } = languageBackend({
      languages: async () => {
        if (fail) throw failure;
        return shopLanguages;
      },
    });
    const store = createSessionStore({ locale: "de-DE" });
    await store.start();
    await expect(store.getLanguages()).resolves.toEqual([]);

    fail = false;

    await expect(store.loadLanguages()).resolves.toMatchObject({
      languages: [
        { id: "language-en", code: "en-GB" },
        { id: "language-de", code: "de-DE" },
      ],
    });
    expect(backend.languageReads).toBe(2);
  });
});

describe("createSessionStore getLanguages", () => {
  it("hands out the languages read for the locale without reading them again", async () => {
    const { backend } = languageBackend();
    const store = createSessionStore({ locale: "en-GB" });
    await store.start();

    await expect(store.getLanguages()).resolves.toEqual([
      { id: "language-en", code: "en-GB" },
      { id: "language-de", code: "de-DE" },
    ]);
    await store.getLanguages();
    expect(backend.languageReads).toBe(1);
  });

  it("hands out no languages without a locale or after a failed read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { invoke } = languageBackend();
    const withoutLocale = createSessionStore();
    await withoutLocale.start();

    await expect(withoutLocale.getLanguages()).resolves.toEqual([]);
    expect(invoke).not.toHaveBeenCalledWith(
      READ_LANGUAGES,
      READ_LANGUAGES_PARAMS,
    );

    languageBackend({
      languages: () => Promise.reject(new TypeError("Failed to fetch")),
    });
    const failed = createSessionStore({ locale: "de-DE" });
    await failed.start();

    await expect(failed.getLanguages()).resolves.toEqual([]);
  });
});
