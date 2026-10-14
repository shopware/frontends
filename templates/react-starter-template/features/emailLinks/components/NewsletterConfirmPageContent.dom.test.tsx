import { StrictMode, act, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "#shopware";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  ShopwareClientHarness,
  apiError,
  deferred,
} from "@/features/checkout/checkoutTestDoubles";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { newsletterConfirmations } from "../confirmOnce";
import { NewsletterConfirmPageContent } from "./NewsletterConfirmPageContent";

const CONFIRM_NEWSLETTER = "confirmNewsletter post /newsletter/confirm";
const EM = "5d41402abc4b2a76b9719d911017c592aa5d0123";
const HASH = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";
const LINK_URL = `/newsletter-subscribe?em=${EM}&hash=${HASH}`;
const DEFAULT_MESSAGE =
  "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.";

let mounted: Mounted | undefined;

beforeEach(() => {
  window.history.replaceState(null, "", LINK_URL);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  newsletterConfirmations.clear();
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

function statusViolation(value: string) {
  return apiError(
    [
      {
        code: "VIOLATION::NOT_EQUAL_ERROR",
        source: { pointer: "/status" },
        meta: { parameters: { "{{ value }}": `"${value}"` } },
      },
    ],
    400,
  );
}

async function setup({
  answer = () => ({ success: true }),
  strict = false,
  locale = "en-GB",
}: {
  answer?: FakeAnswer;
  strict?: boolean;
  locale?: Locale;
} = {}) {
  const shopware = fakeClient(answer);
  const node = withI18n(
    <ShopwareClientHarness client={shopware.client}>
      <NewsletterConfirmPageContent />
    </ShopwareClientHarness>,
    locale,
  );
  mounted = await mount(strict ? <StrictMode>{node}</StrictMode> : node);
  return { container: mounted.container, shopware };
}

function status(container: HTMLElement): HTMLOutputElement {
  return query<HTMLOutputElement>(
    container,
    '[data-testid="email-link-status"]',
  );
}

function testIds(container: HTMLElement): string[] {
  return queryAll(container, '[data-testid^="email-link-"]').map(
    (element) => element.getAttribute("data-testid") ?? "",
  );
}

function RejectingClient({ children }: { children: ReactNode }) {
  const [getClient] = useState(() => async (): Promise<ApiClient> => {
    throw new Error("config unavailable");
  });
  return (
    <ShopwareClientProvider getClient={getClient}>
      {children}
    </ShopwareClientProvider>
  );
}

describe("NewsletterConfirmPageContent", () => {
  it("confirms the subscription with one request under StrictMode", async () => {
    const { container, shopware } = await setup({ strict: true });

    expect(shopware.invocations).toEqual([
      {
        operation: CONFIRM_NEWSLETTER,
        params: { body: { em: EM, hash: HASH } },
      },
    ]);
    expect(query(container, "h1").textContent).toBe("Newsletter subscription");
    expect(status(container).dataset.state).toBe("success");
    expect(status(container).textContent).toBe(
      "Thank you! We have signed up your address.Your newsletter subscription has been confirmed. You will now receive our latest updates and offers.",
    );
    expect(testIds(container)).toEqual([
      "email-link-status",
      "email-link-home-link",
    ]);
    expect(
      query(container, '[data-testid="email-link-home-link"]').getAttribute(
        "href",
      ),
    ).toBe("/");
  });

  it("shows the pending state until the backend answers", async () => {
    const answer = deferred<unknown>();
    const { container } = await setup({ answer: () => answer.promise });

    expect(status(container).dataset.state).toBe("pending");
    expect(status(container).getAttribute("aria-busy")).toBe("true");
    expect(status(container).textContent).toBe(
      "Confirming your newsletter subscription...",
    );
    expect(testIds(container)).toEqual(["email-link-status"]);

    await act(async () => {
      answer.resolve({ success: true });
    });

    expect(status(container).dataset.state).toBe("success");
    expect(status(container).hasAttribute("aria-busy")).toBe(false);
  });

  it("presents a link that was already used as a confirmed subscription", async () => {
    const { container } = await setup({
      answer: () => {
        throw statusViolation("optIn");
      },
    });

    expect(status(container).dataset.state).toBe("info");
    expect(status(container).textContent).toBe(
      "Your newsletter subscription has already been confirmed.",
    );
    expect(testIds(container)).toEqual([
      "email-link-status",
      "email-link-home-link",
    ]);
  });

  it("explains an invalid link", async () => {
    const { container } = await setup({
      answer: () => {
        throw apiError(
          [
            {
              code: "CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND",
              detail: `The NewsletterRecipient with the identifier "hash" - ${HASH} was not found.`,
            },
          ],
          400,
        );
      },
    });

    expect(status(container).dataset.state).toBe("error");
    expect(status(container).textContent).toBe(
      "This confirmation link is invalid. Please subscribe again to receive a new one.",
    );
    expect(container.textContent).not.toContain(HASH);
  });

  it("makes no request for a link without its parameters", async () => {
    window.history.replaceState(null, "", `/newsletter-subscribe?hash=${HASH}`);

    const { container, shopware } = await setup();

    expect(shopware.invocations).toEqual([]);
    expect(status(container).textContent).toBe(
      "This confirmation link is invalid. Please subscribe again to receive a new one.",
    );
  });

  it("offers a retry after a failure that sends the request again", async () => {
    let calls = 0;
    const { container, shopware } = await setup({
      answer: () => {
        calls += 1;
        if (calls === 1) throw apiError([{ code: "FRAMEWORK__ERROR" }], 503);
        return { success: true };
      },
    });

    expect(status(container).textContent).toBe(DEFAULT_MESSAGE);
    expect(testIds(container)).toEqual([
      "email-link-status",
      "email-link-retry-button",
      "email-link-home-link",
    ]);

    const retry = query<HTMLButtonElement>(
      container,
      '[data-testid="email-link-retry-button"]',
    );
    retry.focus();
    await interact(() => retry.click());

    expect(shopware.calls(CONFIRM_NEWSLETTER)).toHaveLength(2);
    expect(status(container).dataset.state).toBe("success");
    expect(document.activeElement).toBe(query(container, "h1"));
  });

  it("announces a retry and a repeated failure in the status", async () => {
    const again = deferred<unknown>();
    let calls = 0;
    const { container, shopware } = await setup({
      answer: () => {
        calls += 1;
        if (calls === 1) throw apiError([{ code: "FRAMEWORK__ERROR" }], 503);
        return again.promise;
      },
    });
    const output = status(container);

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="email-link-retry-button"]',
      ).click(),
    );

    expect(shopware.calls(CONFIRM_NEWSLETTER)).toHaveLength(2);
    expect(output.dataset.state).toBe("pending");
    expect(output.textContent).toBe(
      "Confirming your newsletter subscription...",
    );

    await act(async () => {
      again.reject(apiError([{ code: "FRAMEWORK__ERROR" }], 503));
    });

    expect(output.dataset.state).toBe("error");
    expect(output.textContent).toBe(DEFAULT_MESSAGE);
    expect(testIds(container)).toEqual([
      "email-link-status",
      "email-link-retry-button",
      "email-link-home-link",
    ]);
  });

  it("fails and offers a retry while the client cannot be created", async () => {
    mounted = await mount(
      withI18n(
        <RejectingClient>
          <NewsletterConfirmPageContent />
        </RejectingClient>,
      ),
    );

    expect(status(mounted.container).textContent).toBe(DEFAULT_MESSAGE);
    expect(
      queryAll(mounted.container, '[data-testid="email-link-retry-button"]'),
    ).toHaveLength(1);
  });

  it("speaks German", async () => {
    const { container } = await setup({ locale: "de-DE" });

    expect(query(container, "h1").textContent).toBe("Newsletter-Anmeldung");
    expect(
      query(container, '[data-testid="email-link-home-link"]').getAttribute(
        "href",
      ),
    ).toBe("/de-DE");
  });
});
