import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  cartView,
  fakeCart,
  lineItem,
} from "@/features/cart/components/cartView.fixture";
import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import type { StorefrontSession } from "@/features/session/types";
import { renderToHtml } from "@/test/render";

import { HeaderBar } from "./HeaderBar";

const push = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("@/features/cart/components/cartView.fixture"))
    .useFakeCart,
}));

const actions = { notify: vi.fn() };

beforeEach(() => {
  fakeCart.set(cartView({ status: "loading" }));
});

function render(session?: StorefrontSession, menu: ReactNode = null) {
  const bar = (
    <CmsActionsProvider actions={actions}>
      <HeaderBar menu={menu} />
    </CmsActionsProvider>
  );
  return renderToHtml(
    session ? <SessionProvider session={session}>{bar}</SessionProvider> : bar,
  );
}

function buttonWithTestId(html: string, testId: string): string {
  const match = html.match(
    new RegExp(`<button[^>]*data-testid="${testId}"[^>]*>`),
  );
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

describe("HeaderBar", () => {
  it("renders the logo, the search input and the mocked controls", async () => {
    const html = await render();

    expect(html).toMatch(/<a[^>]*href="\/"[^>]*>/);
    expect(html).toContain('alt="Shopware Frontends Demo Store"');
    expect(html).toContain('data-testid="header-search-input"');

    const account = buttonWithTestId(html, "header-account-button");
    expect(account).toContain('data-logged-in="false"');
    expect(account).toContain('aria-label="My Account"');
    expect(account).toContain('type="button"');
    expect(account).not.toContain("aria-expanded");
    expect(account).not.toContain("aria-controls");

    const wishlist = buttonWithTestId(html, "header-wishlist-button");
    expect(wishlist).toContain('aria-label="Wishlist"');

    const cart = buttonWithTestId(html, "header-mini-cart-button");
    expect(cart).toContain('aria-label="Cart"');
    expect(cart).toContain('aria-expanded="false"');
    const controls = cart.match(/aria-controls="([^"]+)"/)?.[1];
    expect(controls).toBeTruthy();
    expect(html).not.toContain(`id="${controls}"`);
    expect(html).not.toContain("mini-cart-container");

    expect(html).toContain('aria-label="Search"');
    expect(html).not.toContain("bg-states-error");
  });

  it("does not navigate or notify while rendering", async () => {
    await render();

    expect(push).not.toHaveBeenCalled();
    expect(actions.notify).not.toHaveBeenCalled();
  });

  it("gives every action button the same round hit area", async () => {
    const html = await render();
    const buttons = html.match(/<button[^>]*>/g) ?? [];

    expect(buttons).toHaveLength(4);
    for (const button of buttons) {
      expect(button).toContain("rounded-full p-2");
    }
  });

  it("renders the menu node it is given after the cart button", async () => {
    const html = await render(
      undefined,
      <span data-testid="menu-slot">menu</span>,
    );

    expect(html).toContain('<span data-testid="menu-slot">menu</span>');
    expect(html.indexOf("header-mini-cart-button")).toBeLessThan(
      html.indexOf("menu-slot"),
    );
  });

  it("shows the wishlist counter from the session and the cart counter from the cart", async () => {
    fakeCart.set(cartView({ lineItems: [lineItem({ quantity: 2 })] }));
    const html = await render({
      ...anonymousSession,
      status: "ready",
      isLoggedIn: true,
      customerName: "Jane Doe",
      wishlistCount: 3,
    });

    const account = buttonWithTestId(html, "header-account-button");
    expect(account).toContain('data-logged-in="true"');
    expect(html.match(/bg-states-error/g)).toHaveLength(2);
    expect(html).toMatch(/bg-states-error[^>]*>3<\/span>/);
    expect(html).toMatch(/bg-states-error[^>]*>2<\/span>/);
  });

  it("renders a closed account disclosure for a logged-in customer", async () => {
    const html = await render({
      ...anonymousSession,
      status: "ready",
      isLoggedIn: true,
      customerName: "Jane Doe",
    });

    const account = buttonWithTestId(html, "header-account-button");
    expect(account).toContain('aria-expanded="false"');
    const controls = account.match(/aria-controls="([^"]+)"/)?.[1];
    expect(controls).toBeTruthy();
    expect(html).not.toContain(`id="${controls}"`);
    expect(html).not.toContain("Signed in as");
    expect(html).not.toContain(">Logout<");
    expect(html).not.toContain("aria-haspopup");
  });

  it("hides the wishlist counter for guests", async () => {
    fakeCart.set(cartView({ lineItems: [lineItem({ quantity: 1 })] }));
    const html = await render({
      ...anonymousSession,
      status: "ready",
      wishlistCount: 4,
    });

    expect(html.match(/bg-states-error/g)).toHaveLength(1);
    expect(html).toMatch(/bg-states-error[^>]*>1<\/span>/);
  });

  it("shows the count useCart reports, not the number of line items", async () => {
    fakeCart.set(cartView({ lineItems: [lineItem()], count: 5 }));
    const html = await render({ ...anonymousSession, status: "ready" });

    expect(html.match(/bg-states-error/g)).toHaveLength(1);
    expect(html).toMatch(/bg-states-error[^>]*>5<\/span>/);
  });

  it("hides the cart counter while the count is 0", async () => {
    fakeCart.set(
      cartView({
        lineItems: [lineItem({ type: "promotion", good: false })],
        count: 0,
      }),
    );
    const html = await render({ ...anonymousSession, status: "ready" });

    expect(html).not.toContain("bg-states-error");
  });
});
