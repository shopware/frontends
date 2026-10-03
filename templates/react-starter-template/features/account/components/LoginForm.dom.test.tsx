import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { Suspense, use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import type { SessionActionResult } from "@/features/session/types";
import {
  interact,
  mount,
  query,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { LoginForm } from "./LoginForm";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  startRouteLoad: undefined as (() => void) | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
}));

let mounted: Mounted | undefined;

beforeEach(() => {
  navigation.push.mockReset();
  window.history.replaceState(null, "", "/account/login");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

function PendingRoute({ until }: { until: Promise<void> }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    navigation.startRouteLoad = () => setLoading(true);
    return () => {
      navigation.startRouteLoad = undefined;
    };
  }, []);
  if (loading) use(until);
  return null;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

async function setup(
  overrides: Partial<SessionActions> = {},
  props: { hideSignUp?: boolean; redirectUrl?: string | null } = {},
  sibling: ReactNode = null,
) {
  const actions = {
    login: vi.fn(async () => ({ ok: false })),
    ...overrides,
  };
  const notify = vi.fn();
  mounted = await mount(
    <CmsActionsProvider actions={{ notify }}>
      <SessionActionsProvider actions={actions}>
        <LoginForm {...props} />
        {sibling}
      </SessionActionsProvider>
    </CmsActionsProvider>,
  );
  const { container } = mounted;
  return {
    actions,
    notify,
    container,
    form: query<HTMLFormElement>(container, '[data-testid="login-form"]'),
    submit: query<HTMLButtonElement>(
      container,
      '[data-testid="login-submit-button"]',
    ),
    email: query<HTMLInputElement>(
      container,
      '[data-testid="login-email-input"]',
    ),
    password: query<HTMLInputElement>(
      container,
      '[data-testid="login-password-input"]',
    ),
    error: (id: string) => container.querySelector(`#${id}-error`),
  };
}

describe("LoginForm in the browser", () => {
  it("rejects an empty submission without calling the port", async () => {
    const { actions, notify, form, email, error } = await setup();

    await interact(() => submitForm(form));

    expect(error("login-username")?.textContent).toBe("Value is required");
    expect(error("login-password")?.textContent).toBe("Value is required");
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(email.getAttribute("aria-describedby")).toBe("login-username-error");
    expect(document.activeElement).toBe(email);
    expect(actions.login).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("moves focus to the password when only the password is invalid", async () => {
    const { actions, form, email, password } = await setup();

    await interact(() => setInputValue(email, "jane@example.com"));
    await interact(() => submitForm(form));

    expect(actions.login).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(password);
  });

  it("validates a field once it is left", async () => {
    const { email, error } = await setup();

    await interact(() => setInputValue(email, "jane"));
    expect(error("login-username")).toBeNull();

    await interact(() =>
      email.dispatchEvent(new FocusEvent("focusout", { bubbles: true })),
    );
    expect(error("login-username")?.textContent).toBe(
      "Value is not a valid email address",
    );
  });

  it("calls the port with the credentials and stays put on a rejection", async () => {
    const { actions, notify, form, email, password } = await setup();

    await interact(() => setInputValue(email, "jane@example.com"));
    await interact(() => setInputValue(password, "secret"));
    await interact(() => submitForm(form));

    expect(actions.login).toHaveBeenCalledTimes(1);
    expect(actions.login).toHaveBeenCalledWith({
      username: "jane@example.com",
      password: "secret",
    });
    expect(notify).not.toHaveBeenCalled();
    expect(navigation.push).not.toHaveBeenCalled();
    expect(email.value).toBe("jane@example.com");
    expect(password.value).toBe("secret");
  });

  it("confirms a successful login and goes home", async () => {
    const { notify, form, email, password } = await setup({
      login: vi.fn(async () => ({ ok: true })),
    });

    await interact(() => setInputValue(email, "jane@example.com"));
    await interact(() => setInputValue(password, "secret"));
    await interact(() => submitForm(form));

    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "You have been logged in successfully.",
    });
    expect(navigation.push).toHaveBeenCalledWith("/");
  });

  it("follows a same-origin redirect query parameter", async () => {
    window.history.replaceState(
      null,
      "",
      "/account/login?redirect=%2FClothing%2FMen%2F",
    );
    const { form, email, password } = await setup({
      login: vi.fn(async () => ({ ok: true })),
    });

    await interact(() => setInputValue(email, "jane@example.com"));
    await interact(() => setInputValue(password, "secret"));
    await interact(() => submitForm(form));

    expect(navigation.push).toHaveBeenCalledWith("/Clothing/Men/");
  });

  it("ignores an off-site redirect and prefers an explicit redirectUrl", async () => {
    window.history.replaceState(
      null,
      "",
      "/account/login?redirect=https%3A%2F%2Fexample.com",
    );
    const first = await setup({ login: vi.fn(async () => ({ ok: true })) });

    await interact(() => setInputValue(first.email, "jane@example.com"));
    await interact(() => setInputValue(first.password, "secret"));
    await interact(() => submitForm(first.form));
    expect(navigation.push).toHaveBeenCalledWith("/");

    await mounted?.unmount();
    mounted = undefined;
    navigation.push.mockReset();

    const second = await setup(
      { login: vi.fn(async () => ({ ok: true })) },
      { redirectUrl: "/account" },
    );
    await interact(() => setInputValue(second.email, "jane@example.com"));
    await interact(() => setInputValue(second.password, "secret"));
    await interact(() => submitForm(second.form));
    expect(navigation.push).toHaveBeenCalledWith("/account");
  });

  it("keeps the submit button focusable but ignores a second submit while the request runs", async () => {
    const request = deferred<SessionActionResult>();
    const login = vi.fn<SessionActions["login"]>(() => request.promise);
    const { submit, email, password } = await setup({ login });

    await interact(() => setInputValue(email, "jane@example.com"));
    await interact(() => setInputValue(password, "secret"));
    await interact(() => submit.click());

    expect(login).toHaveBeenCalledTimes(1);
    expect(submit.getAttribute("aria-busy")).toBe("true");
    expect(submit.getAttribute("aria-disabled")).toBe("true");
    expect(submit.disabled).toBe(false);

    await interact(() => submit.click());
    expect(login).toHaveBeenCalledTimes(1);

    await interact(() => request.resolve({ ok: false }));
    expect(submit.getAttribute("aria-busy")).toBe("false");
    expect(submit.getAttribute("aria-disabled")).toBeNull();
  });

  it("stays busy until the redirect target has rendered", async () => {
    const route = deferred<void>();
    navigation.push.mockImplementation(() => navigation.startRouteLoad?.());
    const login = vi.fn<SessionActions["login"]>(async () => ({ ok: true }));
    const { notify, submit, email, password } = await setup(
      { login },
      {},
      <Suspense fallback={null}>
        <PendingRoute until={route.promise} />
      </Suspense>,
    );

    await interact(() => setInputValue(email, "jane@example.com"));
    await interact(() => setInputValue(password, "secret"));
    await interact(() => submit.click());

    expect(navigation.push).toHaveBeenCalledWith("/");
    expect(submit.getAttribute("aria-busy")).toBe("true");
    expect(submit.getAttribute("aria-disabled")).toBe("true");

    await interact(() => submit.click());
    expect(login).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);

    await interact(() => route.resolve());
    expect(submit.getAttribute("aria-busy")).toBe("false");
    expect(submit.getAttribute("aria-disabled")).toBeNull();
  });

  it("reports a thrown login error", async () => {
    const { notify, form, email, password } = await setup({
      login: vi.fn(async () => {
        throw new Error("Service unavailable");
      }),
    });

    await interact(() => setInputValue(email, "jane@example.com"));
    await interact(() => setInputValue(password, "secret"));
    await interact(() => submitForm(form));

    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "Service unavailable",
    });
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("sends the visitor to the registration anchor from the sign-up button", async () => {
    const { container } = await setup();
    const signUp = query<HTMLButtonElement>(
      container,
      '[data-testid="login-sign-up-button"]',
    );

    await interact(() => signUp.click());

    expect(navigation.push).toHaveBeenCalledWith("/account/login#registration");
  });

  it("renders no sign-up button when hidden", async () => {
    const { container } = await setup({}, { hideSignUp: true });

    expect(
      container.querySelector('[data-testid="login-sign-up-button"]'),
    ).toBeNull();
  });
});
