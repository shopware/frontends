import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import type { StorefrontSession } from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { AccountGuard } from "./AccountGuard";
import { useAccountLogout } from "./useAccountLogout";

const { push, replace } = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

const LOGIN_REQUIRED =
  "Login is required to access this page. You are being redirected to the login page.";
const SKELETON = '[data-testid="account-guard-skeleton"]';
const CONTENT = '[data-testid="account-content"]';

const loggedIn: StorefrontSession = {
  ...anonymousSession,
  status: "ready",
  isLoggedIn: true,
  customerName: "Jane Doe",
};
const anonymous: StorefrontSession = { ...anonymousSession, status: "ready" };
const guest: StorefrontSession = {
  ...anonymousSession,
  status: "ready",
  isGuestSession: true,
};
const failed: StorefrontSession = { ...anonymousSession, status: "error" };

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

function LogoutButton() {
  const { logout } = useAccountLogout();
  return (
    <button
      type="button"
      data-testid="logout"
      onClick={() => {
        void logout();
      }}
    >
      Logout
    </button>
  );
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
  replace.mockReset();
  window.history.replaceState(null, "", "/account/order?page=2#latest");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  window.history.replaceState(null, "", "/");
});

async function setup(
  initial: StorefrontSession,
  actions: Partial<SessionActions> = {},
  extra: ReactNode = null,
  locale: Locale = "en-GB",
) {
  const notify = vi.fn();
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={actions}>
          <ControlledSession initial={initial}>
            {extra}
            <AccountGuard>
              <p data-testid="account-content">Customer data</p>
            </AccountGuard>
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
    skeleton: () => container.querySelector<HTMLElement>(SKELETON),
    content: () => container.querySelector(CONTENT),
  };
}

const LOGIN_REDIRECT = "/account/login?redirect=%2Faccount%2Forder%3Fpage%3D2";

describe("AccountGuard", () => {
  it("shows a busy skeleton and waits while the session is loading", async () => {
    const { skeleton, content, notify } = await setup(anonymousSession);

    expect(skeleton()?.getAttribute("aria-busy")).toBe("true");
    expect(skeleton()?.querySelector("output")?.textContent).toBe("Loading...");
    expect(content()).toBeNull();
    expect(replace).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it.each([
    ["an anonymous visitor", anonymous],
    ["a guest", guest],
  ])(
    "sends %s to the login page with the current path once",
    async (_, session) => {
      const { skeleton, content, notify } = await setup(session);

      expect(replace).toHaveBeenCalledTimes(1);
      expect(replace).toHaveBeenCalledWith(LOGIN_REDIRECT);
      expect(push).not.toHaveBeenCalled();
      expect(notify).toHaveBeenCalledTimes(1);
      expect(notify).toHaveBeenCalledWith({
        type: "info",
        message: LOGIN_REQUIRED,
      });
      expect(content()).toBeNull();
      expect(skeleton()).not.toBeNull();
    },
  );

  it("decides after the session has loaded", async () => {
    const { notify } = await setup(anonymousSession);

    await interact(() => sessionControl.set?.(anonymous));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(LOGIN_REDIRECT);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("does not redirect again while the session stays logged out", async () => {
    const { notify } = await setup(anonymous);

    await interact(() => sessionControl.set?.({ ...anonymous }));
    await interact(() => sessionControl.set?.(guest));
    await interact(() => sessionControl.set?.({ ...anonymous }));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("renders the page for a logged-in customer", async () => {
    const { skeleton, content, notify } = await setup(loggedIn);

    expect(content()?.textContent).toBe("Customer data");
    expect(skeleton()).toBeNull();
    expect(replace).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("renders the page once a loading session turns out logged in", async () => {
    const { content, notify } = await setup(anonymousSession);

    await interact(() => sessionControl.set?.(loggedIn));

    expect(content()).not.toBeNull();
    expect(replace).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("keeps the page when a re-read fails but the last session was logged in", async () => {
    const retrySession = vi.fn<SessionActions["retrySession"]>();
    const { content } = await setup(loggedIn, { retrySession });

    await interact(() =>
      sessionControl.set?.({ ...loggedIn, status: "error" }),
    );

    expect(content()).not.toBeNull();
    expect(retrySession).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("re-reads a failed session and renders the page for a customer", async () => {
    const request = deferred<StorefrontSession>();
    const retrySession = vi.fn<SessionActions["retrySession"]>(
      () => request.promise,
    );
    const { content, skeleton, notify } = await setup(failed, {
      retrySession,
    });

    expect(retrySession).toHaveBeenCalledTimes(1);
    expect(skeleton()).not.toBeNull();
    expect(replace).not.toHaveBeenCalled();

    await interact(() => {
      sessionControl.set?.(loggedIn);
      request.resolve(loggedIn);
    });

    expect(content()).not.toBeNull();
    expect(replace).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("sends the visitor to the login page when the re-read finds no customer", async () => {
    const retrySession = vi.fn<SessionActions["retrySession"]>(
      async () => failed,
    );
    const { content, notify } = await setup(failed, { retrySession });

    expect(retrySession).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(LOGIN_REDIRECT);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(content()).toBeNull();
  });

  it("redirects once when the re-read settles on a logged-out session", async () => {
    const request = deferred<StorefrontSession>();
    const retrySession = vi.fn<SessionActions["retrySession"]>(
      () => request.promise,
    );
    const { notify } = await setup(failed, { retrySession });

    await interact(() => {
      sessionControl.set?.(anonymous);
      request.resolve(anonymous);
    });

    expect(replace).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("sends the customer to the login page when the session ends elsewhere", async () => {
    const { content, notify } = await setup(loggedIn);

    await interact(() => sessionControl.set?.(anonymous));

    expect(content()).toBeNull();
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(LOGIN_REDIRECT);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("leaves the navigation to a logout started on the page", async () => {
    const logout = vi.fn<SessionActions["logout"]>(async () => {
      sessionControl.set?.(anonymous);
      return { ok: true };
    });
    const { container, content, notify } = await setup(
      loggedIn,
      { logout },
      <LogoutButton />,
    );

    await interact(() =>
      container
        .querySelector<HTMLButtonElement>('[data-testid="logout"]')
        ?.click(),
    );

    expect(logout).toHaveBeenCalledTimes(1);
    expect(content()).toBeNull();
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/");
    expect(replace).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not let an earlier logout hide a later loss of the session", async () => {
    const logout = vi.fn<SessionActions["logout"]>(async () => ({ ok: true }));
    const notify = vi.fn();
    const outside = await mount(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={{ logout }}>
          <LogoutButton />
        </SessionActionsProvider>
      </CmsActionsProvider>,
    );
    await interact(() =>
      outside.container
        .querySelector<HTMLButtonElement>('[data-testid="logout"]')
        ?.click(),
    );
    await outside.unmount();
    push.mockReset();

    const guarded = await setup(loggedIn);
    await interact(() => sessionControl.set?.(anonymous));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(LOGIN_REDIRECT);
    expect(guarded.notify).toHaveBeenCalledTimes(1);
  });

  it("redirects after a failed logout lets the session end elsewhere", async () => {
    const logout = vi.fn<SessionActions["logout"]>(async () => ({
      ok: false,
      message: "Logout failed",
    }));
    const { container, content, notify } = await setup(
      loggedIn,
      { logout },
      <LogoutButton />,
    );

    await interact(() =>
      container
        .querySelector<HTMLButtonElement>('[data-testid="logout"]')
        ?.click(),
    );

    expect(content()).not.toBeNull();
    expect(push).not.toHaveBeenCalled();

    await interact(() => sessionControl.set?.(anonymous));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
  });
});

describe("AccountGuard in Polish", () => {
  it("sends the visitor to the Polish login page with the full prefixed path", async () => {
    window.history.replaceState(null, "", "/pl-PL/account/order?page=2");

    const { notify, skeleton } = await setup(anonymous, {}, null, "pl-PL");

    expect(replace).toHaveBeenCalledExactlyOnceWith(
      "/pl-PL/account/login?redirect=%2Fpl-PL%2Faccount%2Forder%3Fpage%3D2",
    );
    expect(notify).toHaveBeenCalledWith({
      type: "info",
      message:
        "Logowanie jest wymagane, aby uzyskać dostęp do tej strony. Zostaniesz przekierowany na stronę logowania.",
    });
    expect(skeleton()?.querySelector("output")?.textContent).toBe(
      "Ładowanie...",
    );
  });

  it("goes to the Polish home page after a logout started on the page", async () => {
    window.history.replaceState(null, "", "/pl-PL/account");
    const { container } = await setup(
      loggedIn,
      { logout: vi.fn(async () => ({ ok: true })) },
      <LogoutButton />,
      "pl-PL",
    );

    await interact(() =>
      container
        .querySelector<HTMLButtonElement>('[data-testid="logout"]')
        ?.click(),
    );

    expect(push).toHaveBeenCalledExactlyOnceWith("/pl-PL");
  });
});
