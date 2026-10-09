import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import type { StorefrontSession } from "@/features/session/types";
import {
  interact,
  mount,
  query,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { LoggedInRedirect } from "./LoggedInRedirect";
import { LoginForm } from "./LoginForm";

const { push, replace } = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

const guest: StorefrontSession = { ...anonymousSession, status: "ready" };

const customer: StorefrontSession = {
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

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  replace.mockReset();
  window.history.replaceState(null, "", "/account/login");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(initial: StorefrontSession, children: ReactNode = null) {
  mounted = await mount(
    <ControlledSession initial={initial}>
      <LoggedInRedirect />
      {children}
    </ControlledSession>,
  );
  return mounted.container;
}

describe("LoggedInRedirect", () => {
  it("renders nothing", async () => {
    const container = await setup(guest);

    expect(container.innerHTML).toBe("");
  });

  it("sends a customer who arrives logged in to the redirect target", async () => {
    window.history.replaceState(
      null,
      "",
      "/account/login?redirect=%2FClothing%2FMen%2F%3Fp%3D2",
    );

    await setup(customer);

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/Clothing/Men/?p=2");
    expect(push).not.toHaveBeenCalled();
  });

  it("falls back to the home page without a usable redirect", async () => {
    await setup(customer);
    expect(replace).toHaveBeenLastCalledWith("/");

    await mounted?.unmount();
    mounted = undefined;
    replace.mockReset();
    window.history.replaceState(
      null,
      "",
      "/account/login?redirect=https%3A%2F%2Fexample.com",
    );

    await setup(customer);
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("waits for the session to load before deciding", async () => {
    await setup(anonymousSession);
    expect(replace).not.toHaveBeenCalled();

    await interact(() => sessionControl.set?.(customer));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/");

    await interact(() =>
      sessionControl.set?.({ ...customer, customerName: "Jane Smith" }),
    );
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it("leaves a guest on the page and ignores a later login", async () => {
    await setup(anonymousSession);
    await interact(() => sessionControl.set?.(guest));
    await interact(() => sessionControl.set?.(customer));

    expect(replace).not.toHaveBeenCalled();
  });

  it("does not redirect when the session failed to load", async () => {
    await setup({ ...anonymousSession, status: "error" });
    await interact(() => sessionControl.set?.(customer));

    expect(replace).not.toHaveBeenCalled();
  });

  it("lets the login form navigate once after a login on the page", async () => {
    window.history.replaceState(
      null,
      "",
      "/account/login?redirect=%2FFurniture%2F",
    );
    const login = vi.fn<SessionActions["login"]>(async () => {
      sessionControl.set?.(customer);
      return { ok: true };
    });
    const notify = vi.fn();
    const container = await setup(
      guest,
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={{ login }}>
          <LoginForm hideSignUp />
        </SessionActionsProvider>
      </CmsActionsProvider>,
    );

    await interact(() =>
      setInputValue(
        query<HTMLInputElement>(container, '[data-testid="login-email-input"]'),
        "jane@example.com",
      ),
    );
    await interact(() =>
      setInputValue(
        query<HTMLInputElement>(
          container,
          '[data-testid="login-password-input"]',
        ),
        "secret",
      ),
    );
    await interact(() =>
      submitForm(
        query<HTMLFormElement>(container, '[data-testid="login-form"]'),
      ),
    );

    expect(login).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/Furniture/");
    expect(replace).not.toHaveBeenCalled();
  });
});
