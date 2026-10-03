import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SessionProvider } from "@/features/session/components/SessionProvider";
import type { StorefrontSession } from "@/features/session/types";
import { NOT_WIRED_MESSAGES } from "@/features/storefront/notWired";
import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { HeaderBar } from "./HeaderBar";

const push = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const ACCOUNT_BUTTON = '[data-testid="header-account-button"]';

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  push.mockReset();
  window.history.replaceState(null, "", "/");
});

async function setup(session?: StorefrontSession) {
  const notify = vi.fn();
  const bar = (
    <CmsActionsProvider actions={{ notify }}>
      <HeaderBar menu={null} />
    </CmsActionsProvider>
  );
  mounted = await mount(
    session ? <SessionProvider session={session}>{bar}</SessionProvider> : bar,
  );
  return { container: mounted.container, notify };
}

describe("HeaderBar in the browser", () => {
  it("focuses the search input when the mobile search opens", async () => {
    const { container } = await setup();

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Search"]',
      ).click(),
    );

    const input = query<HTMLInputElement>(
      container,
      '[data-testid="header-search-input"]',
    );
    expect(document.activeElement).toBe(input);
    expect(container.querySelector('button[aria-label="Search"]')).toBeNull();
  });

  it("returns focus to the search button when the mobile search closes", async () => {
    const { container } = await setup();

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Search"]',
      ).click(),
    );
    const close = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Close",
    );
    expect(close).toBeDefined();

    await interact(() => close?.click());

    const search = query<HTMLButtonElement>(
      container,
      'button[aria-label="Search"]',
    );
    expect(document.activeElement).toBe(search);
    expect(
      [...container.querySelectorAll("button")].some(
        (button) => button.textContent === "Close",
      ),
    ).toBe(false);
  });

  it("sends a guest to the login page with the current path as redirect", async () => {
    const { container, notify } = await setup();
    window.history.replaceState(
      null,
      "",
      "/Furniture/?order=price-asc#reviews",
    );

    await interact(() =>
      query<HTMLButtonElement>(container, ACCOUNT_BUTTON).click(),
    );

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(
      "/account/login?redirect=%2FFurniture%2F%3Forder%3Dprice-asc%23reviews",
    );
    expect(notify).not.toHaveBeenCalled();
  });

  it("only reports the missing account menu to a logged-in customer", async () => {
    const { container, notify } = await setup({
      isLoggedIn: true,
      customerName: "Jane Doe",
      cartCount: 0,
      wishlistCount: 0,
    });

    await interact(() =>
      query<HTMLButtonElement>(container, ACCOUNT_BUTTON).click(),
    );

    expect(push).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "info",
      message: NOT_WIRED_MESSAGES.account,
    });
  });
});
