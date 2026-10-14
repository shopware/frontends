import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "#shopware";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { deferred } from "@/features/checkout/checkoutTestDoubles";
import { loadPublicConfig } from "@/features/session/browserClient";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { apiClientError } from "@/features/session/session.fixture";
import type { StorefrontSession } from "@/features/session/types";
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
  SEND_MAIL,
  anonymousSessionWithDomains,
  violation,
} from "../recovery.fixture";
import { RecoverPasswordForm } from "./RecoverPasswordForm";

vi.mock("@/features/session/browserClient", () => ({
  loadPublicConfig: vi.fn(),
}));

const FORM = '[data-testid="account-recover-password-form"]';
const EMAIL = '[data-testid="account-recover-password-email-input"]';
const SUCCESS = '[data-testid="account-recover-password-success"]';
const RESEND = '[data-testid="account-recover-password-resend-button"]';
const SENT =
  "If the provided email address is registered, a confirmation email including a password reset link has been sent.";
const MESSAGE_DEFAULT =
  "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.";

let mounted: Mounted | undefined;
let consoleError: ReturnType<typeof vi.spyOn>;

function origin(): string {
  return window.location.origin;
}

function domains() {
  return [
    { url: `${origin()}/`, languageId: "language-en" },
    { url: `${origin()}/pl-PL/`, languageId: "language-pl" },
  ];
}

beforeEach(() => {
  vi.mocked(loadPublicConfig).mockReset();
  vi.mocked(loadPublicConfig).mockResolvedValue({
    endpoint: "https://shop.test/store-api",
    accessToken: "access-token",
    devStorefrontUrl: null,
  });
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

type SetupOptions = {
  answer?: FakeAnswer;
  getClient?: () => Promise<ApiClient>;
  session?: StorefrontSession;
  locale?: Locale;
};

async function setup({
  answer = () => ({ success: true }),
  getClient,
  session = anonymousSessionWithDomains(domains()),
  locale = "en-GB",
}: SetupOptions = {}) {
  const shopware = fakeClient(answer);
  const retrySession = vi.fn(async () => session);
  const clientGetter =
    getClient ?? (async () => shopware.client as unknown as ApiClient);
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify: vi.fn() }}>
        <SessionProvider session={session}>
          <SessionActionsProvider actions={{ retrySession }}>
            <ShopwareClientProvider getClient={clientGetter}>
              <RecoverPasswordForm />
            </ShopwareClientProvider>
          </SessionActionsProvider>
        </SessionProvider>
      </CmsActionsProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  const email = () => query<HTMLInputElement>(container, EMAIL);
  const submit = async (value?: string) => {
    if (value !== undefined)
      await interact(() => setInputValue(email(), value));
    await interact(() => submitForm(query<HTMLFormElement>(container, FORM)));
  };
  return {
    shopware,
    retrySession,
    container,
    email,
    submit,
    alert: () => container.querySelector('[role="alert"]'),
    fieldError: () => container.querySelector("#recover-password-email-error"),
  };
}

describe("RecoverPasswordForm in the browser", () => {
  it("asks for an address before sending anything", async () => {
    const { shopware, email, submit, fieldError } = await setup();

    await submit();

    expect(fieldError()?.textContent).toBe("Value is required");
    expect(document.activeElement).toBe(email());
    expect(shopware.invocations).toEqual([]);
  });

  it("asks for a valid address before sending anything", async () => {
    const { shopware, email, submit, fieldError } = await setup();

    await submit("jane@");

    expect(fieldError()?.textContent).toBe(
      "Value is not a valid email address",
    );
    expect(email().getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(email());
    expect(shopware.invocations).toEqual([]);
  });

  it("sends the address with the trimmed sales channel domain", async () => {
    const { shopware, retrySession, submit } = await setup();

    await submit("jane@example.com");

    expect(retrySession).toHaveBeenCalledTimes(1);
    expect(shopware.invocations).toEqual([
      {
        operation: SEND_MAIL,
        params: {
          body: { email: "jane@example.com", storefrontUrl: origin() },
        },
      },
    ]);
  });

  it("sends the domain of the locale prefix under pl-PL", async () => {
    const { shopware, submit } = await setup({ locale: "pl-PL" });

    await submit("jan@example.com");

    expect(shopware.calls(SEND_MAIL)[0]?.params).toEqual({
      body: {
        email: "jan@example.com",
        storefrontUrl: `${origin()}/pl-PL`,
      },
    });
  });

  it.each(["jane@example.com", "nobody-registered@example.com"])(
    "confirms any accepted request for %s without saying whether the account exists",
    async (address) => {
      const { container, submit } = await setup();

      await submit(address);

      const success = query<HTMLElement>(container, SUCCESS);
      expect(success.textContent).toBe(SENT);
      expect(success.getAttribute("tabindex")).toBe("-1");
      expect(document.activeElement).toBe(success);
      expect(container.querySelector(FORM)).toBeNull();
      expect(
        query(container, '[data-testid="account-recover-password-back-link"]')
          .textContent,
      ).toBe("Back to sign in");
    },
  );

  it("goes back to the form with the address kept on Send again", async () => {
    const { shopware, container, email, submit } = await setup();
    await submit("jane@example.com");

    await interact(() => query<HTMLButtonElement>(container, RESEND).click());

    expect(container.querySelector(SUCCESS)).toBeNull();
    expect(email().value).toBe("jane@example.com");
    expect(document.activeElement).toBe(email());
    expect(shopware.calls(SEND_MAIL)).toHaveLength(1);

    await submit();

    expect(shopware.calls(SEND_MAIL)).toHaveLength(2);
  });

  it("sends once when the form is submitted twice", async () => {
    const answer = deferred<unknown>();
    const { shopware, container, submit } = await setup({
      answer: () => answer.promise,
    });
    await submit("jane@example.com");
    const button = query<HTMLButtonElement>(
      container,
      '[data-testid="account-recover-password-submit-button"]',
    );
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.disabled).toBe(false);

    await submit();
    await interact(() => answer.resolve({ success: true }));

    expect(shopware.calls(SEND_MAIL)).toHaveLength(1);
    expect(container.querySelector(SUCCESS)).not.toBeNull();
  });

  it("tells a throttled shopper how long to wait", async () => {
    const { alert, submit } = await setup({
      answer: () => {
        throw apiClientError(
          [
            {
              code: "FRAMEWORK__RATE_LIMIT_EXCEEDED",
              status: "429",
              meta: { parameters: { seconds: 27 } },
            } as never,
          ],
          429,
        );
      },
    });

    await submit("jane@example.com");

    expect(alert()?.textContent).toBe(
      "Too many requests. Please wait 27 seconds before trying again.",
    );
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("puts an address the backend rejects on the field", async () => {
    const { email, alert, fieldError, submit } = await setup({
      answer: () => {
        throw apiClientError([
          violation("VIOLATION::INVALID_FORMAT_ERROR", "/email"),
        ]);
      },
    });

    await submit("jane@example.com");

    expect(fieldError()?.textContent).toBe(
      "Value is not a valid email address",
    );
    expect(document.activeElement).toBe(email());
    expect(alert()).toBeNull();

    await interact(() => setInputValue(email(), "jane@example.org"));

    expect(fieldError()).toBeNull();
  });

  it("shows the default message for a rejected storefront URL and logs it without the address", async () => {
    const { alert, submit } = await setup({
      answer: () => {
        throw apiClientError([
          violation(
            "VIOLATION::NO_SUCH_CHOICE_ERROR",
            "/storefrontUrl",
            {},
            "The value you selected is not a valid choice.",
          ),
        ]);
      },
    });

    await submit("jane@example.com");

    expect(alert()?.textContent).toBe(MESSAGE_DEFAULT);
    expect(consoleError).toHaveBeenCalledWith(
      "[Recovery] sending the recovery mail failed",
      { status: 400, codes: ["VIOLATION::NO_SUCH_CHOICE_ERROR"] },
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      "jane@example.com",
    );
  });

  it("shows the default message when the client cannot be created", async () => {
    const { alert, submit, retrySession } = await setup({
      getClient: async () => {
        throw new Error("[Shopware] config unavailable");
      },
    });

    await submit("jane@example.com");

    expect(alert()?.textContent).toBe(MESSAGE_DEFAULT);
    expect(retrySession).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      "[Recovery] sending the recovery mail failed",
      { name: "Error" },
    );
  });

  it("clears the form message as soon as the next attempt starts", async () => {
    const retried = deferred<unknown>();
    let fail = true;
    const { alert, container, email, submit } = await setup({
      answer: () => {
        if (fail) throw apiClientError([], 503);
        return retried.promise;
      },
    });
    await submit("jane@example.com");
    expect(alert()?.textContent).toBe(MESSAGE_DEFAULT);

    await interact(() => setInputValue(email(), "jane@example.org"));
    expect(alert()?.textContent).toBe(MESSAGE_DEFAULT);

    fail = false;
    await submit();

    expect(alert()).toBeNull();
    expect(container.querySelector(SUCCESS)).toBeNull();

    await interact(() => retried.resolve({ success: true }));

    expect(queryAll(container, SUCCESS)).toHaveLength(1);
  });
});
