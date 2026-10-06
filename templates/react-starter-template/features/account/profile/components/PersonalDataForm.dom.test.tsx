import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import type { FakeCustomerState } from "@/features/account/customer/fakeCustomer.fixture";
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

import {
  ProfileHarness,
  businessCustomer,
  profileCustomer,
  salutationOptions,
} from "../profile.fixture";
import { PersonalDataForm } from "./PersonalDataForm";

const navigation = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

const CHANGE_PROFILE = "changeProfile post /account/change-profile";
const FIRST_NAME = '[data-testid="account-personal-data-firstname-input"]';
const LAST_NAME = '[data-testid="account-personal-data-lastname-input"]';
const SUBMIT = '[data-testid="account-personal-data-submit-button"]';
const FORM = '[data-testid="account-personal-data-form"]';

let mounted: Mounted | undefined;

beforeEach(() => {
  navigation.push.mockReset();
  navigation.refresh.mockReset();
  fakeCustomer.reset();
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup({
  state = { status: "ready", customer: profileCustomer() },
  answer,
  salutationsUnavailable = false,
}: {
  state?: FakeCustomerState;
  answer?: FakeAnswer;
  salutationsUnavailable?: boolean;
} = {}) {
  fakeCustomer.set(state);
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  const refreshSession = vi.fn(async () => {});
  mounted = await mount(
    <StrictMode>
      <ProfileHarness
        client={shopware.client}
        notify={notify}
        actions={{ refreshSession }}
      >
        <PersonalDataForm
          salutations={salutationOptions}
          salutationsUnavailable={salutationsUnavailable}
        />
      </ProfileHarness>
    </StrictMode>,
  );
  const { container } = mounted;
  return {
    shopware,
    notify,
    refreshSession,
    container,
    field: <T extends Element = HTMLInputElement>(selector: string) =>
      query<T>(container, selector),
    error: (id: string) => container.querySelector(`#${id}-error`),
  };
}

function changeSelect(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function leave(element: Element) {
  element.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
}

describe("PersonalDataForm in the browser", () => {
  it("shows a busy skeleton while the customer is read", async () => {
    const { container } = await setup({
      state: { status: "loading", customer: null },
    });

    const skeleton = query(
      container,
      '[data-testid="account-personal-data-loading"]',
    );
    expect(skeleton.getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector(FORM)).toBeNull();
  });

  it("offers a retry when the customer could not be read", async () => {
    const pending = deferred<void>();
    fakeCustomer.refresh.mockImplementation(() => pending.promise);
    const { container } = await setup({
      state: { status: "error", customer: null },
    });

    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      "Unfortunately, something went wrong.",
    );
    const retry = query<HTMLButtonElement>(container, "button");
    await interact(() => retry.click());

    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
    expect(retry.getAttribute("aria-busy")).toBe("true");
    await interact(() => retry.click());
    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);

    await interact(() => pending.resolve());
    expect(retry.getAttribute("aria-busy")).toBe("false");
  });

  it("prefills a private customer", async () => {
    const { field, container } = await setup();

    expect(field(FIRST_NAME).value).toBe("Jane");
    expect(field(LAST_NAME).value).toBe("Doe");
    expect(field<HTMLSelectElement>("#salutation").value).toBe("salutation-mr");
    expect(field<HTMLSelectElement>("#accountType").value).toBe("private");
    expect(container.querySelector("#company")).toBeNull();
    expect(container.querySelector("#vatIds")).toBeNull();
  });

  it("prefills the company and the VAT id of a business customer", async () => {
    const { field } = await setup({
      state: { status: "ready", customer: businessCustomer() },
    });

    expect(field<HTMLSelectElement>("#accountType").value).toBe("business");
    expect(field("#company").value).toBe("Shopware AG");
    expect(field("#vatIds").value).toBe("DE123456789");
  });

  it("rejects a blank first name, focuses it and sends nothing", async () => {
    const { shopware, notify, field, error } = await setup();

    await interact(() => setInputValue(field(FIRST_NAME), " "));
    await interact(() => submitForm(field<HTMLFormElement>(FORM)));

    expect(error("firstName")?.textContent).toBe("Value is required");
    expect(field(FIRST_NAME).getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(field(FIRST_NAME));
    expect(shopware.invocations).toEqual([]);
    expect(notify).not.toHaveBeenCalled();
  });

  it("shows a field error once the field is left", async () => {
    const { field, error } = await setup();

    await interact(() => setInputValue(field(LAST_NAME), ""));
    expect(error("lastName")).toBeNull();

    await interact(() => leave(field(LAST_NAME)));
    expect(error("lastName")?.textContent).toBe("Value is required");
  });

  it("sends the changed data, confirms it and refreshes the customer and the session", async () => {
    const { shopware, notify, refreshSession, field } = await setup();

    await interact(() => setInputValue(field(FIRST_NAME), "John"));
    await interact(() =>
      changeSelect(field<HTMLSelectElement>("#salutation"), "salutation-mrs"),
    );
    await interact(() => field<HTMLButtonElement>(SUBMIT).click());

    expect(shopware.invocations).toEqual([
      {
        operation: CHANGE_PROFILE,
        params: {
          body: {
            firstName: "John",
            lastName: "Doe",
            salutationId: "salutation-mrs",
            title: "",
            accountType: "private",
          },
        },
      },
    ]);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Data has been updated.",
    });
    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("requires and sends the company and the VAT id after switching to a business account", async () => {
    const { shopware, field, error } = await setup();

    await interact(() =>
      changeSelect(field<HTMLSelectElement>("#accountType"), "business"),
    );
    await interact(() => submitForm(field<HTMLFormElement>(FORM)));

    expect(error("company")?.textContent).toBe("The value is required");
    expect(error("vatIds")?.textContent).toBe("The value is required");
    expect(document.activeElement).toBe(field("#company"));
    expect(shopware.invocations).toEqual([]);

    await interact(() => setInputValue(field("#company"), "Shopware AG"));
    await interact(() => setInputValue(field("#vatIds"), "DE123456789"));
    await interact(() => submitForm(field<HTMLFormElement>(FORM)));

    expect(shopware.calls(CHANGE_PROFILE)[0]?.params).toEqual({
      body: {
        firstName: "Jane",
        lastName: "Doe",
        salutationId: "salutation-mr",
        title: "",
        accountType: "business",
        company: "Shopware AG",
        vatIds: ["DE123456789"],
      },
    });
  });

  it("shows every API error and neither confirms nor refreshes", async () => {
    const { notify, refreshSession, field } = await setup({
      answer: () => {
        throw apiClientError([
          {
            code: "VIOLATION::IS_BLANK_ERROR",
            detail: "blank",
            meta: { parameters: { "{{ field }}": "firstName" } },
          },
          { code: "UNKNOWN", detail: "Something broke" },
        ]);
      },
    });

    await interact(() => field<HTMLButtonElement>(SUBMIT).click());

    expect(notify.mock.calls).toEqual([
      [{ type: "error", message: "firstName should not be empty." }],
      [{ type: "error", message: "Something broke" }],
    ]);
    expect(fakeCustomer.refresh).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
    expect(field<HTMLButtonElement>(SUBMIT).getAttribute("aria-busy")).toBe(
      "false",
    );
  });

  it("ignores a second submit while the change is running", async () => {
    const request = deferred<unknown>();
    const { shopware, field } = await setup({ answer: () => request.promise });
    const submit = field<HTMLButtonElement>(SUBMIT);

    await interact(() => submit.click());
    expect(submit.getAttribute("aria-busy")).toBe("true");
    expect(submit.getAttribute("aria-disabled")).toBe("true");
    expect(submit.disabled).toBe(false);

    await interact(() => submit.click());
    expect(shopware.calls(CHANGE_PROFILE)).toHaveLength(1);

    await interact(() => request.resolve({ success: true }));
    expect(submit.getAttribute("aria-busy")).toBe("false");
    expect(submit.getAttribute("aria-disabled")).toBeNull();
  });

  it("keeps the edits when the same customer is re-read and refills for another one", async () => {
    const { field } = await setup();

    await interact(() => setInputValue(field(FIRST_NAME), "John"));
    await interact(() =>
      fakeCustomer.set({
        status: "ready",
        customer: profileCustomer({ firstName: "Server" }),
      }),
    );
    expect(field(FIRST_NAME).value).toBe("John");

    const other: Schemas["Customer"] = profileCustomer({
      id: "customer-2",
      firstName: "Max",
    });
    await interact(() =>
      fakeCustomer.set({ status: "ready", customer: other }),
    );
    expect(field(FIRST_NAME).value).toBe("Max");
  });

  it("disables the salutation select and refreshes the route on retry when salutations are unavailable", async () => {
    const { field, error, container } = await setup({
      salutationsUnavailable: true,
    });

    expect(field<HTMLSelectElement>("#salutation").disabled).toBe(true);
    expect(error("salutation")?.textContent).toContain(
      "Unfortunately, something went wrong.",
    );

    const retry = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Try again",
    );
    await interact(() => retry?.click());
    expect(navigation.refresh).toHaveBeenCalledTimes(1);
  });

  it("focuses the first enabled invalid field when the salutations are unavailable", async () => {
    const { field } = await setup({ salutationsUnavailable: true });

    await interact(() => setInputValue(field(LAST_NAME), ""));
    await interact(() => submitForm(field<HTMLFormElement>(FORM)));

    expect(document.activeElement).toBe(field(LAST_NAME));
  });
});
