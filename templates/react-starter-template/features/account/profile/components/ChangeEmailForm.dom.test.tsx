import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { Suspense, use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { deferred } from "@/features/checkout/checkoutTestDoubles";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import { apiClientError } from "@/features/session/session.fixture";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import {
  interact,
  mount,
  query,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { ProfileHarness, profileCustomer } from "../profile.fixture";
import { ChangeEmailForm } from "./ChangeEmailForm";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  startRouteLoad: undefined as (() => void) | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

const CHANGE_EMAIL = "changeEmail post /account/change-email";
const FORM = '[data-testid="account-change-email-form"]';

let mounted: Mounted | undefined;

beforeEach(() => {
  navigation.push.mockReset();
  fakeCustomer.reset();
  fakeCustomer.set({ status: "ready", customer: profileCustomer() });
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

async function setup({
  answer,
  sibling = null,
}: { answer?: FakeAnswer; sibling?: ReactNode } = {}) {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  const refreshSession = vi.fn(async () => {});
  mounted = await mount(
    <ProfileHarness
      client={shopware.client}
      notify={notify}
      actions={{ refreshSession }}
    >
      <ChangeEmailForm />
      {sibling}
    </ProfileHarness>,
  );
  const { container } = mounted;
  return {
    shopware,
    notify,
    refreshSession,
    container,
    form: query<HTMLFormElement>(container, FORM),
    email: query<HTMLInputElement>(
      container,
      '[data-testid="account-personal-data-email-input"]',
    ),
    confirmation: query<HTMLInputElement>(container, "#confirmEmail"),
    password: query<HTMLInputElement>(container, "#password"),
    submit: query<HTMLButtonElement>(container, 'button[type="submit"]'),
    error: (id: string) => container.querySelector(`#${id}-error`),
  };
}

async function fillValid(fields: {
  email: HTMLInputElement;
  confirmation: HTMLInputElement;
  password: HTMLInputElement;
}) {
  await interact(() => setInputValue(fields.email, "new@example.com"));
  await interact(() => setInputValue(fields.confirmation, "new@example.com"));
  await interact(() => setInputValue(fields.password, "secret"));
}

describe("ChangeEmailForm in the browser", () => {
  it("labels the fields like the Vue page and marks them as required", async () => {
    const { container, email, password } = await setup();

    expect(container.querySelector('label[for="newEmail"]')?.textContent).toBe(
      "Enter new email",
    );
    expect(
      container.querySelector('label[for="confirmEmail"]')?.textContent,
    ).toBe("Repeat new email");
    expect(container.querySelector('label[for="password"]')?.textContent).toBe(
      "Current password*",
    );
    expect(email.type).toBe("email");
    expect(email.getAttribute("aria-required")).toBe("true");
    expect(password.type).toBe("password");
    expect(password.autocomplete).toBe("current-password");
  });

  it("rejects an empty submission, focuses the first field and sends nothing", async () => {
    const { shopware, notify, form, email, error } = await setup();

    await interact(() => submitForm(form));

    expect(error("newEmail")?.textContent).toBe("Value is required");
    expect(error("confirmEmail")?.textContent).toBe("Value is required");
    expect(error("password")?.textContent).toBe("Value is required");
    expect(document.activeElement).toBe(email);
    expect(shopware.invocations).toEqual([]);
    expect(notify).not.toHaveBeenCalled();
  });

  it("reports a confirmation that differs once it is left", async () => {
    const { email, confirmation, error } = await setup();

    await interact(() => setInputValue(email, "new@example.com"));
    await interact(() => setInputValue(confirmation, "other@example.com"));
    expect(error("confirmEmail")).toBeNull();

    await interact(() =>
      confirmation.dispatchEvent(new FocusEvent("focusout", { bubbles: true })),
    );
    expect(error("confirmEmail")?.textContent).toBe(
      "The value must be equal to the email value",
    );
  });

  it("changes the email, confirms it, refreshes the customer and the session, then goes to the profile", async () => {
    const refreshed = deferred<void>();
    fakeCustomer.refresh.mockImplementation(() => refreshed.promise);
    const { shopware, notify, refreshSession, submit, ...fields } =
      await setup();

    await fillValid(fields);
    await interact(() => submit.click());

    expect(shopware.invocations).toEqual([
      {
        operation: CHANGE_EMAIL,
        params: {
          body: {
            email: "new@example.com",
            emailConfirmation: "new@example.com",
            password: "secret",
          },
        },
      },
    ]);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Email address has been updated successfully.",
    });
    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(navigation.push).not.toHaveBeenCalled();

    await interact(() => refreshed.resolve());
    expect(navigation.push).toHaveBeenCalledExactlyOnceWith("/account/profile");
  });

  it("does not leave the page the customer moved to while the refresh ran", async () => {
    const refreshed = deferred<void>();
    fakeCustomer.refresh.mockImplementation(() => refreshed.promise);
    const { notify, submit, ...fields } = await setup();

    await fillValid(fields);
    await interact(() => submit.click());
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Email address has been updated successfully.",
    });

    await mounted?.unmount();
    mounted = undefined;
    await interact(() => refreshed.resolve());

    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("shows the API errors, keeps the values and stays on the page", async () => {
    const { notify, refreshSession, submit, ...fields } = await setup({
      answer: () => {
        throw apiClientError([
          { code: "VIOLATION::CUSTOMER_PASSWORD_NOT_CORRECT", detail: "" },
        ]);
      },
    });

    await fillValid(fields);
    await interact(() => submit.click());

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "Password incorrect.",
    });
    expect(fakeCustomer.refresh).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
    expect(navigation.push).not.toHaveBeenCalled();
    expect(fields.email.value).toBe("new@example.com");
    expect(fields.password.value).toBe("secret");
    expect(submit.getAttribute("aria-busy")).toBe("false");
  });

  it("shows the default error when the client cannot be created", async () => {
    const notify = vi.fn();
    mounted = await mount(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={{ refreshSession: vi.fn() }}>
          <ShopwareClientProvider
            getClient={async () => {
              throw new Error("config unavailable");
            }}
          >
            <ChangeEmailForm />
          </ShopwareClientProvider>
        </SessionActionsProvider>
      </CmsActionsProvider>,
    );
    const { container } = mounted;

    await fillValid({
      email: query(container, "#newEmail"),
      confirmation: query(container, "#confirmEmail"),
      password: query(container, "#password"),
    });
    await interact(() => submitForm(query(container, FORM)));

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: expect.stringContaining("Unfortunately, something went wrong."),
    });
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("ignores a second submit while the change runs and until the profile has rendered", async () => {
    const request = deferred<unknown>();
    const route = deferred<void>();
    navigation.push.mockImplementation(() => navigation.startRouteLoad?.());
    const { shopware, submit, ...fields } = await setup({
      answer: () => request.promise,
      sibling: (
        <Suspense fallback={null}>
          <PendingRoute until={route.promise} />
        </Suspense>
      ),
    });

    await fillValid(fields);
    await interact(() => submit.click());
    expect(submit.getAttribute("aria-busy")).toBe("true");
    expect(submit.getAttribute("aria-disabled")).toBe("true");

    await interact(() => submit.click());
    expect(shopware.calls(CHANGE_EMAIL)).toHaveLength(1);

    await interact(() => request.resolve({ success: true }));
    expect(navigation.push).toHaveBeenCalledTimes(1);
    expect(submit.getAttribute("aria-busy")).toBe("true");

    await interact(() => submit.click());
    expect(shopware.calls(CHANGE_EMAIL)).toHaveLength(1);

    await interact(() => route.resolve());
    expect(submit.getAttribute("aria-busy")).toBe("false");
  });
});
