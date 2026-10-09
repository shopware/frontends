import { StrictMode, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import type { GetShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import type { Locale } from "@/i18n/config";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import { testTranslator, withI18n } from "@/test/i18n";
import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

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
import {
  useLoadShopwareLanguages,
  useShopwareLanguages,
} from "./ShopwareLanguagesContext";
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
      isGuestSession: false,
      customerName: null,
      wishlistCount: 0,
      context: null,
    });

    await interact(() => pendingConfig.resolve(config));

    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(session()).toEqual({
      status: "ready",
      isLoggedIn: false,
      isGuestSession: false,
      customerName: null,
      wishlistCount: 0,
      context: salesChannelContext(null),
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
    ["a guest", customer({ guest: true }), true],
    ["an inactive customer", customer({ active: false }), false],
  ])("is logged out for %s", async (_, current, isGuestSession) => {
    createBackend(current);
    const { session } = await setup();

    await vi.waitFor(() => expect(session().status).toBe("ready"));
    expect(session()).toMatchObject({
      isLoggedIn: false,
      isGuestSession,
      customerName: null,
    });
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

    const defaultMessage = testTranslator()("errors.message-default");
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

    const message = testTranslator()(
      "errors.login_no_matching_customer_internal",
    );
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

describe("ShopwareSessionProvider client and refresh", () => {
  it("hands out the session client after the first context read with a stable getter", async () => {
    const pendingRead = deferred<void>();
    const backend = createBackend();
    backend.heldRead = pendingRead.promise;
    const getters: GetShopwareClient[] = [];
    function ClientProbe() {
      const { status } = useSession();
      const getClient = useShopwareClient();
      useEffect(() => {
        getters.push(getClient);
      }, [status, getClient]);
      return <Probe />;
    }
    mounted = await mount(
      <ShopwareSessionProvider notify={() => {}}>
        <ClientProbe />
      </ShopwareSessionProvider>,
    );

    let client: ApiClient | undefined;
    await interact(() => {
      void getters[0]?.().then((value) => {
        client = value;
      });
    });
    await vi.waitFor(() => expect(backend.invocations).toHaveLength(1));
    expect(client).toBeUndefined();

    await interact(() => pendingRead.resolve());

    await vi.waitFor(() => expect(client).toBeDefined());
    expect(client).toBe(browser.createBrowserClient.mock.results[0]?.value);
    expect(getters.length).toBeGreaterThan(1);
    expect(new Set(getters).size).toBe(1);
  });

  it("re-reads the context through refreshSession and publishes it", async () => {
    const backend = createBackend();
    const { session } = await setup();
    await vi.waitFor(() => expect(session().status).toBe("ready"));
    backend.customer = customer({ guest: true });

    await interact(() => {
      void harness.actions?.refreshSession();
    });

    await vi.waitFor(() => expect(session().isGuestSession).toBe(true));
    expect(session()).toMatchObject({ isLoggedIn: false, status: "ready" });
    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      READ_CONTEXT,
      READ_CONTEXT,
    ]);
  });
});

const READ_LANGUAGES = "readLanguagesGet get /language";
const UPDATE_CONTEXT = "updateContext patch /context";

function createLanguageBackend({
  languageId = "language-en",
  defaultLanguageId = "language-en",
  languages = [
    { id: "language-en", translationCode: { code: "en-GB" } },
    { id: "language-de", translationCode: { code: "de-DE" } },
  ],
  languageFailures = 0,
}: {
  languageId?: string;
  defaultLanguageId?: string;
  languages?: { id: string; translationCode: { code: string } }[];
  languageFailures?: number;
} = {}) {
  const backend = {
    languageId,
    languageFailures,
    invocations: [] as Invocation[],
    headers: [] as Record<string, string>[],
  };
  const invoke = async (operation: string, params?: unknown) => {
    backend.invocations.push({ operation, params });
    switch (operation) {
      case READ_CONTEXT:
        return {
          data: {
            ...salesChannelContext(null),
            context: { languageIdChain: [backend.languageId] },
            salesChannel: {
              ...salesChannelContext(null).salesChannel,
              languageId: defaultLanguageId,
            },
          },
          status: 200,
        };
      case READ_LANGUAGES:
        if (backend.languageFailures > 0) {
          backend.languageFailures -= 1;
          throw new TypeError("Failed to fetch");
        }
        return { data: { elements: languages }, status: 200 };
      case UPDATE_CONTEXT:
        backend.languageId = (
          params as { body: { languageId: string } }
        ).body.languageId;
        return { data: {}, status: 200 };
      case LOGIN:
        throw apiClientError([{ code: "0" }], 401);
      default:
        throw new Error(`Unexpected operation ${operation}`);
    }
  };
  browser.createBrowserClient.mockImplementation(
    () =>
      ({
        invoke,
        defaultHeaders: {
          apply: (headers: Record<string, string>) => {
            backend.headers.push(headers);
          },
        },
      }) as unknown as ApiClient,
  );
  return backend;
}

const localeHarness: { setLocale: ((locale: Locale) => void) | null } = {
  setLocale: null,
};

function LocaleSwitch({ initial }: { initial: Locale }) {
  const [locale, setLocale] = useState<Locale>(initial);
  useEffect(() => {
    localeHarness.setLocale = setLocale;
  }, []);
  return withI18n(
    <ShopwareSessionProvider locale={locale} notify={() => {}}>
      <Probe />
    </ShopwareSessionProvider>,
    locale,
  );
}

function languageChain(container: HTMLElement): string[] | undefined {
  const session: StorefrontSession = JSON.parse(
    query<HTMLOutputElement>(container, '[data-testid="session"]')
      .textContent ?? "",
  );
  return session.context?.context?.languageIdChain;
}

describe("ShopwareSessionProvider locale", () => {
  it("applies the Shopware language of the page locale to the session", async () => {
    const backend = createLanguageBackend();
    mounted = await mount(<LocaleSwitch initial="de-DE" />);
    const { container } = mounted;

    await vi.waitFor(() =>
      expect(languageChain(container)).toEqual(["language-de"]),
    );
    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
      UPDATE_CONTEXT,
      READ_CONTEXT,
    ]);
    expect(backend.invocations[2]?.params).toEqual({
      body: { languageId: "language-de" },
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    });
    expect(backend.headers).toEqual([{ "sw-language-id": "language-de" }]);
  });

  it("re-applies the language when the locale changes in the browser", async () => {
    const backend = createLanguageBackend();
    mounted = await mount(<LocaleSwitch initial="en-GB" />);
    const { container } = mounted;
    await vi.waitFor(() =>
      expect(backend.invocations.map(({ operation }) => operation)).toEqual([
        READ_CONTEXT,
        READ_LANGUAGES,
      ]),
    );

    await interact(() => localeHarness.setLocale?.("de-DE"));

    await vi.waitFor(() =>
      expect(languageChain(container)).toEqual(["language-de"]),
    );
    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
      UPDATE_CONTEXT,
      READ_CONTEXT,
    ]);
    expect(backend.headers).toEqual([
      { "sw-language-id": "language-en" },
      { "sw-language-id": "language-de" },
    ]);
  });

  it("resolves action errors in the language of the page", async () => {
    createLanguageBackend();
    const notifications: SessionNotification[] = [];
    mounted = await mount(
      withI18n(
        <ShopwareSessionProvider
          locale="de-DE"
          notify={(notification) => {
            notifications.push(notification);
          }}
        >
          <Probe />
        </ShopwareSessionProvider>,
        "de-DE",
      ),
    );

    let result: SessionActionResult | undefined;
    await interact(() => {
      void harness.actions?.login(credentials).then((value) => {
        result = value;
      });
    });

    const message = testTranslator("de-DE")(
      "errors.login_no_matching_customer_internal",
    );
    await vi.waitFor(() => expect(result).toEqual({ ok: false, message }));
    expect(notifications).toEqual([{ type: "error", message }]);
  });
});

const languagesHarness: {
  load: ReturnType<typeof useLoadShopwareLanguages> | null;
} = { load: null };

function LanguagesProbe() {
  const languages = useShopwareLanguages();
  const load = useLoadShopwareLanguages();
  useEffect(() => {
    languagesHarness.load = load;
  }, [load]);
  return <output data-testid="languages">{JSON.stringify(languages)}</output>;
}

async function mountLanguages(locale: Locale) {
  mounted = await mount(
    withI18n(
      <ShopwareSessionProvider locale={locale} notify={() => {}}>
        <LanguagesProbe />
      </ShopwareSessionProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  return () =>
    JSON.parse(
      query<HTMLOutputElement>(container, '[data-testid="languages"]')
        .textContent ?? "null",
    );
}

describe("ShopwareSessionProvider languages", () => {
  it("provides the Shopware languages of the sales channel to its children", async () => {
    const pendingConfig = deferred<PublicShopwareConfig>();
    browser.loadPublicConfig.mockReturnValue(pendingConfig.promise);
    createLanguageBackend();
    const languages = await mountLanguages("de-DE");

    expect(languages()).toEqual([]);

    await interact(() => pendingConfig.resolve(config));

    await vi.waitFor(() =>
      expect(languages()).toEqual([
        { id: "language-en", code: "en-GB" },
        { id: "language-de", code: "de-DE" },
      ]),
    );
  });

  it("reads the languages again on request after a failed read and hands them to its children", async () => {
    const backend = createLanguageBackend({
      defaultLanguageId: "language-de",
      languageFailures: 1,
    });
    const languages = await mountLanguages("en-GB");
    await vi.waitFor(() =>
      expect(backend.invocations.map(({ operation }) => operation)).toEqual([
        READ_CONTEXT,
        READ_LANGUAGES,
      ]),
    );
    await new Promise((settle) => setTimeout(settle, 0));
    expect(languages()).toEqual([]);

    let loaded: unknown;
    await interact(() => {
      void languagesHarness.load?.().then((value) => {
        loaded = value;
      });
    });

    const expected = [
      { id: "language-en", code: "en-GB" },
      { id: "language-de", code: "de-DE" },
    ];
    await vi.waitFor(() =>
      expect(loaded).toEqual({
        languages: expected,
        defaultLanguageId: "language-de",
      }),
    );
    await vi.waitFor(() => expect(languages()).toEqual(expected));
  });
});

function ContentLanguageProbe() {
  return (
    <output data-testid="content-lang">{useContentLang() ?? "none"}</output>
  );
}

async function mountContentLanguage(locale: Locale) {
  mounted = await mount(
    withI18n(
      <ShopwareSessionProvider locale={locale} notify={() => {}}>
        <ContentLanguageProbe />
      </ShopwareSessionProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  return () =>
    query<HTMLOutputElement>(container, '[data-testid="content-lang"]')
      .textContent;
}

describe("ShopwareSessionProvider content language", () => {
  it("declares the session language when it differs from the page locale, like English (US) under pl-PL", async () => {
    const backend = createLanguageBackend({
      languageId: "language-us",
      defaultLanguageId: "language-us",
      languages: [{ id: "language-us", translationCode: { code: "en-US" } }],
    });

    const contentLang = await mountContentLanguage("pl-PL");

    await vi.waitFor(() => expect(contentLang()).toBe("en-US"));
    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      READ_CONTEXT,
      READ_LANGUAGES,
    ]);
  });

  it("declares nothing once the session uses the language of the locale", async () => {
    const backend = createLanguageBackend();

    const contentLang = await mountContentLanguage("de-DE");

    await vi.waitFor(() =>
      expect(backend.invocations.map(({ operation }) => operation)).toEqual([
        READ_CONTEXT,
        READ_LANGUAGES,
        UPDATE_CONTEXT,
        READ_CONTEXT,
      ]),
    );
    await new Promise((settle) => setTimeout(settle, 0));
    expect(contentLang()).toBe("none");
  });
});
