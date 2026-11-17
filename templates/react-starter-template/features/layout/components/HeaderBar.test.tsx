import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { NotifyProvider } from "@/components/NotifyContext";
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

const notify = vi.fn();

function render(session?: StorefrontSession, menu: ReactNode = null) {
  const bar = (
    <NotifyProvider notify={notify}>
      <HeaderBar menu={menu} />
    </NotifyProvider>
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

    expect(html).toContain('aria-label="Search"');
    expect(html).not.toContain("-counter");
  });

  it("does not navigate or notify while rendering", async () => {
    await render();

    expect(push).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
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

  it("shows the counters and the logged-in flag from the session", async () => {
    const html = await render({
      ...anonymousSession,
      status: "ready",
      isLoggedIn: true,
      customerName: "Jane Doe",
      cartCount: 2,
      wishlistCount: 3,
    });

    const account = buttonWithTestId(html, "header-account-button");
    expect(account).toContain('data-logged-in="true"');
    expect(html).toMatch(
      /data-testid="header-wishlist-counter"[^>]*>3<\/span>/,
    );
    expect(html).toMatch(/data-testid="header-cart-counter"[^>]*>2<\/span>/);
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
    const html = await render({
      ...anonymousSession,
      status: "ready",
      cartCount: 1,
      wishlistCount: 4,
    });

    expect(html).not.toContain("header-wishlist-counter");
    expect(html).toMatch(/data-testid="header-cart-counter"[^>]*>1<\/span>/);
  });
});
