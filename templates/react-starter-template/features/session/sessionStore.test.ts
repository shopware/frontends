import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";

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

    const actions = store.createActions(() => {});

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
    const actions = store.createActions(() => {});

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
    const actions = store.createActions(() => {});

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
    const actions = store.createActions(() => {});

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
    const actions = store.createActions(() => {});
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
    const actions = store.createActions(() => {});

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
