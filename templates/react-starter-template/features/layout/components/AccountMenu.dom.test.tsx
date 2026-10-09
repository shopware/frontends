import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { createRef, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AccountGuard } from "@/features/account/components/AccountGuard";
import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import type { StorefrontSession } from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { AccountMenu } from "./AccountMenu";

const { push, replace, route } = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  route: { pathname: "/" },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
  usePathname: () => route.pathname,
}));

const loggedIn: StorefrontSession = {
  ...anonymousSession,
  status: "ready",
  isLoggedIn: true,
  customerName: "Jane Doe",
};

const sessionControl: { set?: (session: StorefrontSession) => void } = {};

function ControlledSession({
  initial,
  children,
}: {
  initial: StorefrontSession;
  children: ReactNode;
}) {
  const [session, setSession] = useState(initial);
  useEffect(() => {
    sessionControl.set = setSession;
    return () => {
      sessionControl.set = undefined;
    };
  }, []);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

function stopNavigation(event: Event) {
  event.preventDefault();
}

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  replace.mockReset();
  route.pathname = "/";
  document.addEventListener("click", stopNavigation, { capture: true });
});

afterEach(async () => {
  document.removeEventListener("click", stopNavigation, { capture: true });
  await mounted?.unmount();
  mounted = undefined;
  window.history.replaceState(null, "", "/");
});

async function setup(
  actions: Partial<SessionActions> = {},
  page: ReactNode = null,
  locale?: Locale,
) {
  const notify = vi.fn();
  const onClose = vi.fn();
  const triggerRef = createRef<HTMLButtonElement>();
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={actions}>
          <ControlledSession initial={loggedIn}>
            <button type="button" ref={triggerRef}>
              My Account
            </button>
            <AccountMenu
              id="account-menu"
              customerName="Jane Doe"
              triggerRef={triggerRef}
              onClose={onClose}
            />
            {page}
          </ControlledSession>
        </SessionActionsProvider>
      </CmsActionsProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  return {
    container,
    notify,
    onClose,
    trigger: () => triggerRef.current,
    links: () =>
      queryAll<HTMLAnchorElement>(
        container,
        '[data-testid="header-account-menu"] a',
      ),
  };
}

describe("AccountMenu", () => {
  it("lists the account pages between the signed-in line and the logout", async () => {
    const { container, links } = await setup();
    const panel = query<HTMLElement>(
      container,
      '[data-testid="header-account-menu"]',
    );

    expect([...panel.children].map((child) => child.textContent)).toEqual([
      "Signed in as Jane Doe",
      "Overview",
      "Your profile",
      "Addresses",
      "Orders",
      "Logout",
    ]);
    expect(links().map((link) => link.getAttribute("href"))).toEqual([
      "/account",
      "/account/profile",
      "/account/address",
      "/account/order",
    ]);
    expect(links().map((link) => link.getAttribute("data-testid"))).toEqual([
      "header-my-account-link",
      null,
      null,
      null,
    ]);
    expect(links().some((link) => link.hasAttribute("aria-current"))).toBe(
      false,
    );
  });

  it("translates the menu and prefixes its links under the pl-PL provider", async () => {
    route.pathname = "/pl-PL/account/address";
    const { container, links } = await setup({}, null, "pl-PL");
    const panel = query<HTMLElement>(
      container,
      '[data-testid="header-account-menu"]',
    );

    expect([...panel.children].map((child) => child.textContent)).toEqual([
      "Zalogowano jako Jane Doe",
      "Przegląd",
      "Twoje konto",
      "Adresy",
      "Zamówienia",
      "Wyloguj",
    ]);
    expect(links().map((link) => link.getAttribute("href"))).toEqual([
      "/pl-PL/account",
      "/pl-PL/account/profile",
      "/pl-PL/account/address",
      "/pl-PL/account/order",
    ]);
    expect(
      links()
        .filter((link) => link.getAttribute("aria-current") === "page")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/pl-PL/account/address"]);
  });

  it("heads the menu with a sand strip and shows Logout in the strong accent", async () => {
    const { container } = await setup();
    const panel = query<HTMLElement>(
      container,
      '[data-testid="header-account-menu"]',
    );

    expect(panel.firstElementChild?.className).toContain("bg-shell-sand");
    expect(panel.firstElementChild?.className).toContain("text-shell-ink");
    const logout = query<HTMLButtonElement>(
      container,
      '[data-testid="header-account-logout-button"]',
    );
    expect(logout.className).toContain("text-shell-accent-strong");
    expect(logout.className).not.toContain("other-sale");
  });

  it("marks the account page that is open", async () => {
    route.pathname = "/account/address";
    const { links } = await setup();

    expect(
      links()
        .filter((link) => link.getAttribute("aria-current") === "page")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/account/address"]);
  });

  it.each([
    "/account",
    "/account/profile",
    "/account/address",
    "/account/order",
  ])("closes when the %s link is followed", async (href) => {
    const { container, onClose } = await setup();

    await interact(() =>
      query<HTMLAnchorElement>(
        container,
        `[data-testid="header-account-menu"] a[href="${href}"]`,
      ).click(),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });

  it("goes home from an account page without the login redirect", async () => {
    route.pathname = "/account/profile";
    window.history.replaceState(null, "", "/account/profile");
    const logout = vi.fn<SessionActions["logout"]>(async () => {
      sessionControl.set?.({ ...anonymousSession, status: "ready" });
      return { ok: true };
    });
    const { container, notify, onClose, trigger } = await setup(
      { logout },
      <AccountGuard>
        <p data-testid="account-content">Customer data</p>
      </AccountGuard>,
    );
    expect(
      container.querySelector('[data-testid="account-content"]'),
    ).not.toBeNull();

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="header-account-logout-button"]',
      ).click(),
    );

    expect(logout).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/");
    expect(replace).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger());
    expect(
      container.querySelector('[data-testid="account-content"]'),
    ).toBeNull();
  });
});
