import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { deferred } from "@/features/checkout/checkoutTestDoubles";
import { loadPublicConfig } from "@/features/session/browserClient";
import {
  ENGLISH_DOMAIN,
  apiClientError,
} from "@/features/session/session.fixture";
import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { ProfileHarness } from "../profile.fixture";
import { NewsletterSection } from "./NewsletterSection";

vi.mock("@/features/session/browserClient", () => ({
  loadPublicConfig: vi.fn(),
}));

const READ_STATUS =
  "readNewsletterRecipient post /account/newsletter-recipient";
const SUBSCRIBE = "subscribeToNewsletter post /newsletter/subscribe";
const UNSUBSCRIBE = "unsubscribeToNewsletter post /newsletter/unsubscribe";
const CONFIRMATION =
  "Please confirm your email address before subscribing to the newsletter.";

let mounted: Mounted | undefined;

beforeEach(() => {
  vi.mocked(loadPublicConfig).mockReset();
  vi.mocked(loadPublicConfig).mockResolvedValue({
    endpoint: "https://shop.test/store-api",
    accessToken: "access-token",
    devStorefrontUrl: null,
  });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

function statusAnswer(
  status: string,
  overrides: Record<string, FakeAnswer> = {},
): FakeAnswer {
  return (operation, params) => {
    const override = overrides[operation];
    if (override) return override(operation, params);
    if (operation === READ_STATUS) {
      return { apiAlias: "account_newsletter_recipient", status };
    }
    return { success: true };
  };
}

async function setup(answer: FakeAnswer, email = "jane@example.com") {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  mounted = await mount(
    <StrictMode>
      <ProfileHarness client={shopware.client} notify={notify} actions={{}}>
        <NewsletterSection email={email} />
      </ProfileHarness>
    </StrictMode>,
  );
  const { container } = mounted;
  return {
    shopware,
    notify,
    container,
    checkbox: query<HTMLInputElement>(container, 'input[type="checkbox"]'),
  };
}

describe("NewsletterSection in the browser", () => {
  it("labels the checkbox and keeps it disabled until the status is read", async () => {
    const read = deferred<unknown>();
    const { container, checkbox } = await setup(
      statusAnswer("optIn", { [READ_STATUS]: () => read.promise }),
    );

    expect(
      container.querySelector('label[for="newsletter-checkbox"]')?.textContent,
    ).toBe(
      "Yes, I would like to subscribe to the free Demostore newsletter. (I may unsubscribe at any time.)",
    );
    expect(checkbox.disabled).toBe(true);
    expect(checkbox.checked).toBe(false);

    await interact(() =>
      read.resolve({
        apiAlias: "account_newsletter_recipient",
        status: "optIn",
      }),
    );
    expect(checkbox.disabled).toBe(false);
    expect(checkbox.checked).toBe(true);
  });

  it("shows an opted-out customer as not subscribed", async () => {
    const { checkbox, container } = await setup(statusAnswer("optOut"));

    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(container.textContent).not.toContain(CONFIRMATION);
  });

  it("disables the checkbox and explains it while a confirmation is pending", async () => {
    const { checkbox, container } = await setup(statusAnswer("notSet"));

    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
    const message = query(container, "#newsletter-confirmation-needed");
    expect(message.textContent).toBe(CONFIRMATION);
    expect(checkbox.getAttribute("aria-describedby")).toBe(
      "newsletter-confirmation-needed",
    );
  });

  it("subscribes with the storefront url, confirms it and shows the confirmation hint from the answer", async () => {
    const request = deferred<unknown>();
    const { shopware, notify, checkbox, container } = await setup(
      statusAnswer("undefined", { [SUBSCRIBE]: () => request.promise }),
    );

    await interact(() => checkbox.click());
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);

    await interact(() => checkbox.click());
    expect(shopware.calls(SUBSCRIBE)).toHaveLength(1);
    expect(shopware.calls(SUBSCRIBE)[0]?.params).toEqual({
      body: {
        email: "jane@example.com",
        option: "subscribe",
        storefrontUrl: ENGLISH_DOMAIN,
      },
    });

    await interact(() => request.resolve({ status: "notSet", success: true }));
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Thank you! We have signed up your address.",
    });
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
    expect(container.textContent).toContain(CONFIRMATION);
  });

  it("prefers the configured dev storefront url when it is a sales channel domain", async () => {
    vi.mocked(loadPublicConfig).mockResolvedValue({
      endpoint: "https://shop.test/store-api",
      accessToken: "access-token",
      devStorefrontUrl: "https://shop.test/de",
    });
    const { shopware, checkbox } = await setup(statusAnswer("optOut"));

    await interact(() => checkbox.click());

    expect(shopware.calls(SUBSCRIBE)[0]?.params).toMatchObject({
      body: { storefrontUrl: "https://shop.test/de" },
    });
  });

  it("unsubscribes a subscriber and confirms it", async () => {
    const { shopware, notify, checkbox } = await setup(statusAnswer("optIn"));

    await interact(() => checkbox.click());

    expect(shopware.calls(UNSUBSCRIBE)).toEqual([
      {
        operation: UNSUBSCRIBE,
        params: { body: { email: "jane@example.com" } },
      },
    ]);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Newsletter unsubscribe",
    });
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
  });

  it("shows the API error and restores the checkbox when the change fails", async () => {
    const { notify, checkbox } = await setup(
      statusAnswer("optOut", {
        [SUBSCRIBE]: () => {
          throw apiClientError([{ code: "UNKNOWN", detail: "Mailer down" }]);
        },
      }),
    );

    await interact(() => checkbox.click());

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "Mailer down",
    });
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
  });

  it("logs a failed status read and lets the customer subscribe", async () => {
    const failure = new Error("offline");
    const { checkbox, notify } = await setup(
      statusAnswer("optIn", {
        [READ_STATUS]: () => {
          throw failure;
        },
      }),
    );

    expect(console.error).toHaveBeenCalledWith(
      "[Account] reading the newsletter status failed",
      failure,
    );
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    expect(notify).not.toHaveBeenCalled();
  });
});
