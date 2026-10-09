import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import type {
  SessionActionResult,
  StorefrontSession,
} from "@/features/session/types";
import { interact, mount, pressKey, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { HeaderBar } from "./HeaderBar";

const { push, route } = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  let pathname = "/";
  return {
    push: vi.fn(),
    route: {
      get: () => pathname,
      set(next: string) {
        pathname = next;
        for (const listener of listeners) listener();
      },
      subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    },
  };
});

vi.mock("next/navigation", async () => {
  const { useSyncExternalStore } = await import("react");
  return {
    useRouter: () => ({ push }),
    usePathname: () =>
      useSyncExternalStore(route.subscribe, route.get, route.get),
  };
});

const ACCOUNT_BUTTON = '[data-testid="header-account-button"]';
const ACCOUNT_MENU = '[data-testid="header-account-menu"]';
const LOGOUT_BUTTON = '[data-testid="header-account-logout-button"]';

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
  route.set("/");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

async function setup(
  session?: StorefrontSession,
  actions: Partial<SessionActions> = {},
) {
  const notify = vi.fn();
  const bar = (
    <CmsActionsProvider actions={{ notify }}>
      <SessionActionsProvider actions={actions}>
        <HeaderBar menu={null} />
      </SessionActionsProvider>
    </CmsActionsProvider>
  );
  mounted = await mount(
    session ? (
      <ControlledSession initial={session}>{bar}</ControlledSession>
    ) : (
      bar
    ),
  );
  const { container } = mounted;
  return {
    container,
    notify,
    account: query<HTMLButtonElement>(container, ACCOUNT_BUTTON),
    menu: () => container.querySelector<HTMLElement>(ACCOUNT_MENU),
    logoutButton: () => query<HTMLButtonElement>(container, LOGOUT_BUTTON),
  };
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
    const { account, menu, notify } = await setup();
    window.history.replaceState(
      null,
      "",
      "/Furniture/?order=price-asc#reviews",
    );

    await interact(() => account.click());

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(
      "/account/login?redirect=%2FFurniture%2F%3Forder%3Dprice-asc%23reviews",
    );
    expect(notify).not.toHaveBeenCalled();
    expect(menu()).toBeNull();
    expect(account.hasAttribute("aria-expanded")).toBe(false);
    expect(account.hasAttribute("aria-controls")).toBe(false);
  });

  it("re-reads a failed session on the account click and opens the menu for a logged-in customer", async () => {
    const request = deferred<StorefrontSession>();
    const retrySession = vi.fn<SessionActions["retrySession"]>(
      () => request.promise,
    );
    const { account, menu } = await setup(
      { ...anonymousSession, status: "error" },
      { retrySession },
    );

    await interact(() => account.click());

    expect(retrySession).toHaveBeenCalledTimes(1);
    expect(account.getAttribute("aria-busy")).toBe("true");
    expect(account.getAttribute("aria-disabled")).toBe("true");
    expect(push).not.toHaveBeenCalled();

    await interact(() => account.click());
    expect(retrySession).toHaveBeenCalledTimes(1);

    await interact(() => {
      sessionControl.set?.(loggedIn);
      request.resolve(loggedIn);
    });

    expect(push).not.toHaveBeenCalled();
    expect(menu()?.textContent).toContain("Signed in as Jane Doe");
    expect(account.getAttribute("aria-expanded")).toBe("true");
    expect(account.hasAttribute("aria-busy")).toBe(false);
    expect(account.hasAttribute("aria-disabled")).toBe(false);
  });

  it.each([
    [
      "a guest",
      async () => {
        const guest: StorefrontSession = {
          ...anonymousSession,
          status: "ready",
        };
        sessionControl.set?.(guest);
        return guest;
      },
    ],
    [
      "a failed re-read",
      async (): Promise<StorefrontSession> => {
        throw new Error("offline");
      },
    ],
  ])(
    "sends %s to the login page after re-reading a failed session",
    async (_, retry: SessionActions["retrySession"]) => {
      const retrySession = vi.fn<SessionActions["retrySession"]>(retry);
      const { account, menu } = await setup(
        { ...anonymousSession, status: "error" },
        { retrySession },
      );
      window.history.replaceState(null, "", "/Furniture/");

      await interact(() => account.click());

      expect(retrySession).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(
        "/account/login?redirect=%2FFurniture%2F",
      );
      expect(menu()).toBeNull();
      expect(account.hasAttribute("aria-busy")).toBe(false);
    },
  );

  it("does not re-read the session for a guest whose session is ready", async () => {
    const retrySession = vi.fn<SessionActions["retrySession"]>();
    const { account } = await setup(
      { ...anonymousSession, status: "ready" },
      { retrySession },
    );

    await interact(() => account.click());

    expect(retrySession).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("toggles the account menu for a logged-in customer", async () => {
    const { account, menu, notify } = await setup(loggedIn);

    expect(account.getAttribute("data-logged-in")).toBe("true");
    expect(account.getAttribute("aria-expanded")).toBe("false");
    const controls = account.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(menu()).toBeNull();

    await interact(() => account.click());

    const panel = menu();
    expect(account.getAttribute("aria-expanded")).toBe("true");
    expect(panel?.id).toBe(controls);
    expect(panel?.textContent).toContain("Signed in as Jane Doe");
    expect(panel?.querySelectorAll("a")).toHaveLength(0);
    const logout = query<HTMLButtonElement>(panel ?? document, LOGOUT_BUTTON);
    expect(logout.textContent).toBe("Logout");
    expect(logout.type).toBe("button");
    expect(push).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();

    await interact(() => account.click());

    expect(account.getAttribute("aria-expanded")).toBe("false");
    expect(menu()).toBeNull();
  });

  it("renders replacement patterns in the customer name literally", async () => {
    const { account, menu } = await setup({
      ...loggedIn,
      customerName: "$` $& $' $$",
    });

    await interact(() => account.click());

    expect(menu()?.textContent).toContain("Signed in as $` $& $' $$");
  });

  it("leaves out the signed-in line without a customer name", async () => {
    const { account, menu } = await setup({ ...loggedIn, customerName: null });

    await interact(() => account.click());

    expect(menu()?.textContent).not.toContain("Signed in as");
    expect(menu()?.querySelector(LOGOUT_BUTTON)).not.toBeNull();
  });

  it("logs out once, goes home and closes the menu", async () => {
    const request = deferred<SessionActionResult>();
    const logout = vi.fn<SessionActions["logout"]>(() => request.promise);
    const { account, menu, logoutButton, notify } = await setup(loggedIn, {
      logout,
    });

    await interact(() => account.click());
    const button = logoutButton();
    await interact(() => button.click());

    expect(logout).toHaveBeenCalledTimes(1);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.getAttribute("aria-disabled")).toBe("true");

    await interact(() => button.click());
    expect(logout).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();

    await interact(() => {
      sessionControl.set?.({ ...anonymousSession, status: "ready" });
      request.resolve({ ok: true });
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/");
    expect(menu()).toBeNull();
    expect(account.getAttribute("data-logged-in")).toBe("false");
    expect(account.hasAttribute("aria-expanded")).toBe(false);
    expect(document.activeElement).toBe(account);
    expect(notify).not.toHaveBeenCalled();
  });

  it("keeps the menu open and adds no toast when the logout fails", async () => {
    const logout = vi.fn<SessionActions["logout"]>(async () => ({
      ok: false,
      message: "Logout failed",
    }));
    const { account, menu, logoutButton, notify } = await setup(loggedIn, {
      logout,
    });

    await interact(() => account.click());
    await interact(() => logoutButton().click());

    expect(logout).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(menu()).not.toBeNull();
    expect(logoutButton().getAttribute("aria-busy")).toBe("false");
    expect(logoutButton().hasAttribute("aria-disabled")).toBe(false);
  });

  it("closes on Escape and returns focus to the account button", async () => {
    const { account, menu, logoutButton } = await setup(loggedIn);

    await interact(() => account.click());
    logoutButton().focus();
    expect(document.activeElement).toBe(logoutButton());

    await interact(() => pressKey(document, "Escape"));

    expect(menu()).toBeNull();
    expect(account.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(account);
  });

  it("closes on Escape without taking focus from elsewhere on the page", async () => {
    const { container, account, menu } = await setup(loggedIn);
    const input = query<HTMLInputElement>(
      container,
      '[data-testid="header-search-input"]',
    );

    await interact(() => account.click());
    input.focus();
    await interact(() => pressKey(document, "Escape"));

    expect(menu()).toBeNull();
    expect(document.activeElement).toBe(input);
  });

  it("closes on a click outside but not on a click inside the menu", async () => {
    const { account, menu } = await setup(loggedIn);

    await interact(() => account.click());
    await interact(() =>
      menu()?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
    );
    expect(menu()).not.toBeNull();

    await interact(() =>
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      ),
    );
    expect(menu()).toBeNull();
    expect(account.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes from the account button instead of reopening after its mousedown", async () => {
    const { account, menu } = await setup(loggedIn);

    await interact(() => account.click());
    await interact(() => {
      account.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      account.click();
    });

    expect(menu()).toBeNull();
    expect(account.getAttribute("aria-expanded")).toBe("false");
  });

  it("stops listening once the menu is closed", async () => {
    const { account } = await setup(loggedIn);
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");

    await interact(() => account.click());
    const handlers = add.mock.calls
      .filter(([type]) => type === "mousedown" || type === "keydown")
      .map(([type, handler]) => [type, handler]);
    expect(handlers.map(([type]) => type).sort()).toEqual([
      "keydown",
      "mousedown",
    ]);

    await interact(() => account.click());

    for (const [type, handler] of handlers) {
      expect(remove).toHaveBeenCalledWith(type, handler);
    }
  });

  it("closes when the route changes", async () => {
    const { account, menu } = await setup(loggedIn);

    await interact(() => account.click());
    expect(menu()).not.toBeNull();

    await interact(() => route.set("/Clothing/"));

    expect(menu()).toBeNull();
    expect(account.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes when the customer is logged out elsewhere and stays closed after the next login", async () => {
    const { account, menu } = await setup(loggedIn);

    await interact(() => account.click());
    await interact(() =>
      sessionControl.set?.({ ...anonymousSession, status: "ready" }),
    );
    expect(menu()).toBeNull();

    await interact(() => sessionControl.set?.(loggedIn));
    expect(menu()).toBeNull();
    expect(account.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the account menu when the mobile search opens", async () => {
    const { container, account, menu } = await setup(loggedIn);

    await interact(() => account.click());
    await interact(() =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Search"]',
      ).click(),
    );
    const close = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Close",
    );
    await interact(() => close?.click());

    expect(menu()).toBeNull();
    expect(
      query<HTMLButtonElement>(container, ACCOUNT_BUTTON).getAttribute(
        "aria-expanded",
      ),
    ).toBe("false");
  });
});
