import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type { CmsNotification } from "@shopware/cms-base-layer-react/client";
import { Activity, StrictMode, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "#shopware";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { deferred } from "@/features/checkout/checkoutTestDoubles";
import { loadPublicConfig } from "@/features/session/browserClient";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { apiClientError } from "@/features/session/session.fixture";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  query,
  queryAll,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  CHECK_HASH,
  RESET_PASSWORD,
  VALID_HASH,
  anonymousSessionWithDomains,
  isExpiredAnswer,
  violation,
} from "../recovery.fixture";
import { ResetPasswordPageContent } from "./ResetPasswordPageContent";

const navigation = vi.hoisted(() => ({ replace: vi.fn(), push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
}));

vi.mock("@/features/session/browserClient", () => ({
  loadPublicConfig: vi.fn(),
}));

const SKELETON = '[data-testid="account-reset-password-skeleton"]';
const LINK_ERROR = '[data-testid="account-reset-password-link-error"]';
const RESET_FORM = '[data-testid="account-reset-password-form"]';
const REQUEST_FORM = '[data-testid="account-recover-password-form"]';
const SUBMIT = '[data-testid="account-reset-password-submit-button"]';
const EXPIRED =
  "The password reset link is no longer valid. Please request a new one.";
const INVALID = "The password reset link is invalid. Please request a new one.";
const MESSAGE_DEFAULT =
  "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.";
const SECRET = "Secret123";

let mounted: Mounted | undefined;
let consoleError: ReturnType<typeof vi.spyOn>;

const activity: { set?: (mode: "visible" | "hidden") => void } = {};

function ControlledActivity({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"visible" | "hidden">("visible");
  useEffect(() => {
    activity.set = setMode;
    return () => {
      activity.set = undefined;
    };
  }, []);
  return <Activity mode={mode}>{children}</Activity>;
}

beforeEach(() => {
  navigation.replace.mockReset();
  navigation.push.mockReset();
  vi.mocked(loadPublicConfig).mockReset();
  vi.mocked(loadPublicConfig).mockResolvedValue({
    endpoint: "https://shop.test/store-api",
    accessToken: "access-token",
    devStorefrontUrl: null,
  });
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  window.history.replaceState(
    null,
    "",
    `/account/recover/password?hash=${VALID_HASH}`,
  );
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

function answerWith({
  check = () => isExpiredAnswer(false),
  reset = () => ({ success: true }),
}: {
  check?: FakeAnswer;
  reset?: FakeAnswer;
} = {}): FakeAnswer {
  return (operation, params) =>
    operation === CHECK_HASH
      ? check(operation, params)
      : reset(operation, params);
}

type SetupOptions = {
  answer?: FakeAnswer;
  locale?: Locale;
  strict?: boolean;
  inActivity?: boolean;
  refreshSession?: () => Promise<void>;
};

async function setup({
  answer = answerWith(),
  locale = "en-GB",
  strict = false,
  inActivity = false,
  refreshSession,
}: SetupOptions = {}) {
  const order: string[] = [];
  const shopware = fakeClient((operation, params) => {
    order.push(operation);
    return answer(operation, params);
  });
  const notify = vi.fn((notification: CmsNotification) => {
    order.push(`notify:${notification.type}`);
  });
  const refresh = vi.fn(
    refreshSession ??
      (async () => {
        order.push("refreshSession");
      }),
  );
  navigation.replace.mockImplementation((target: string) => {
    order.push(`replace:${target}`);
  });
  const getClient = async () => shopware.client as unknown as ApiClient;
  const session = anonymousSessionWithDomains([
    { url: window.location.origin, languageId: "language-en" },
  ]);
  const content = inActivity ? (
    <ControlledActivity>
      <ResetPasswordPageContent />
    </ControlledActivity>
  ) : (
    <ResetPasswordPageContent />
  );
  const tree = withI18n(
    <CmsActionsProvider actions={{ notify }}>
      <SessionProvider session={session}>
        <SessionActionsProvider
          actions={{
            refreshSession: refresh,
            retrySession: async () => session,
          }}
        >
          <ShopwareClientProvider getClient={getClient}>
            {content}
          </ShopwareClientProvider>
        </SessionActionsProvider>
      </SessionProvider>
    </CmsActionsProvider>,
    locale,
  );
  mounted = await mount(strict ? <StrictMode>{tree}</StrictMode> : tree);
  const { container } = mounted;
  const field = (id: string) => query<HTMLInputElement>(container, `#${id}`);
  const fill = async (newPassword: string, newPasswordConfirm: string) => {
    await interact(() => {
      setInputValue(field("newPassword"), newPassword);
      setInputValue(field("newPasswordConfirm"), newPasswordConfirm);
    });
  };
  const submit = () =>
    interact(() => submitForm(query<HTMLFormElement>(container, RESET_FORM)));
  return {
    shopware,
    notify,
    refreshSession: refresh,
    order,
    container,
    field,
    fill,
    submit,
    error: (id: string) => container.querySelector(`#${id}-error`),
  };
}

describe("ResetPasswordPageContent in the browser", () => {
  it.each([
    ["no hash", "/account/recover/password"],
    ["an empty hash", "/account/recover/password?hash="],
    ["a short hash", `/account/recover/password?hash=${VALID_HASH.slice(1)}`],
    [
      "a hash with other characters",
      `/account/recover/password?hash=${VALID_HASH.slice(1)}%2F`,
    ],
  ])(
    "shows the invalid link with the request form for %s without a request",
    async (_, url) => {
      window.history.replaceState(null, "", url);

      const { shopware, container } = await setup();

      const message = query<HTMLElement>(container, LINK_ERROR);
      expect(message.textContent).toBe(INVALID);
      expect(message.dataset.reason).toBe("invalid");
      expect(document.activeElement).not.toBe(message);
      expect(query(container, REQUEST_FORM)).toBeTruthy();
      expect(query(container, "#reset-recover-email")).toBeTruthy();
      expect(container.querySelector(RESET_FORM)).toBeNull();
      expect(shopware.invocations).toEqual([]);
    },
  );

  it("shows the skeleton while the link is checked, then the form", async () => {
    const check = deferred<unknown>();
    const { shopware, container } = await setup({
      answer: answerWith({ check: () => check.promise }),
    });

    expect(query(container, SKELETON).getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector(RESET_FORM)).toBeNull();
    expect(shopware.calls(CHECK_HASH)[0]?.params).toEqual({
      body: { hash: VALID_HASH },
      fetchOptions: { timeout: 10_000 },
    });

    await interact(() => check.resolve(isExpiredAnswer(false)));

    expect(container.querySelector(SKELETON)).toBeNull();
    expect(query(container, RESET_FORM)).toBeTruthy();
  });

  it("checks the link once under StrictMode", async () => {
    const { shopware, container } = await setup({ strict: true });

    await vi.waitFor(() => expect(query(container, RESET_FORM)).toBeTruthy());
    expect(shopware.calls(CHECK_HASH)).toHaveLength(1);
  });

  it("checks the link once across a hidden and revealed Activity", async () => {
    window.history.replaceState(
      null,
      "",
      `/account/recover/password?hash=${VALID_HASH}`,
    );
    const { shopware } = await setup({ inActivity: true });
    window.history.replaceState(null, "", "/account/login");

    await interact(() => activity.set?.("hidden"));
    await interact(() => activity.set?.("visible"));

    expect(shopware.calls(CHECK_HASH)).toHaveLength(1);
    expect(queryAll(document.body, RESET_FORM)).toHaveLength(1);
    expect(queryAll(document.body, LINK_ERROR)).toHaveLength(0);
  });

  it("shows an expired link with the request form", async () => {
    const { container } = await setup({
      answer: answerWith({ check: () => isExpiredAnswer(true) }),
    });

    const message = query<HTMLElement>(container, LINK_ERROR);
    expect(message.textContent).toBe(EXPIRED);
    expect(message.dataset.reason).toBe("expired");
    expect(document.activeElement).not.toBe(message);
    expect(query(container, REQUEST_FORM)).toBeTruthy();
    expect(container.querySelector(RESET_FORM)).toBeNull();
  });

  it("shows an unknown link as invalid", async () => {
    const { container } = await setup({
      answer: answerWith({
        check: () => {
          throw apiClientError(
            [
              {
                code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH",
                detail: `No customer for the hash "${VALID_HASH}".`,
              },
            ],
            404,
          );
        },
      }),
    });

    expect(query(container, LINK_ERROR).textContent).toBe(INVALID);
    expect(container.textContent).not.toContain(`"${VALID_HASH}"`);
  });

  it("offers a retry when the check fails and checks again", async () => {
    let fail = true;
    const { shopware, container } = await setup({
      answer: answerWith({
        check: () => {
          if (fail) throw apiClientError([{ detail: VALID_HASH }], 500);
          return isExpiredAnswer(false);
        },
      }),
    });

    expect(query(container, '[role="alert"]').textContent).toBe(
      MESSAGE_DEFAULT,
    );
    expect(consoleError).toHaveBeenCalledWith(
      "[Recovery] checking the recovery link failed",
      { status: 500, codes: [] },
    );
    const retry = queryAll<HTMLButtonElement>(container, "button").find(
      (button) => button.textContent === "Try again",
    );
    fail = false;
    window.history.replaceState(null, "", "/account/recover/password");

    await interact(() => retry?.click());

    await vi.waitFor(() => expect(query(container, RESET_FORM)).toBeTruthy());
    expect(shopware.calls(CHECK_HASH).map(({ params }) => params)).toEqual([
      { body: { hash: VALID_HASH }, fetchOptions: { timeout: 10_000 } },
      { body: { hash: VALID_HASH }, fetchOptions: { timeout: 10_000 } },
    ]);
  });

  it("renders the two password fields with the hint and the storefront button", async () => {
    const { container, field } = await setup();

    expect(
      container.querySelector('label[for="newPassword"]')?.textContent,
    ).toBe("Enter new password*");
    expect(
      container.querySelector('label[for="newPasswordConfirm"]')?.textContent,
    ).toBe("Repeat new password*");
    for (const id of ["newPassword", "newPasswordConfirm"]) {
      expect(field(id).type).toBe("password");
      expect(field(id).autocomplete).toBe("new-password");
      expect(field(id).getAttribute("aria-required")).toBe("true");
    }
    expect(query(container, "#newPassword-hint").textContent).toBe(
      "At least 8 characters",
    );
    expect(query(container, SUBMIT).textContent).toBe("Change password");
  });

  it("checks both fields before sending anything", async () => {
    const { shopware, field, fill, submit, error } = await setup();

    await fill("short", "shorter");
    await submit();

    expect(error("newPassword")?.textContent).toBe(
      "This minimum length should be at least 8",
    );
    expect(error("newPasswordConfirm")?.textContent).toBe(
      "The passwords needs to be the same",
    );
    expect(document.activeElement).toBe(field("newPassword"));
    expect(shopware.calls(RESET_PASSWORD)).toEqual([]);
  });

  it("resets the password, then toasts, refreshes the session and replaces to the login", async () => {
    const { shopware, notify, order, fill, submit } = await setup();

    await fill("new secret 1", "new secret 1");
    await submit();

    expect(shopware.calls(RESET_PASSWORD)[0]?.params).toEqual({
      body: {
        hash: VALID_HASH,
        newPassword: "new secret 1",
        newPasswordConfirm: "new secret 1",
      },
    });
    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "Password has been updated successfully.",
    });
    expect(order).toEqual([
      CHECK_HASH,
      RESET_PASSWORD,
      "notify:success",
      "refreshSession",
      "replace:/account/login?redirect=%2Faccount",
    ]);
  });

  it("keeps the locale prefix in the login target", async () => {
    const { fill, submit } = await setup({ locale: "pl-PL" });

    await fill("nowe haslo 1", "nowe haslo 1");
    await submit();

    expect(navigation.replace).toHaveBeenCalledWith(
      "/pl-PL/account/login?redirect=%2Fpl-PL%2Faccount",
    );
  });

  it("does not navigate after an unmount during the session refresh", async () => {
    const refresh = deferred<void>();
    const { fill, submit } = await setup({
      refreshSession: () => refresh.promise,
    });
    await fill("new secret 1", "new secret 1");
    await submit();

    await mounted?.unmount();
    mounted = undefined;
    refresh.resolve();
    await new Promise((settle) => setTimeout(settle, 0));

    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it("sends once and never flips to an expired link after a success", async () => {
    const reset = deferred<unknown>();
    const refresh = deferred<void>();
    let resets = 0;
    const { shopware, container, fill, submit } = await setup({
      answer: answerWith({
        reset: () => {
          resets += 1;
          if (resets === 1) return reset.promise;
          throw apiClientError(
            [{ code: "CHECKOUT__CUSTOMER_RECOVERY_HASH_EXPIRED" }],
            410,
          );
        },
      }),
      refreshSession: () => refresh.promise,
    });
    await fill("new secret 1", "new secret 1");

    await submit();
    await submit();
    await interact(() => reset.resolve({ success: true }));
    await submit();

    expect(shopware.calls(RESET_PASSWORD)).toHaveLength(1);
    expect(query(container, SUBMIT).getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector(LINK_ERROR)).toBeNull();

    await interact(() => refresh.resolve());
    await submit();

    expect(navigation.replace).toHaveBeenCalledTimes(1);
    expect(shopware.calls(RESET_PASSWORD)).toHaveLength(1);
    expect(query(container, SUBMIT).getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector(LINK_ERROR)).toBeNull();
  });

  it("sends once when the form is submitted twice before it re-renders", async () => {
    const reset = deferred<unknown>();
    const { shopware, container, fill } = await setup({
      answer: answerWith({ reset: () => reset.promise }),
    });
    await fill("new secret 1", "new secret 1");
    const form = query<HTMLFormElement>(container, RESET_FORM);

    await interact(() => {
      submitForm(form);
      submitForm(form);
    });
    await interact(() => reset.resolve({ success: true }));

    expect(shopware.calls(RESET_PASSWORD)).toHaveLength(1);
    expect(navigation.replace).toHaveBeenCalledTimes(1);
  });

  it.each([
    [
      "expired",
      EXPIRED,
      apiClientError(
        [
          {
            code: "CHECKOUT__CUSTOMER_RECOVERY_HASH_EXPIRED",
            detail: `The hash "${VALID_HASH}" is expired.`,
          },
        ],
        410,
      ),
    ],
    [
      "invalid",
      INVALID,
      apiClientError(
        [{ code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH", detail: VALID_HASH }],
        404,
      ),
    ],
  ])(
    "switches to the %s link after a rejected reset and focuses the message",
    async (reason, text, failure) => {
      const { container, refreshSession, fill, submit } = await setup({
        answer: answerWith({
          reset: () => {
            throw failure;
          },
        }),
      });
      await fill("new secret 1", "new secret 1");

      await submit();

      const message = query<HTMLElement>(container, LINK_ERROR);
      expect(message.dataset.reason).toBe(reason);
      expect(message.textContent).toBe(text);
      expect(document.activeElement).toBe(message);
      expect(container.querySelector(RESET_FORM)).toBeNull();
      expect(query(container, REQUEST_FORM)).toBeTruthy();
      expect(refreshSession).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
    },
  );

  it("shows the shop's higher minimum on the field", async () => {
    const { field, fill, submit, error } = await setup({
      answer: answerWith({
        reset: () => {
          throw apiClientError([
            violation("VIOLATION::TOO_SHORT_ERROR", "/newPassword", {
              "{{ min }}": "12",
              "{{ value }}": `"${SECRET}"`,
            }),
          ]);
        },
      }),
    });
    await fill(SECRET, SECRET);

    await submit();

    expect(error("newPassword")?.textContent).toBe(
      "This minimum length should be at least 12",
    );
    expect(document.activeElement).toBe(field("newPassword"));
    expect(navigation.replace).not.toHaveBeenCalled();

    await interact(() => setInputValue(field("newPassword"), `${SECRET}456`));

    expect(error("newPassword")).toBeNull();
  });

  it("puts a mismatch the backend reports on the confirmation without its detail", async () => {
    const { container, field, fill, submit, error } = await setup({
      answer: answerWith({
        reset: () => {
          throw apiClientError([
            violation(
              null,
              "/newPassword",
              {},
              `This value should be equal to ${SECRET}.`,
            ),
          ]);
        },
      }),
    });
    await fill("new secret 1", "new secret 1");

    await submit();

    expect(error("newPasswordConfirm")?.textContent).toBe(
      "The passwords needs to be the same",
    );
    expect(document.activeElement).toBe(field("newPasswordConfirm"));
    expect(container.innerHTML).not.toContain(SECRET);
  });

  it("shows the default message for any other failure and logs no secret", async () => {
    const { container, fill, submit } = await setup({
      answer: answerWith({
        reset: () => {
          throw apiClientError(
            [{ code: "X", detail: `${SECRET} ${VALID_HASH}` }],
            500,
          );
        },
      }),
    });
    await fill("new secret 1", "new secret 1");

    await submit();

    expect(query(container, '[role="alert"]').textContent).toBe(
      MESSAGE_DEFAULT,
    );
    expect(container.innerHTML).not.toContain(SECRET);
    expect(consoleError).toHaveBeenCalledWith(
      "[Recovery] resetting the password failed",
      { status: 500, codes: ["X"] },
    );
    const logged = JSON.stringify(consoleError.mock.calls);
    expect(logged).not.toContain(SECRET);
    expect(logged).not.toContain(VALID_HASH);
  });
});
