import { StrictMode, useEffect } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { errorMessages } from "../errorMessages";
import { READ_TIMEOUT_MS } from "../readTimeout";
import {
  ENGLISH_DOMAIN,
  apiClientError,
  customer,
  registrationInput,
  salesChannelContext,
} from "../session.fixture";
import type { SessionNotification } from "../sessionActions";
import type { SessionActionResult, StorefrontSession } from "../types";
import { useSessionActions } from "./SessionActionsContext";
import type { SessionActions } from "./SessionActionsContext";
import { useSession } from "./SessionProvider";
import { ShopwareSessionProvider } from "./ShopwareSessionProvider";

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
const REGISTER = "register post /account/register";
const LOGOUT = "logoutCustomer post /account/logout";
const READ_CONTEXT_PARAMS = { fetchOptions: { timeout: READ_TIMEOUT_MS } };

type Invocation = { operation: string; params: unknown };

function createBackend(initialCustomer: Schemas["Customer"] | null = null) {
  const backend = {
    customer: initialCustomer,
    invocations: [] as Invocation[],
    failures: new Map<string, unknown>(),
    registered: customer({ active: true, doubleOptInRegistration: false }),
    heldRead: null as Promise<void> | null,
  };
  const invoke = async (operation: string, params?: unknown) => {
    backend.invocations.push({ operation, params });
    if (backend.failures.has(operation)) throw backend.failures.get(operation);
    switch (operation) {
      case READ_CONTEXT: {
        const held = backend.heldRead;
        backend.heldRead = null;
        if (held) await held;
        return { data: salesChannelContext(backend.customer), status: 200 };
      }
      case LOGIN:
        backend.customer = customer();
        return { data: {}, status: 200 };
      case REGISTER:
        backend.customer = backend.registered;
        return { data: backend.registered, status: 200 };
      case LOGOUT:
        backend.customer = null;
        return { data: {}, status: 200 };
      default:
        throw new Error(`Unexpected operation ${operation}`);
    }
  };
  browser.createBrowserClient.mockImplementation(
    () => ({ invoke }) as unknown as ApiClient,
  );
  return backend;
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

const harness: { actions: SessionActions | null } = { actions: null };

function Probe() {
  const session = useSession();
  const actions = useSessionActions();
  useEffect(() => {
    harness.actions = actions;
  }, [actions]);
  return <output data-testid="session">{JSON.stringify(session)}</output>;
}

let mounted: Mounted | undefined;
let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  harness.actions = null;
  browser.loadPublicConfig.mockReset();
  browser.createBrowserClient.mockReset();
  browser.loadPublicConfig.mockResolvedValue(config);
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

async function setup(wrap: (node: ReactNode) => ReactNode = (node) => node) {
  const notifications: SessionNotification[] = [];
  mounted = await mount(
    wrap(
      <ShopwareSessionProvider
        notify={(notification) => {
          notifications.push(notification);
        }}
      >
        <Probe />
      </ShopwareSessionProvider>,
    ),
  );
  const { container } = mounted;
  const session = (): StorefrontSession =>
    JSON.parse(
      query<HTMLOutputElement>(container, '[data-testid="session"]')
        .textContent ?? "",
    );
  const run = async (
    call: (actions: SessionActions) => Promise<SessionActionResult>,
  ): Promise<SessionActionResult> => {
    const { actions } = harness;
    if (!actions) throw new Error("No session actions");
    let result: SessionActionResult | undefined;
    await interact(() => {
      void call(actions).then((value) => {
        result = value;
      });
    });
    await vi.waitFor(() => expect(result).toBeDefined());
    return result as SessionActionResult;
  };
  return { session, run, notifications };
}

const credentials = { username: "jane@example.com", password: "secret" };

describe("ShopwareSessionProvider session state", () => {
  it("starts loading and becomes ready and logged out for an anonymous context", async () => {
    const pendingConfig = deferred<PublicShopwareConfig>();
    browser.loadPublicConfig.mockReturnValue(pendingConfig.promise);
    const backend = createBackend();
    const { session } = await setup();

    expect(session()).toEqual({
      status: "loading",
      isLoggedIn: false,
      customerName: null,
      cartCount: 0,
      wishlistCount: 0,
    });

    await interact(() => pendingConfig.resolve(config));

    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(session()).toEqual({
      status: "ready",
      isLoggedIn: false,
      customerName: null,
      cartCount: 0,
      wishlistCount: 0,
    });
    expect(browser.createBrowserClient).toHaveBeenCalledWith(config);
    expect(backend.invocations).toEqual([
      { operation: READ_CONTEXT, params: READ_CONTEXT_PARAMS },
    ]);
  });

  it("is logged in for an active customer that is not a guest", async () => {
    createBackend(customer());
    const { session } = await setup();

    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(session()).toMatchObject({
      isLoggedIn: true,
      customerName: "Jane Doe",
    });
  });

  it.each([
    ["a guest", customer({ guest: true })],
    ["an inactive customer", customer({ active: false })],
  ])("is logged out for %s", async (_, current) => {
    createBackend(current);
    const { session } = await setup();

    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(session()).toMatchObject({ isLoggedIn: false, customerName: null });
  });

  it("reports a failed context read as an error session without a toast", async () => {
    const backend = createBackend(customer());
    backend.failures.set(READ_CONTEXT, new TypeError("Failed to fetch"));
    const { session, notifications } = await setup();

    await vi.waitFor(() => expect(session().status).toBe("error"));
    expect(session().isLoggedIn).toBe(false);
    expect(notifications).toEqual([]);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it("creates one client and reads the context once under StrictMode", async () => {
    const backend = createBackend();
    const { session } = await setup((node) => <StrictMode>{node}</StrictMode>);

    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(browser.loadPublicConfig).toHaveBeenCalledTimes(1);
    expect(browser.createBrowserClient).toHaveBeenCalledTimes(1);
    expect(backend.invocations).toHaveLength(1);
  });

  it("finishes a read that was pending at unmount without errors", async () => {
    const pendingConfig = deferred<PublicShopwareConfig>();
    browser.loadPublicConfig.mockReturnValue(pendingConfig.promise);
    const backend = createBackend();
    await setup();

    await mounted?.unmount();
    mounted = undefined;
    pendingConfig.resolve(config);

    await vi.waitFor(() => expect(backend.invocations).toHaveLength(1));
    expect(consoleError).not.toHaveBeenCalled();
  });
});

describe("ShopwareSessionProvider recovery", () => {
  it("re-reads a failed session when the browser comes back online", async () => {
    const backend = createBackend(customer());
    backend.failures.set(READ_CONTEXT, new TypeError("Failed to fetch"));
    const { session } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("error"));

    backend.failures.delete(READ_CONTEXT);
    await interact(() => window.dispatchEvent(new Event("online")));

    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(session().isLoggedIn).toBe(true);
    expect(backend.invocations).toHaveLength(2);
  });

  it("re-reads a failed session when the tab becomes visible again", async () => {
    const backend = createBackend(customer());
    backend.failures.set(READ_CONTEXT, new TypeError("Failed to fetch"));
    const { session } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("error"));

    backend.failures.delete(READ_CONTEXT);
    await interact(() => document.dispatchEvent(new Event("visibilitychange")));

    await vi.waitFor(() => expect(session().isLoggedIn).toBe(true));
    expect(backend.invocations).toHaveLength(2);
  });

  it("does not re-read a session that is ready", async () => {
    const backend = createBackend();
    const { session } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("ready"));

    await interact(() => {
      window.dispatchEvent(new Event("online"));
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(backend.invocations).toHaveLength(1);
  });

  it("re-reads a failed session through retrySession and returns it", async () => {
    const backend = createBackend(customer());
    backend.failures.set(READ_CONTEXT, new TypeError("Failed to fetch"));
    const { session } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("error"));
    backend.failures.delete(READ_CONTEXT);

    let recovered: StorefrontSession | undefined;
    await interact(() => {
      void harness.actions?.retrySession().then((value) => {
        recovered = value;
      });
    });

    await vi.waitFor(() =>
      expect(recovered).toMatchObject({ status: "ready", isLoggedIn: true }),
    );
    expect(session().isLoggedIn).toBe(true);
  });
});

describe("ShopwareSessionProvider config failure", () => {
  it("ends in the error status and resolves every action with the default message", async () => {
    browser.loadPublicConfig.mockRejectedValue(new Error("config down"));
    createBackend();
    const { session, run, notifications } = await setup();

    await vi.waitFor(() => expect(session().status).toBe("error"));
    expect(session().isLoggedIn).toBe(false);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(notifications).toEqual([]);
    expect(browser.createBrowserClient).not.toHaveBeenCalled();

    const defaultMessage = errorMessages.errors["message-default"];
    await expect(run((actions) => actions.login(credentials))).resolves.toEqual(
      { ok: false, message: defaultMessage },
    );
    await expect(run((actions) => actions.logout())).resolves.toEqual({
      ok: false,
      message: defaultMessage,
    });
    expect(notifications).toEqual([
      { type: "error", message: defaultMessage },
      { type: "error", message: defaultMessage },
    ]);
  });

  it("retries the config and the first context read when an action runs after the failure", async () => {
    browser.loadPublicConfig
      .mockRejectedValueOnce(new Error("config down"))
      .mockResolvedValue(config);
    const backend = createBackend();
    const { session, run } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("error"));

    await expect(run((actions) => actions.login(credentials))).resolves.toEqual(
      { ok: true },
    );

    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      READ_CONTEXT,
      LOGIN,
      READ_CONTEXT,
    ]);
    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(session().isLoggedIn).toBe(true);
  });

  it("loads the config before it picks the storefront URL of a registration", async () => {
    browser.loadPublicConfig
      .mockRejectedValueOnce(new Error("config down"))
      .mockRejectedValueOnce(new Error("config down"))
      .mockResolvedValue({
        ...config,
        devStorefrontUrl: "https://shop.test/de/",
      });
    const backend = createBackend();
    const { session, run } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("error"));

    await expect(
      run((actions) => actions.register(registrationInput)),
    ).resolves.toEqual({ ok: true, doubleOptIn: false });

    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      REGISTER,
      READ_CONTEXT,
    ]);
    expect(backend.invocations[0]?.params).toMatchObject({
      body: { storefrontUrl: "https://shop.test/de/" },
    });
  });

  it("registers with the sales channel domain after the config failed first", async () => {
    browser.loadPublicConfig
      .mockRejectedValueOnce(new Error("config down"))
      .mockResolvedValue(config);
    const backend = createBackend();
    const { session, run } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("error"));

    await expect(
      run((actions) => actions.register(registrationInput)),
    ).resolves.toEqual({ ok: true, doubleOptIn: false });

    expect(
      backend.invocations.find(({ operation }) => operation === REGISTER)
        ?.params,
    ).toMatchObject({ body: { storefrontUrl: ENGLISH_DOMAIN } });
  });
});

describe("ShopwareSessionProvider actions", () => {
  it("logs in, re-reads the context and flips isLoggedIn", async () => {
    const backend = createBackend();
    const { session, run, notifications } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("ready"));

    await expect(run((actions) => actions.login(credentials))).resolves.toEqual(
      { ok: true },
    );

    expect(backend.invocations).toEqual([
      { operation: READ_CONTEXT, params: READ_CONTEXT_PARAMS },
      { operation: LOGIN, params: { body: credentials } },
      { operation: READ_CONTEXT, params: READ_CONTEXT_PARAMS },
    ]);
    await vi.waitFor(() => expect(session().isLoggedIn).toBe(true));
    expect(session().customerName).toBe("Jane Doe");
    expect(notifications).toEqual([]);
  });

  it("notifies the resolved login error and resolves { ok: false }", async () => {
    const backend = createBackend();
    backend.failures.set(
      LOGIN,
      apiClientError([{ code: "0", detail: "No matching customer" }], 401),
    );
    const { session, run, notifications } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("ready"));

    const message = errorMessages.errors.login_no_matching_customer_internal;
    await expect(run((actions) => actions.login(credentials))).resolves.toEqual(
      { ok: false, message },
    );

    expect(notifications).toEqual([{ type: "error", message }]);
    expect(session().isLoggedIn).toBe(false);
    expect(
      backend.invocations.filter(({ operation }) => operation === READ_CONTEXT),
    ).toHaveLength(1);
  });

  it.each([
    {
      name: "logging in",
      initialCustomer: null,
      operation: LOGIN,
      call: (actions: SessionActions) => actions.login(credentials),
      expected: { ok: true },
      loggedInAfter: true,
    },
    {
      name: "registering",
      initialCustomer: null,
      operation: REGISTER,
      call: (actions: SessionActions) => actions.register(registrationInput),
      expected: { ok: true, doubleOptIn: false },
      loggedInAfter: true,
    },
    {
      name: "logging out",
      initialCustomer: customer(),
      operation: LOGOUT,
      call: (actions: SessionActions) => actions.logout(),
      expected: { ok: true },
      loggedInAfter: false,
    },
  ])(
    "waits for the client and the first context read before $name",
    async ({ initialCustomer, operation, call, expected, loggedInAfter }) => {
      const pendingConfig = deferred<PublicShopwareConfig>();
      const pendingRead = deferred<void>();
      browser.loadPublicConfig.mockReturnValue(pendingConfig.promise);
      const backend = createBackend(initialCustomer);
      backend.heldRead = pendingRead.promise;
      const { session } = await setup();

      let result: SessionActionResult | undefined;
      await interact(() => {
        const { actions } = harness;
        if (!actions) throw new Error("No session actions");
        void call(actions).then((value) => {
          result = value;
        });
      });
      expect(backend.invocations).toEqual([]);
      expect(result).toBeUndefined();

      await interact(() => pendingConfig.resolve(config));
      await vi.waitFor(() =>
        expect(backend.invocations.map((entry) => entry.operation)).toEqual([
          READ_CONTEXT,
        ]),
      );
      await interact(async () => {
        await new Promise((settle) => setTimeout(settle, 0));
      });

      expect(backend.invocations.map((entry) => entry.operation)).toEqual([
        READ_CONTEXT,
      ]);
      expect(result).toBeUndefined();

      await interact(() => pendingRead.resolve());

      await vi.waitFor(() => expect(result).toEqual(expected));
      expect(backend.invocations.map((entry) => entry.operation)).toEqual([
        READ_CONTEXT,
        operation,
        READ_CONTEXT,
      ]);
      if (operation === REGISTER) {
        expect(backend.invocations[1]?.params).toMatchObject({
          body: { storefrontUrl: ENGLISH_DOMAIN },
        });
      }
      expect(browser.createBrowserClient).toHaveBeenCalledTimes(1);
      await vi.waitFor(() => expect(session().isLoggedIn).toBe(loggedInAfter));
    },
  );

  it("registers with the storefront URL of the current context", async () => {
    const backend = createBackend();
    const { session, run } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("ready"));

    await expect(
      run((actions) => actions.register(registrationInput)),
    ).resolves.toEqual({ ok: true, doubleOptIn: false });

    expect(backend.invocations[1]).toEqual({
      operation: REGISTER,
      params: { body: { ...registrationInput, storefrontUrl: ENGLISH_DOMAIN } },
    });
    await vi.waitFor(() => expect(session().isLoggedIn).toBe(true));
  });

  it("prefers the configured dev storefront URL when it is a sales channel domain", async () => {
    browser.loadPublicConfig.mockResolvedValue({
      ...config,
      devStorefrontUrl: "https://shop.test/de/",
    });
    const backend = createBackend();
    const { session, run } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("ready"));

    await run((actions) => actions.register(registrationInput));

    expect(backend.invocations[1]?.params).toMatchObject({
      body: { storefrontUrl: "https://shop.test/de" },
    });
  });

  it("treats a logout of a session that already ended elsewhere as done", async () => {
    const backend = createBackend(customer());
    backend.failures.set(
      LOGOUT,
      apiClientError(
        [
          {
            code: "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN",
            detail: "Customer is not logged in.",
          },
        ],
        403,
      ),
    );
    const { session, run, notifications } = await setup();
    await vi.waitFor(() => expect(session().isLoggedIn).toBe(true));
    backend.customer = null;

    await expect(run((actions) => actions.logout())).resolves.toEqual({
      ok: true,
    });

    expect(notifications).toEqual([]);
    await vi.waitFor(() => expect(session().isLoggedIn).toBe(false));
    expect(session().status).toBe("ready");
  });

  it("logs out and re-reads the context", async () => {
    const backend = createBackend(customer());
    const { session, run } = await setup();
    await vi.waitFor(() => expect(session().isLoggedIn).toBe(true));

    await expect(run((actions) => actions.logout())).resolves.toEqual({
      ok: true,
    });

    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      READ_CONTEXT,
      LOGOUT,
      READ_CONTEXT,
    ]);
    await vi.waitFor(() => expect(session().isLoggedIn).toBe(false));
    expect(session().status).toBe("ready");
  });
});
