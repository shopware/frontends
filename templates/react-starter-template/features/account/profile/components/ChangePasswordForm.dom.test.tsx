import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { deferred } from "@/features/checkout/checkoutTestDoubles";
import { apiClientError } from "@/features/session/session.fixture";
import {
  interact,
  mount,
  query,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { ProfileHarness, profileCustomer } from "../profile.fixture";
import { ChangePasswordForm } from "./ChangePasswordForm";

const navigation = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

const CHANGE_PASSWORD = "changePassword post /account/change-password";
const FORM = '[data-testid="account-change-password-form"]';

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

async function setup({ answer }: { answer?: FakeAnswer } = {}) {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  const refreshSession = vi.fn(async () => {});
  mounted = await mount(
    <ProfileHarness
      client={shopware.client}
      notify={notify}
      actions={{ refreshSession }}
    >
      <ChangePasswordForm />
    </ProfileHarness>,
  );
  const { container } = mounted;
  return {
    shopware,
    notify,
    refreshSession,
    container,
    form: query<HTMLFormElement>(container, FORM),
    newPassword: query<HTMLInputElement>(container, "#newPassword"),
    confirmation: query<HTMLInputElement>(container, "#newPasswordConfirm"),
    current: query<HTMLInputElement>(container, "#currentPassword"),
    submit: query<HTMLButtonElement>(container, 'button[type="submit"]'),
    error: (id: string) => container.querySelector(`#${id}-error`),
  };
}

describe("ChangePasswordForm in the browser", () => {
  it("renders three password fields with the Vue labels and autocomplete hints", async () => {
    const { container, newPassword, confirmation, current } = await setup();

    expect(
      container.querySelector('label[for="newPassword"]')?.textContent,
    ).toBe("Enter new password*");
    expect(
      container.querySelector('label[for="newPasswordConfirm"]')?.textContent,
    ).toBe("Repeat new password*");
    expect(
      container.querySelector('label[for="currentPassword"]')?.textContent,
    ).toBe("Current password*");
    for (const input of [newPassword, confirmation, current]) {
      expect(input.type).toBe("password");
      expect(input.getAttribute("aria-required")).toBe("true");
    }
    expect(newPassword.autocomplete).toBe("new-password");
    expect(confirmation.autocomplete).toBe("new-password");
    expect(current.autocomplete).toBe("current-password");
  });

  it("rejects an empty submission and focuses the new password", async () => {
    const { shopware, form, newPassword, error } = await setup();

    await interact(() => submitForm(form));

    expect(error("newPassword")?.textContent).toBe("Value is required");
    expect(error("newPasswordConfirm")?.textContent).toBe("Value is required");
    expect(error("currentPassword")?.textContent).toBe("Value is required");
    expect(document.activeElement).toBe(newPassword);
    expect(shopware.invocations).toEqual([]);
  });

  it("asks for eight characters and a matching confirmation", async () => {
    const { shopware, form, newPassword, confirmation, current, error } =
      await setup();

    await interact(() => setInputValue(newPassword, "short"));
    await interact(() => setInputValue(confirmation, "shorter"));
    await interact(() => setInputValue(current, "old-secret"));
    await interact(() => submitForm(form));

    expect(error("newPassword")?.textContent).toBe(
      "This minimum length should be at least 8",
    );
    expect(error("newPasswordConfirm")?.textContent).toBe(
      "The passwords needs to be the same",
    );
    expect(error("currentPassword")).toBeNull();
    expect(document.activeElement).toBe(newPassword);
    expect(shopware.invocations).toEqual([]);
  });

  it("changes the password, confirms it, refreshes and goes to the profile", async () => {
    const {
      shopware,
      notify,
      refreshSession,
      newPassword,
      confirmation,
      current,
      submit,
    } = await setup();

    await interact(() => setInputValue(newPassword, "new-secret"));
    await interact(() => setInputValue(confirmation, "new-secret"));
    await interact(() => setInputValue(current, "old-secret"));
    await interact(() => submit.click());

    expect(shopware.invocations).toEqual([
      {
        operation: CHANGE_PASSWORD,
        params: {
          body: {
            password: "old-secret",
            newPassword: "new-secret",
            newPasswordConfirm: "new-secret",
          },
        },
      },
    ]);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Password has been updated successfully.",
    });
    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(navigation.push).toHaveBeenCalledExactlyOnceWith("/account/profile");
  });

  it("shows the API error for a wrong current password and stays", async () => {
    const {
      notify,
      refreshSession,
      newPassword,
      confirmation,
      current,
      submit,
    } = await setup({
      answer: () => {
        throw apiClientError([
          { code: "VIOLATION::CUSTOMER_PASSWORD_NOT_CORRECT", detail: "" },
        ]);
      },
    });

    await interact(() => setInputValue(newPassword, "new-secret"));
    await interact(() => setInputValue(confirmation, "new-secret"));
    await interact(() => setInputValue(current, "wrong"));
    await interact(() => submit.click());

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "Password incorrect.",
    });
    expect(refreshSession).not.toHaveBeenCalled();
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("sends one request for a double submit", async () => {
    const request = deferred<unknown>();
    const { shopware, newPassword, confirmation, current, submit } =
      await setup({ answer: () => request.promise });

    await interact(() => setInputValue(newPassword, "new-secret"));
    await interact(() => setInputValue(confirmation, "new-secret"));
    await interact(() => setInputValue(current, "old-secret"));
    await interact(() => {
      submit.click();
      submit.click();
    });
    await interact(() => submit.click());

    expect(shopware.calls(CHANGE_PASSWORD)).toHaveLength(1);
    expect(submit.getAttribute("aria-busy")).toBe("true");

    await interact(() => request.resolve({ contextToken: "new-token" }));
    expect(shopware.calls(CHANGE_PASSWORD)).toHaveLength(1);
  });
});
