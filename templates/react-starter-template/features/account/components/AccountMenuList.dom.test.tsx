import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import type { SessionActionResult } from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { AccountMenuList } from "./AccountMenuList";

const { push, route } = vi.hoisted(() => ({
  push: vi.fn(),
  route: { pathname: "/account" },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => route.pathname,
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  route.pathname = "/account";
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(
  actions: Partial<SessionActions> = {},
  locale: Locale = "en-GB",
) {
  const notify = vi.fn();
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={actions}>
          <AccountMenuList />
        </SessionActionsProvider>
      </CmsActionsProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  return {
    container,
    notify,
    links: () => queryAll<HTMLAnchorElement>(container, "li a"),
    logoutButton: () => query<HTMLButtonElement>(container, "li button"),
    current: () =>
      queryAll<HTMLAnchorElement>(container, 'a[aria-current="page"]').map(
        (link) => link.getAttribute("href"),
      ),
  };
}

describe("AccountMenuList", () => {
  it("lists the account pages and the logout button", async () => {
    const { links, logoutButton } = await setup();

    expect(
      links().map((link) => [link.getAttribute("href"), link.textContent]),
    ).toEqual([
      ["/account", "Overview"],
      ["/account/profile", "Your profile"],
      ["/account/address", "Addresses"],
      ["/account/order", "Orders"],
    ]);
    expect(logoutButton().textContent).toBe("Logout");
    expect(logoutButton().type).toBe("button");
  });

  it.each([
    ["/account", ["/account"]],
    ["/account/", ["/account"]],
    ["/account/address", ["/account/address"]],
    ["/account/order", ["/account/order"]],
    ["/account/profile/change-email", []],
    ["/account/order/details/order-1", []],
  ])("marks the link of %s as the current page", async (pathname, current) => {
    route.pathname = pathname;
    const { current: currentLinks } = await setup();

    expect(currentLinks()).toEqual(current);
  });

  it("logs out once and goes home", async () => {
    const request = deferred<SessionActionResult>();
    const logout = vi.fn<SessionActions["logout"]>(() => request.promise);
    const { logoutButton, notify } = await setup({ logout });

    await interact(() => logoutButton().click());

    expect(logout).toHaveBeenCalledTimes(1);
    expect(logoutButton().getAttribute("aria-busy")).toBe("true");
    expect(logoutButton().getAttribute("aria-disabled")).toBe("true");

    await interact(() => logoutButton().click());
    expect(logout).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();

    await interact(() => request.resolve({ ok: true }));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/");
    expect(notify).not.toHaveBeenCalled();
    expect(logoutButton().getAttribute("aria-busy")).toBe("false");
    expect(logoutButton().hasAttribute("aria-disabled")).toBe(false);
  });

  it("stays on the page without a second toast when the logout fails", async () => {
    const logout = vi.fn<SessionActions["logout"]>(async () => ({
      ok: false,
      message: "Logout failed",
    }));
    const { logoutButton, notify } = await setup({ logout });

    await interact(() => logoutButton().click());

    expect(logout).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(logoutButton().getAttribute("aria-busy")).toBe("false");
  });

  it("shows an error toast when the logout throws", async () => {
    const logout = vi.fn<SessionActions["logout"]>(async () => {
      throw new Error("Network down");
    });
    const { logoutButton, notify } = await setup({ logout });

    await interact(() => logoutButton().click());

    expect(push).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "Network down",
    });
  });
});

describe("AccountMenuList in Polish", () => {
  it("lists prefixed Polish links and marks the current prefixed page", async () => {
    route.pathname = "/pl-PL/account/address";

    const { links, logoutButton, current } = await setup({}, "pl-PL");

    expect(
      links().map((link) => [link.getAttribute("href"), link.textContent]),
    ).toEqual([
      ["/pl-PL/account", "Przegląd"],
      ["/pl-PL/account/profile", "Twoje konto"],
      ["/pl-PL/account/address", "Adresy"],
      ["/pl-PL/account/order", "Zamówienia"],
    ]);
    expect(current()).toEqual(["/pl-PL/account/address"]);
    expect(logoutButton().textContent).toBe("Wyloguj");
  });

  it("goes to the Polish home page after logging out", async () => {
    route.pathname = "/pl-PL/account";
    const { logoutButton } = await setup(
      { logout: vi.fn(async () => ({ ok: true })) },
      "pl-PL",
    );

    await interact(() => logoutButton().click());

    expect(push).toHaveBeenCalledExactlyOnceWith("/pl-PL");
  });
});
