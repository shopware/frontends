import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type { CmsNotification } from "@shopware/cms-base-layer-react/client";
import { Activity, StrictMode, act } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cartResult,
  deferred,
  fakeCart,
} from "@/features/checkout/checkoutTestDoubles";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import type { RegistrationConfirmResult } from "@/features/session/registrationConfirm";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { registrationConfirmations } from "../confirmOnce";
import { RegistrationConfirmPageContent } from "./RegistrationConfirmPageContent";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace, refresh: vi.fn() }),
}));

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("@/features/checkout/checkoutTestDoubles"))
    .useFakeCart,
}));

const EM = "5d41402abc4b2a76b9719d911017c592aa5d0123";
const HASH = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";
const LINK_URL = `/registration/confirm?em=${EM}&hash=${HASH}`;
const RETRY = '[data-testid="email-link-retry-button"]';
const DEFAULT_MESSAGE =
  "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.";

type Confirm = SessionActions["confirmRegistration"];

let mounted: Mounted | undefined;

beforeEach(() => {
  window.history.replaceState(null, "", LINK_URL);
  fakeCart.set(cartResult());
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  registrationConfirmations.clear();
  window.history.replaceState(null, "", "/");
  replace.mockReset();
  vi.restoreAllMocks();
});

function confirmWith(
  ...results: (RegistrationConfirmResult | Promise<RegistrationConfirmResult>)[]
) {
  return vi.fn<Confirm>(async () => {
    const next = results.shift();
    if (!next) throw new Error("Unexpected confirmation");
    return next;
  });
}

function tree({
  confirmRegistration,
  notify,
  locale,
  children = <RegistrationConfirmPageContent />,
}: {
  confirmRegistration: Confirm;
  notify: (notification: CmsNotification) => void;
  locale: Locale;
  children?: ReactNode;
}) {
  return withI18n(
    <CmsActionsProvider actions={{ notify }}>
      <SessionActionsProvider actions={{ confirmRegistration }}>
        {children}
      </SessionActionsProvider>
    </CmsActionsProvider>,
    locale,
  );
}

async function setup({
  confirmRegistration,
  strict = false,
  locale = "en-GB",
  children,
}: {
  confirmRegistration: Confirm;
  strict?: boolean;
  locale?: Locale;
  children?: ReactNode;
}) {
  const notify = vi.fn();
  const node = tree({ confirmRegistration, notify, locale, children });
  mounted = await mount(strict ? <StrictMode>{node}</StrictMode> : node);
  return { container: mounted.container, notify };
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

describe("RegistrationConfirmPageContent", () => {
  it("confirms the link exactly once under StrictMode", async () => {
    const confirmRegistration = confirmWith({
      status: "confirmed",
      guest: false,
    });

    const { notify } = await setup({ confirmRegistration, strict: true });

    expect(confirmRegistration).toHaveBeenCalledExactlyOnceWith({
      em: EM,
      hash: HASH,
    });
    expect(notify).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it("waits for the first cart read before it confirms", async () => {
    fakeCart.set(cartResult({ status: "loading" }));
    const confirmRegistration = confirmWith({
      status: "confirmed",
      guest: false,
    });

    const { container } = await setup({ confirmRegistration });

    expect(confirmRegistration).not.toHaveBeenCalled();
    expect(status(container).dataset.state).toBe("pending");
    expect(status(container).getAttribute("aria-busy")).toBe("true");

    await interact(() => fakeCart.set(cartResult({ status: "error" })));

    expect(confirmRegistration).toHaveBeenCalledTimes(1);
  });

  it("welcomes a confirmed customer with a toast and replaces the page with the home page", async () => {
    const { container, notify } = await setup({
      confirmRegistration: confirmWith({ status: "confirmed", guest: false }),
    });

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "You have been logged in successfully.",
    });
    expect(replace).toHaveBeenCalledExactlyOnceWith("/");
    expect(status(container).textContent).toBe("Verifying your account...");
    expect(testIds(container)).toEqual(["email-link-status"]);
  });

  it("stays in the locale of the page", async () => {
    const { notify } = await setup({
      confirmRegistration: confirmWith({ status: "confirmed", guest: false }),
      locale: "pl-PL",
    });

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Zostałeś pomyślnie zalogowany.",
    });
    expect(replace).toHaveBeenCalledExactlyOnceWith("/pl-PL");
  });

  it("sends a confirmed guest on to the checkout", async () => {
    const { notify } = await setup({
      confirmRegistration: confirmWith({ status: "confirmed", guest: true }),
    });

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message:
        "Thank you for confirming your email address. You can now complete your order.",
    });
    expect(replace).toHaveBeenCalledExactlyOnceWith("/checkout");
  });

  it.each<[RegistrationConfirmResult["status"], string]>([
    [
      "alreadyConfirmed",
      "Either the email address has already been confirmed or the URL is invalid.",
    ],
    [
      "invalidLink",
      "The verification link is invalid or has expired. Please request a new confirmation email.",
    ],
  ])(
    "explains a %s link and offers the login and the home page",
    async (outcome, message) => {
      const { container, notify } = await setup({
        confirmRegistration: confirmWith({
          status: outcome,
        } as RegistrationConfirmResult),
      });

      expect(status(container).dataset.state).toBe("error");
      expect(status(container).hasAttribute("aria-busy")).toBe(false);
      expect(status(container).textContent).toBe(message);
      expect(
        query(container, '[data-testid="email-link-login-link"]').getAttribute(
          "href",
        ),
      ).toBe("/account/login");
      expect(
        query(container, '[data-testid="email-link-home-link"]').getAttribute(
          "href",
        ),
      ).toBe("/");
      expect(testIds(container)).not.toContain("email-link-retry-button");
      expect(notify).not.toHaveBeenCalled();
      expect(replace).not.toHaveBeenCalled();
    },
  );

  it("treats a link without its parameters as invalid without a call and without waiting for the cart", async () => {
    window.history.replaceState(null, "", `/registration/confirm?em=${EM}`);
    fakeCart.set(cartResult({ status: "loading" }));
    const confirmRegistration = confirmWith();

    const { container } = await setup({ confirmRegistration, strict: true });

    expect(confirmRegistration).not.toHaveBeenCalled();
    expect(status(container).textContent).toBe(
      "The verification link is invalid or has expired. Please request a new confirmation email.",
    );
  });

  it("offers a retry after a failure and ignores a second click while it runs", async () => {
    const second = deferred<RegistrationConfirmResult>();
    const confirmRegistration = confirmWith(
      { status: "failed" },
      second.promise,
    );
    const { container } = await setup({ confirmRegistration });

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

    await interact(() => retry.click());
    await interact(() => retry.click());

    expect(confirmRegistration).toHaveBeenCalledTimes(2);
    expect(retry.isConnected).toBe(true);
    expect(retry.getAttribute("aria-busy")).toBe("true");
    expect(retry.getAttribute("aria-disabled")).toBe("true");

    await act(async () => {
      second.resolve({ status: "failed" });
    });

    expect(retry.hasAttribute("aria-busy")).toBe(false);
    expect(confirmRegistration).toHaveBeenCalledTimes(2);
  });

  it("announces a retry and a repeated failure in the status", async () => {
    const second = deferred<RegistrationConfirmResult>();
    const { container } = await setup({
      confirmRegistration: confirmWith({ status: "failed" }, second.promise),
    });
    const output = status(container);

    await interact(() => query<HTMLButtonElement>(container, RETRY).click());

    expect(output.dataset.state).toBe("pending");
    expect(output.textContent).toBe("Verifying your account...");
    expect(testIds(container)).toEqual([
      "email-link-status",
      "email-link-retry-button",
      "email-link-home-link",
    ]);

    await act(async () => {
      second.resolve({ status: "failed" });
    });

    expect(output.dataset.state).toBe("error");
    expect(output.textContent).toBe(DEFAULT_MESSAGE);
  });

  it("leaves the focus where the customer moved it while a retry ran", async () => {
    const second = deferred<RegistrationConfirmResult>();
    const { container } = await setup({
      confirmRegistration: confirmWith({ status: "failed" }, second.promise),
      children: (
        <>
          <RegistrationConfirmPageContent />
          <button type="button" data-testid="elsewhere">
            Elsewhere
          </button>
        </>
      ),
    });
    const retry = query<HTMLButtonElement>(container, RETRY);
    const elsewhere = query<HTMLButtonElement>(
      container,
      '[data-testid="elsewhere"]',
    );
    retry.focus();
    await interact(() => retry.click());
    await interact(() => elsewhere.focus());

    await act(async () => {
      second.resolve({ status: "alreadyConfirmed" });
    });

    expect(retry.isConnected).toBe(false);
    expect(document.activeElement).toBe(elsewhere);
  });

  it("moves the focus to the heading when a retry ends without the retry button", async () => {
    const second = deferred<RegistrationConfirmResult>();
    const { container } = await setup({
      confirmRegistration: confirmWith({ status: "failed" }, second.promise),
    });
    const retry = query<HTMLButtonElement>(
      container,
      '[data-testid="email-link-retry-button"]',
    );
    retry.focus();
    await interact(() => retry.click());

    await act(async () => {
      second.resolve({ status: "alreadyConfirmed" });
    });

    expect(document.activeElement).toBe(query(container, "h1"));
    expect(query<HTMLHeadingElement>(container, "h1").tabIndex).toBe(-1);
  });

  it("leaves the focus alone on the first result", async () => {
    const { container } = await setup({
      confirmRegistration: confirmWith({ status: "invalidLink" }),
    });

    expect(document.activeElement).not.toBe(query(container, "h1"));
  });

  it("replays the result to a remount without a second call", async () => {
    const confirmRegistration = confirmWith({ status: "alreadyConfirmed" });
    await setup({ confirmRegistration });
    await mounted?.unmount();

    const { container } = await setup({ confirmRegistration });

    expect(confirmRegistration).toHaveBeenCalledTimes(1);
    expect(status(container).dataset.state).toBe("error");
  });

  it("confirms once and welcomes once across a hidden and revealed Activity", async () => {
    const answer = deferred<RegistrationConfirmResult>();
    const confirmRegistration = confirmWith(answer.promise);
    const notify = vi.fn();
    const show = await mountInActivity({ confirmRegistration, notify });

    await show("hidden");
    await act(async () => {
      answer.resolve({ status: "confirmed", guest: false });
    });
    await show("visible");
    await show("hidden");
    await show("visible");

    expect(confirmRegistration).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it("keeps a failure on screen across a hidden and revealed Activity without calling again", async () => {
    const confirmRegistration = confirmWith({ status: "failed" });
    const show = await mountInActivity({
      confirmRegistration,
      notify: vi.fn(),
    });

    await show("hidden");
    await show("visible");

    expect(confirmRegistration).toHaveBeenCalledTimes(1);
    expect(
      queryAll(document.body, '[data-testid="email-link-retry-button"]'),
    ).toHaveLength(1);
  });
});

async function mountInActivity({
  confirmRegistration,
  notify,
}: {
  confirmRegistration: Confirm;
  notify: (notification: CmsNotification) => void;
}) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const show = (mode: "visible" | "hidden") =>
    act(async () => {
      root.render(
        tree({
          confirmRegistration,
          notify,
          locale: "en-GB",
          children: (
            <Activity mode={mode}>
              <RegistrationConfirmPageContent />
            </Activity>
          ),
        }),
      );
    });
  mounted = {
    container,
    async unmount() {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
  await show("visible");
  return show;
}
