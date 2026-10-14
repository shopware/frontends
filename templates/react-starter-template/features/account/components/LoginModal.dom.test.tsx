import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActionResult } from "@/features/session/types";
import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  pressKey,
  query,
  queryAll,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { LoginModal, LoginModalProvider, useRequestLogin } from "./LoginModal";

const { push, route } = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  let pathname = "/Furniture/";
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

const DIALOG = "dialog";

let mounted: Mounted | undefined;
const notify = vi.fn();
const login = vi.fn<() => Promise<SessionActionResult>>();
const results: boolean[] = [];

function Requester() {
  const requestLogin = useRequestLogin();
  return (
    <button
      type="button"
      data-testid="request-login"
      onClick={() => {
        void requestLogin().then((loggedIn) => results.push(loggedIn));
      }}
    >
      request
    </button>
  );
}

beforeEach(() => {
  results.length = 0;
  notify.mockReset();
  push.mockReset();
  login.mockReset();
  login.mockResolvedValue({ ok: true });
  route.set("/Furniture/");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup() {
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={{ login }}>
          <LoginModalProvider>
            <Requester />
            <LoginModal />
          </LoginModalProvider>
        </SessionActionsProvider>
      </CmsActionsProvider>,
    ),
  );
  const { container } = mounted;
  const request = () =>
    interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="request-login"]',
      ).click(),
    );
  return { request };
}

function dialog(): HTMLDialogElement | null {
  return document.body.querySelector<HTMLDialogElement>(DIALOG);
}

async function fillAndSubmit(): Promise<void> {
  const panel = dialog() as HTMLDialogElement;
  await interact(() => {
    setInputValue(
      query<HTMLInputElement>(panel, '[data-testid="login-email-input"]'),
      "jane@example.com",
    );
    setInputValue(
      query<HTMLInputElement>(panel, '[data-testid="login-password-input"]'),
      "secret-password",
    );
  });
  await interact(() =>
    submitForm(query<HTMLFormElement>(panel, '[data-testid="login-form"]')),
  );
}

describe("LoginModal", () => {
  it("stays closed until a login is requested", async () => {
    await setup();

    expect(dialog()).toBeNull();
  });

  it("opens the login form under the modal title without a second heading", async () => {
    const { request } = await setup();

    await request();

    const panel = dialog() as HTMLDialogElement;
    expect(query(panel, "h2").textContent).toBe("Sign in to your account");
    expect(queryAll(panel, "h1")).toHaveLength(0);
    expect(query(panel, '[data-testid="login-form"]')).toBeTruthy();
    expect(panel.getAttribute("aria-modal")).toBe("true");
  });

  it("resolves the request after a login without navigating", async () => {
    const { request } = await setup();
    await request();

    await fillAndSubmit();

    await vi.waitFor(() => expect(results).toEqual([true]));
    expect(login).toHaveBeenCalledWith({
      username: "jane@example.com",
      password: "secret-password",
    });
    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "You have been logged in successfully.",
    });
    expect(push).not.toHaveBeenCalled();
    expect(dialog()).toBeNull();
  });

  it("keeps the modal open after a failed login", async () => {
    login.mockResolvedValue({ ok: false, message: "Wrong password" });
    const { request } = await setup();
    await request();

    await fillAndSubmit();
    await vi.waitFor(() => expect(login).toHaveBeenCalledTimes(1));

    expect(results).toEqual([]);
    expect(dialog()).not.toBeNull();
  });

  it("resolves the request as not logged in when the close button is used", async () => {
    const { request } = await setup();
    await request();

    const close = queryAll<HTMLButtonElement>(
      dialog() as HTMLDialogElement,
      "button",
    ).find((button) => button.textContent === "Close");
    await interact(() => close?.click());

    expect(results).toEqual([false]);
    expect(dialog()).toBeNull();
  });

  it("resolves the request as not logged in on Escape", async () => {
    const { request } = await setup();
    await request();

    await interact(() => pressKey(document, "Escape"));

    expect(results).toEqual([false]);
    expect(dialog()).toBeNull();
  });

  it("closes when the route changes", async () => {
    const { request } = await setup();
    await request();

    await interact(() => route.set("/account/login"));

    expect(results).toEqual([false]);
    expect(dialog()).toBeNull();
  });

  it("offers the password recovery and closes once its page opens", async () => {
    const preventNavigation = (event: Event) => event.preventDefault();
    document.addEventListener("click", preventNavigation, { capture: true });
    try {
      const { request } = await setup();
      await request();
      const link = query<HTMLAnchorElement>(
        dialog() as HTMLDialogElement,
        '[data-testid="login-forgot-password-link"]',
      );
      expect(link.getAttribute("href")).toBe("/account/recover");
      expect(link.textContent).toBe("Forgot your password?");

      await interact(() => link.click());
      await interact(() => route.set("/account/recover"));

      expect(results).toEqual([false]);
      expect(dialog()).toBeNull();
      expect(login).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener("click", preventNavigation, {
        capture: true,
      });
    }
  });

  it("shares one login between requests made while the modal is open", async () => {
    const { request } = await setup();
    await request();
    await request();

    await fillAndSubmit();

    await vi.waitFor(() => expect(results).toEqual([true, true]));
    expect(login).toHaveBeenCalledTimes(1);
    expect(dialog()).toBeNull();
  });

  it("shows a failed login inside the modal", async () => {
    login.mockResolvedValue({ ok: false, message: "Wrong password" });
    const { request } = await setup();
    await request();

    await fillAndSubmit();

    await vi.waitFor(() =>
      expect(
        query(dialog() as HTMLDialogElement, '[role="alert"]').textContent,
      ).toBe("Wrong password"),
    );
  });

  it("gives the modal fields their own ids so the login page can stay mounted", async () => {
    const { request } = await setup();
    await request();

    const panel = dialog() as HTMLDialogElement;
    expect(
      query(panel, '[data-testid="login-email-input"]').getAttribute("id"),
    ).toBe("login-modal-username");
    expect(query(panel, 'label[for="login-modal-username"]')).toBeTruthy();
    expect(
      query(panel, '[data-testid="login-password-input"]').getAttribute("id"),
    ).toBe("login-modal-password");
  });
});
