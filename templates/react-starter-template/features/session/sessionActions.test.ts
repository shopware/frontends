import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "#shopware";
import { testTranslator } from "@/test/i18n";

import { READ_TIMEOUT_MS } from "./readTimeout";
import {
  apiClientError,
  apiClientErrorWithBody,
  customer,
  registrationInput,
} from "./session.fixture";
import { createSessionActions } from "./sessionActions";
import type { SessionNotification } from "./sessionActions";

type Invocation = { operation: string; params: unknown };

const STOREFRONT_URL = "https://shop.test/en";
const en = testTranslator("en-GB");
const DEFAULT_MESSAGE = en("errors.message-default");

function setup(answer: (operation: string) => unknown = () => ({}), t = en) {
  const invocations: Invocation[] = [];
  const order: string[] = [];
  const invoke = (async (operation: string, params?: unknown) => {
    invocations.push({ operation, params });
    order.push(operation);
    return { data: await answer(operation), status: 200 };
  }) as ApiClient["invoke"];
  const refreshSession = vi.fn(async () => {
    order.push("refreshSession");
  });
  const getStorefrontUrl = vi.fn(async () => STOREFRONT_URL);
  const notifications: SessionNotification[] = [];
  const actions = createSessionActions({
    client: { invoke },
    refreshSession,
    getStorefrontUrl,
    notify: (notification) => {
      notifications.push(notification);
    },
    t,
  });
  return {
    actions,
    invocations,
    order,
    refreshSession,
    getStorefrontUrl,
    notifications,
  };
}

function rejectWith(error: unknown) {
  return (operation: string) => {
    if (operation === "readContext get /context") return {};
    throw error;
  };
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createSessionActions().login", () => {
  it("logs in with the credentials, refreshes the session and resolves ok", async () => {
    const { actions, invocations, order, notifications } = setup();

    await expect(
      actions.login({ username: "jane@example.com", password: "secret" }),
    ).resolves.toEqual({ ok: true });

    expect(invocations).toEqual([
      {
        operation: "loginCustomer post /account/login",
        params: {
          body: { username: "jane@example.com", password: "secret" },
        },
      },
    ]);
    expect(order).toEqual([
      "loginCustomer post /account/login",
      "refreshSession",
    ]);
    expect(notifications).toEqual([]);
  });

  it("notifies the resolved login error and resolves it without refreshing", async () => {
    const { actions, refreshSession, notifications } = setup(
      rejectWith(apiClientError([{ code: "0", detail: "No customer" }], 401)),
    );

    await expect(
      actions.login({ username: "jane@example.com", password: "wrong" }),
    ).resolves.toEqual({
      ok: false,
      message: en("errors.login_no_matching_customer_internal"),
    });

    expect(notifications).toEqual([
      {
        type: "error",
        message: en("errors.login_no_matching_customer_internal"),
      },
    ]);
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("stays ok when the refresh after a successful login fails", async () => {
    const { actions, refreshSession, notifications } = setup();
    refreshSession.mockRejectedValueOnce(new Error("context down"));

    await expect(
      actions.login({ username: "jane@example.com", password: "secret" }),
    ).resolves.toEqual({ ok: true });

    expect(notifications).toEqual([]);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });
});

describe("createSessionActions().register", () => {
  it("registers with the storefront URL, refreshes the session and resolves ok for an active customer", async () => {
    const { actions, invocations, order, getStorefrontUrl } = setup(() =>
      customer({ active: true, doubleOptInRegistration: false }),
    );

    await expect(actions.register(registrationInput)).resolves.toEqual({
      ok: true,
      doubleOptIn: false,
    });

    expect(getStorefrontUrl).toHaveBeenCalledTimes(1);
    expect(invocations).toEqual([
      {
        operation: "register post /account/register",
        params: {
          body: { ...registrationInput, storefrontUrl: STOREFRONT_URL },
        },
      },
    ]);
    expect(order).toEqual([
      "register post /account/register",
      "refreshSession",
    ]);
  });

  it("resolves ok with doubleOptIn for a double opt-in registration", async () => {
    const { actions, refreshSession } = setup(() =>
      customer({ active: false, doubleOptInRegistration: true }),
    );

    await expect(actions.register(registrationInput)).resolves.toEqual({
      ok: true,
      doubleOptIn: true,
    });
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("resolves not ok for an inactive customer without double opt-in", async () => {
    const { actions, notifications } = setup(() =>
      customer({ active: false, doubleOptInRegistration: false }),
    );

    await expect(actions.register(registrationInput)).resolves.toEqual({
      ok: false,
      doubleOptIn: false,
    });
    expect(notifications).toEqual([]);
  });

  it("notifies every resolved registration error and resolves the first one", async () => {
    const { actions, refreshSession, notifications } = setup(
      rejectWith(
        apiClientError([
          {
            code: "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE",
            meta: { parameters: { "{{ email }}": "jane@example.com" } },
          },
          { code: "VIOLATION::ZIP_CODE_INVALID" },
        ]),
      ),
    );

    await expect(actions.register(registrationInput)).resolves.toEqual({
      ok: false,
      message: "The email address jane@example.com is already in use",
    });

    expect(notifications).toEqual([
      {
        type: "error",
        message: "The email address jane@example.com is already in use",
      },
      {
        type: "error",
        message: en("errors.VIOLATION::ZIP_CODE_INVALID"),
      },
    ]);
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("stays ok when the refresh after a successful registration fails", async () => {
    const { actions, refreshSession } = setup(() => customer({ active: true }));
    refreshSession.mockRejectedValueOnce(new Error("context down"));

    await expect(actions.register(registrationInput)).resolves.toEqual({
      ok: true,
      doubleOptIn: false,
    });
  });
});

describe("createSessionActions().confirmRegistration", () => {
  const REGISTER_CONFIRM = "registerConfirm post /account/register-confirm";
  const HASH = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";
  const link = { em: "5d41402abc4b2a76b9719d911017c592", hash: HASH };

  it("confirms the link, re-reads the session as a new identity and resolves confirmed", async () => {
    const { actions, invocations, order, refreshSession, notifications } =
      setup(() => customer({ guest: false }));

    await expect(actions.confirmRegistration(link)).resolves.toEqual({
      status: "confirmed",
      guest: false,
    });

    expect(invocations).toEqual([
      { operation: REGISTER_CONFIRM, params: { body: link } },
    ]);
    expect(order).toEqual([REGISTER_CONFIRM, "refreshSession"]);
    expect(refreshSession).toHaveBeenCalledExactlyOnceWith(undefined);
    expect(notifications).toEqual([]);
  });

  it("tells a guest order confirmation apart", async () => {
    const { actions } = setup(() => customer({ guest: true }));

    await expect(actions.confirmRegistration(link)).resolves.toEqual({
      status: "confirmed",
      guest: true,
    });
  });

  it("stays confirmed when the re-read after the confirmation fails", async () => {
    const { actions, refreshSession, notifications } = setup(() => customer());
    refreshSession.mockRejectedValueOnce(new Error("context down"));

    await expect(actions.confirmRegistration(link)).resolves.toEqual({
      status: "confirmed",
      guest: false,
    });
    expect(notifications).toEqual([]);
  });

  it.each([
    [
      "alreadyConfirmed",
      apiClientError(
        [{ code: "CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED", detail: "Done" }],
        412,
      ),
    ],
    [
      "invalidLink",
      apiClientError(
        [
          {
            code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH",
            detail: `No matching customer for the hash "${HASH}" was found.`,
          },
        ],
        404,
      ),
    ],
    ["failed", new TypeError("Failed to fetch")],
  ])(
    "resolves %s without a toast and without touching the session",
    async (status, error) => {
      const { actions, refreshSession, notifications } = setup(
        rejectWith(error),
      );

      await expect(actions.confirmRegistration(link)).resolves.toEqual({
        status,
      });
      expect(notifications).toEqual([]);
      expect(refreshSession).not.toHaveBeenCalled();
    },
  );

  it("logs only the status and the codes of a failure, never the hash", async () => {
    const { actions } = setup(
      rejectWith(
        apiClientError(
          [
            {
              code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH",
              detail: `No matching customer for the hash "${HASH}" was found.`,
            },
          ],
          503,
        ),
      ),
    );

    await expect(actions.confirmRegistration(link)).resolves.toEqual({
      status: "failed",
    });
    expect(consoleError).toHaveBeenCalledExactlyOnceWith(
      "[Session] confirming the registration failed",
      { status: 503, codes: ["CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH"] },
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(HASH);
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(link.em);
  });

  it("does not log an expected outcome", async () => {
    const { actions } = setup(
      rejectWith(
        apiClientError(
          [{ code: "CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED" }],
          412,
        ),
      ),
    );

    await actions.confirmRegistration(link);

    expect(consoleError).not.toHaveBeenCalled();
  });
});

describe("createSessionActions().logout", () => {
  it("logs out, refreshes the session and resolves ok", async () => {
    const { actions, invocations, order } = setup();

    await expect(actions.logout()).resolves.toEqual({ ok: true });

    expect(invocations).toEqual([
      { operation: "logoutCustomer post /account/logout", params: undefined },
    ]);
    expect(order).toEqual([
      "logoutCustomer post /account/logout",
      "refreshSession",
    ]);
  });

  it("notifies the default message for a failure that is not an API error", async () => {
    const { actions, notifications, refreshSession } = setup(
      rejectWith(new TypeError("Failed to fetch")),
    );

    await expect(actions.logout()).resolves.toEqual({
      ok: false,
      message: DEFAULT_MESSAGE,
    });
    expect(notifications).toEqual([
      { type: "error", message: DEFAULT_MESSAGE },
    ]);
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("treats a session that is already logged out as a completed logout and refreshes it", async () => {
    const { actions, notifications, refreshSession } = setup(
      rejectWith(
        apiClientError(
          [
            {
              code: "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN",
              detail: "Customer is not logged in.",
            },
          ],
          403,
        ),
      ),
    );

    await expect(actions.logout()).resolves.toEqual({ ok: true });

    expect(notifications).toEqual([]);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("still fails for any other forbidden logout", async () => {
    const { actions, notifications, refreshSession } = setup(
      rejectWith(
        apiClientError(
          [
            {
              code: "FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND",
              detail: "No",
            },
          ],
          403,
        ),
      ),
    );

    await expect(actions.logout()).resolves.toEqual({
      ok: false,
      message: "No",
    });
    expect(notifications).toEqual([{ type: "error", message: "No" }]);
    expect(refreshSession).not.toHaveBeenCalled();
  });
});

describe("createSessionActions().setCurrency", () => {
  it("patches the context currency, refreshes the session keeping the last good one and resolves ok", async () => {
    const { actions, invocations, order, refreshSession, notifications } =
      setup();

    await expect(actions.setCurrency("currency-usd")).resolves.toEqual({
      ok: true,
    });

    expect(invocations).toEqual([
      {
        operation: "updateContext patch /context",
        params: {
          body: { currencyId: "currency-usd" },
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        },
      },
    ]);
    expect(order).toEqual(["updateContext patch /context", "refreshSession"]);
    expect(refreshSession).toHaveBeenCalledExactlyOnceWith({
      keepLastGood: true,
    });
    expect(notifications).toEqual([]);
  });

  it("notifies the resolved error and resolves it without refreshing", async () => {
    const { actions, refreshSession, notifications } = setup(
      rejectWith(
        apiClientError(
          [{ code: "VIOLATION::CURRENCY_NOT_FOUND", detail: "No currency" }],
          400,
        ),
      ),
    );

    await expect(actions.setCurrency("currency-xxx")).resolves.toEqual({
      ok: false,
      message: "No currency",
    });

    expect(notifications).toEqual([{ type: "error", message: "No currency" }]);
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("stays ok when the refresh after a successful switch fails", async () => {
    const { actions, refreshSession, notifications } = setup();
    refreshSession.mockRejectedValueOnce(new Error("context down"));

    await expect(actions.setCurrency("currency-usd")).resolves.toEqual({
      ok: true,
    });
    expect(notifications).toEqual([]);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });
});

describe("createSessionActions", () => {
  it.each([
    ["nothing", undefined],
    [
      "an HTML error page",
      apiClientErrorWithBody("<html>Bad gateway</html>", 502),
    ],
  ])("never rejects, whatever the client throws: %s", async (_, error) => {
    const { actions } = setup(rejectWith(error));

    const results = await Promise.allSettled([
      actions.login({ username: "jane@example.com", password: "secret" }),
      actions.register(registrationInput),
      actions.logout(),
      actions.setCurrency("currency-usd"),
    ]);

    expect(results).toEqual([
      { status: "fulfilled", value: { ok: false, message: DEFAULT_MESSAGE } },
      { status: "fulfilled", value: { ok: false, message: DEFAULT_MESSAGE } },
      { status: "fulfilled", value: { ok: false, message: DEFAULT_MESSAGE } },
      { status: "fulfilled", value: { ok: false, message: DEFAULT_MESSAGE } },
    ]);
    await expect(
      actions.confirmRegistration({ em: "em", hash: "hash" }),
    ).resolves.toEqual({ status: "failed" });
  });

  it("resolves not ok when the storefront URL cannot be determined", async () => {
    const { actions, invocations, getStorefrontUrl } = setup();
    getStorefrontUrl.mockRejectedValueOnce(new Error("no window"));

    await expect(actions.register(registrationInput)).resolves.toEqual({
      ok: false,
      message: DEFAULT_MESSAGE,
    });
    expect(invocations).toEqual([]);
  });
});

describe("createSessionActions translations", () => {
  it("notifies and resolves the messages in the language of the translator", async () => {
    const de = testTranslator("de-DE");
    const { actions, notifications } = setup(
      rejectWith(apiClientError([{ code: "0" }], 401)),
      de,
    );

    const message = de("errors.login_no_matching_customer_internal");
    await expect(
      actions.login({ username: "jane@example.com", password: "wrong" }),
    ).resolves.toEqual({ ok: false, message });
    expect(message).toBe("Ungültiger Benutzername und/oder Passwort.");
    expect(notifications).toEqual([{ type: "error", message }]);
  });
});
