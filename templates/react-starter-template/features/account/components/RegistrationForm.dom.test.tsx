import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { Suspense, use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import type { RegistrationSettings } from "@/features/account/registrationSchema";
import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import type {
  RegistrationInput,
  SessionActionResult,
  StorefrontSession,
} from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
import { shopSettings } from "@/platform/shopware/shopSettings.fixture";
import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  query,
  queryAll,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { LoggedInRedirect } from "./LoggedInRedirect";
import { RegistrationForm } from "./RegistrationForm";
import type { RegistrationFormProps } from "./RegistrationForm";

const { push, replace, refresh, routeLoad } = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  routeLoad: { start: undefined as (() => void) | undefined },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace, refresh }),
}));

const countries: CountryOption[] = [
  {
    id: "country-de",
    name: "Germany",
    iso: "DE",
    states: [
      { id: "state-by", name: "Bavaria" },
      { id: "state-be", name: "Berlin" },
    ],
  },
  { id: "country-pl", name: "Poland", iso: "PL", states: [] },
];

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  replace.mockReset();
  refresh.mockReset();
  window.history.replaceState(null, "", "/account/login");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

function PendingRoute({ until }: { until: Promise<void> }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    routeLoad.start = () => setLoading(true);
    return () => {
      routeLoad.start = undefined;
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

function byTestId<T extends Element>(root: ParentNode, testId: string): T {
  return query<T>(root, `[data-testid="${testId}"]`);
}

function setSelectValue(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

type RegisterMock = Mock<SessionActions["register"]>;

function registerMock(
  implementation: SessionActions["register"] = async () => ({ ok: false }),
): RegisterMock {
  return vi.fn<SessionActions["register"]>(implementation);
}

function sentPayload(register: RegisterMock): RegistrationInput {
  const payload = register.mock.calls[0]?.[0];
  if (!payload) throw new Error("register was not called");
  return payload;
}

async function setup(
  register: RegisterMock = registerMock(),
  props: Partial<RegistrationFormProps> = {},
  sibling: ReactNode = null,
  locale: Locale = "en-GB",
) {
  const actions = { register };
  const notify = vi.fn();
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={actions}>
          <RegistrationForm countries={countries} {...props} />
          {sibling}
        </SessionActionsProvider>
      </CmsActionsProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  return {
    actions,
    notify,
    container,
    form: byTestId<HTMLFormElement>(container, "registration-form"),
    submit: byTestId<HTMLButtonElement>(
      container,
      "registration-submit-button",
    ),
    input: (testId: string) => byTestId<HTMLInputElement>(container, testId),
    error: (id: string) => container.querySelector(`#${id}-error`),
  };
}

async function fill(
  input: (testId: string) => HTMLInputElement,
  values: Record<string, string>,
) {
  for (const [testId, value] of Object.entries(values)) {
    await interact(() => setInputValue(input(testId), value));
    await interact(() =>
      input(testId).dispatchEvent(
        new FocusEvent("focusout", { bubbles: true }),
      ),
    );
  }
}

async function chooseCountry(container: HTMLElement, name: string) {
  const combobox = byTestId<HTMLInputElement>(container, "country-select");
  await interact(() => combobox.click());
  await interact(() => setInputValue(combobox, name));
  const option = queryAll<HTMLButtonElement>(container, '[role="option"]').find(
    (candidate) => candidate.textContent?.includes(name),
  );
  expect(option).toBeDefined();
  await interact(() => option?.click());
}

const personalData = {
  "registration-first-name-input": "Jane",
  "registration-last-name-input": "Doe",
  "registration-email-input": "jane.doe@example.com",
  "registration-password-input": "password123",
};

const addressData = {
  "registration-street-input": "Main Street 1",
  "registration-zipcode-input": "12345",
  "registration-city-input": "Munich",
};

describe("RegistrationForm in the browser", () => {
  it("rejects an empty submission without calling the port", async () => {
    const { actions, form, input, error } = await setup();

    await interact(() => submitForm(form));

    expect(error("firstName")?.textContent).toBe("Value is required");
    expect(error("lastName")?.textContent).toBe("Value is required");
    expect(error("emailAddress")?.textContent).toBe("Value is required");
    expect(error("password")?.textContent).toBe("Value is required");
    expect(error("street")?.textContent).toBe("Value is required");
    expect(error("zipcode")?.textContent).toBe("Value is required");
    expect(error("city")?.textContent).toBe("Value is required");
    expect(error("country")?.textContent).toBe("Value is required");
    const firstName = input("registration-first-name-input");
    expect(firstName.getAttribute("aria-invalid")).toBe("true");
    expect(firstName.getAttribute("aria-describedby")).toBe(
      "firstName-hint firstName-error",
    );
    expect(document.activeElement).toBe(firstName);
    expect(actions.register).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("moves focus to the first invalid field in page order", async () => {
    const { container, actions, form, input } = await setup();

    await interact(() =>
      setSelectValue(
        byTestId<HTMLSelectElement>(
          container,
          "registration-account-type-select",
        ),
        "business",
      ),
    );
    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(actions.register).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input("registration-company-input"));
  });

  it("shows a field error after the field is left", async () => {
    const { input, error } = await setup();
    const firstName = input("registration-first-name-input");

    expect(error("firstName")).toBeNull();

    await interact(() => setInputValue(firstName, "Jo"));
    expect(error("firstName")).toBeNull();

    await interact(() =>
      firstName.dispatchEvent(new FocusEvent("focusout", { bubbles: true })),
    );
    expect(error("firstName")?.textContent).toBe(
      "This minimum length should be at least 3",
    );
  });

  it("reveals the company and VAT id fields for a company account", async () => {
    const { container, form, error } = await setup();
    const accountType = byTestId<HTMLSelectElement>(
      container,
      "registration-account-type-select",
    );
    expect(
      container.querySelector('[data-testid="registration-company-input"]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-testid="registration-vatid-input"]'),
    ).toBeNull();

    await interact(() => setSelectValue(accountType, "business"));

    expect(accountType.value).toBe("business");
    byTestId(container, "registration-company-input");
    byTestId(container, "registration-vatid-input");

    await interact(() => submitForm(form));
    expect(error("company")?.textContent).toBe("The value is required");
    expect(error("vatId")).toBeNull();

    await interact(() => setSelectValue(accountType, "private"));
    expect(
      container.querySelector('[data-testid="registration-company-input"]'),
    ).toBeNull();
  });

  it("reveals the state select once a country with states is picked", async () => {
    const { container, form, error } = await setup();
    expect(
      container.querySelector('[data-testid="checkout-pi-state-input"]'),
    ).toBeNull();

    await chooseCountry(container, "Germany");

    const combobox = byTestId<HTMLInputElement>(container, "country-select");
    expect(combobox.value).toBe("Germany");
    const state = byTestId<HTMLSelectElement>(
      container,
      "checkout-pi-state-input",
    );
    expect([...state.options].map((option) => option.textContent)).toEqual([
      "Choose state",
      "Bavaria",
      "Berlin",
    ]);
    expect(state.getAttribute("autocomplete")).toBe("address-level1");
    expect(state.required).toBe(true);

    await interact(() => submitForm(form));
    expect(error("state")?.textContent).toBe("The value is required");
    expect(error("country")).toBeNull();

    await chooseCountry(container, "Poland");
    expect(
      container.querySelector('[data-testid="checkout-pi-state-input"]'),
    ).toBeNull();
  });

  it("resets the state when the country changes", async () => {
    const { container, actions, form, input } = await setup();

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Germany");
    await interact(() =>
      setSelectValue(
        byTestId<HTMLSelectElement>(container, "checkout-pi-state-input"),
        "state-by",
      ),
    );
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(actions.register).toHaveBeenCalledTimes(1);
    const input0 = sentPayload(actions.register);
    expect(input0.billingAddress.countryId).toBe("country-pl");
    expect("countryStateId" in input0.billingAddress).toBe(false);
  });

  it("sends the Store API payload once for a valid private registration and stays on a rejection", async () => {
    const { container, actions, notify, form, input, error } = await setup(
      registerMock(async () => ({
        ok: false,
        message: "The email address is already in use.",
      })),
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Germany");
    await interact(() =>
      setSelectValue(
        byTestId<HTMLSelectElement>(container, "checkout-pi-state-input"),
        "state-by",
      ),
    );
    await interact(() => submitForm(form));

    expect(actions.register).toHaveBeenCalledTimes(1);
    expect(actions.register).toHaveBeenCalledWith({
      accountType: "private",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      acceptedDataProtection: false,
      billingAddress: {
        id: "",
        customerId: "",
        firstName: "Jane",
        lastName: "Doe",
        street: "Main Street 1",
        zipcode: "12345",
        city: "Munich",
        countryId: "country-de",
        countryStateId: "state-by",
      },
    });
    expect(push).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(container.querySelector("output")?.textContent).toBe("");
    expect(input("registration-first-name-input").value).toBe("Jane");
    expect(input("registration-email-input").value).toBe(
      "jane.doe@example.com",
    );
    expect(error("firstName")).toBeNull();
    const submit = byTestId<HTMLButtonElement>(
      container,
      "registration-submit-button",
    );
    expect(submit.disabled).toBe(false);
    expect(submit.getAttribute("aria-busy")).toBe("false");
  });

  it("keeps the submit button focusable but ignores a second submit while the request runs", async () => {
    const request = deferred<SessionActionResult>();
    const { container, actions, submit, input } = await setup(
      registerMock(() => request.promise),
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submit.click());

    expect(actions.register).toHaveBeenCalledTimes(1);
    expect(submit.getAttribute("aria-busy")).toBe("true");
    expect(submit.getAttribute("aria-disabled")).toBe("true");
    expect(submit.disabled).toBe(false);

    await interact(() => submit.click());
    expect(actions.register).toHaveBeenCalledTimes(1);

    await interact(() => request.resolve({ ok: false }));
    expect(submit.getAttribute("aria-busy")).toBe("false");
    expect(submit.getAttribute("aria-disabled")).toBeNull();
  });

  it("stays busy until the redirect target has rendered", async () => {
    const route = deferred<void>();
    push.mockImplementation(() => routeLoad.start?.());
    const { container, actions, submit, input } = await setup(
      registerMock(async () => ({ ok: true })),
      { redirectUrl: "/account" },
      <Suspense fallback={null}>
        <PendingRoute until={route.promise} />
      </Suspense>,
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submit.click());

    expect(push).toHaveBeenCalledWith("/account");
    expect(submit.getAttribute("aria-busy")).toBe("true");
    expect(submit.getAttribute("aria-disabled")).toBe("true");

    await interact(() => submit.click());
    expect(actions.register).toHaveBeenCalledTimes(1);

    await interact(() => route.resolve());
    expect(submit.getAttribute("aria-busy")).toBe("false");
    expect(submit.getAttribute("aria-disabled")).toBeNull();
  });

  it("sends company and VAT id for a business registration", async () => {
    const { container, actions, form, input } = await setup();

    await interact(() =>
      setSelectValue(
        byTestId<HTMLSelectElement>(
          container,
          "registration-account-type-select",
        ),
        "business",
      ),
    );
    await fill(input, {
      ...personalData,
      ...addressData,
      "registration-vatid-input": "DE123456789",
      "registration-company-input": "Acme GmbH",
    });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(actions.register).toHaveBeenCalledTimes(1);
    const payload = sentPayload(actions.register);
    expect(payload.accountType).toBe("business");
    expect(payload.vatIds).toEqual(["DE123456789"]);
    expect(payload.billingAddress.company).toBe("Acme GmbH");
    expect(payload.billingAddress.countryId).toBe("country-pl");
  });

  it("requests the customer group of the page with the registration", async () => {
    const { container, actions, form, input } = await setup(undefined, {
      requestedGroupId: "group-b2b",
    });

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(actions.register).toHaveBeenCalledTimes(1);
    const payload = sentPayload(actions.register);
    expect(payload.requestedGroupId).toBe("group-b2b");
    expect(payload.accountType).toBe("private");
  });

  it("sends a business registration for a company-only group without an account type select", async () => {
    const { container, actions, form, input } = await setup(undefined, {
      companyOnly: true,
      requestedGroupId: "group-b2b",
    });

    expect(
      container.querySelector(
        '[data-testid="registration-account-type-select"]',
      ),
    ).toBeNull();
    await fill(input, {
      ...personalData,
      ...addressData,
      "registration-vatid-input": "DE123456789",
      "registration-company-input": "Acme GmbH",
    });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(actions.register).toHaveBeenCalledTimes(1);
    const payload = sentPayload(actions.register);
    expect(payload.requestedGroupId).toBe("group-b2b");
    expect(payload.accountType).toBe("business");
    expect(payload.vatIds).toEqual(["DE123456789"]);
    expect(payload.billingAddress.company).toBe("Acme GmbH");
  });

  it("requests no customer group on the login page", async () => {
    const { container, actions, form, input } = await setup();

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect("requestedGroupId" in sentPayload(actions.register)).toBe(false);
  });

  it("navigates to the redirect target after a completed registration", async () => {
    const { container, form, input } = await setup(
      registerMock(async () => ({ ok: true })),
      { redirectUrl: "/account" },
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(push).toHaveBeenCalledWith("/account");
  });

  it("follows the redirect query parameter without an explicit redirectUrl", async () => {
    window.history.replaceState(
      null,
      "",
      "/account/login?redirect=%2FClothing%2FMen%2F",
    );
    const { container, form, input } = await setup(
      registerMock(async () => ({ ok: true })),
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/Clothing/Men/");
  });

  it("navigates once when the session flips to logged in next to LoggedInRedirect", async () => {
    window.history.replaceState(
      null,
      "",
      "/account/login?redirect=%2FFurniture%2F",
    );
    const sessionControl: { set?: (session: StorefrontSession) => void } = {};
    function ControlledSession({ children }: { children: ReactNode }) {
      const [session, setSession] = useState<StorefrontSession>({
        ...anonymousSession,
        status: "ready",
      });
      useEffect(() => {
        sessionControl.set = setSession;
      }, []);
      return <SessionProvider session={session}>{children}</SessionProvider>;
    }
    const register = registerMock(async () => {
      sessionControl.set?.({
        ...anonymousSession,
        status: "ready",
        isLoggedIn: true,
        customerName: "Jane Doe",
      });
      return { ok: true };
    });
    const notify = vi.fn();
    mounted = await mount(
      <ControlledSession>
        <LoggedInRedirect />
        <CmsActionsProvider actions={{ notify }}>
          <SessionActionsProvider actions={{ register }}>
            <RegistrationForm countries={countries} />
          </SessionActionsProvider>
        </CmsActionsProvider>
      </ControlledSession>,
    );
    const { container } = mounted;
    const input = (testId: string) =>
      byTestId<HTMLInputElement>(container, testId);

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() =>
      submitForm(byTestId<HTMLFormElement>(container, "registration-form")),
    );

    expect(register).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/Furniture/");
    expect(replace).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("shows the double opt-in notice and clears the form", async () => {
    const { container, form, input, error } = await setup(
      registerMock(async () => ({ ok: true, doubleOptIn: true })),
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    const status = query<HTMLOutputElement>(container, "output");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toContain("Thank you for signing up!");
    expect(input("registration-first-name-input").value).toBe("");
    expect(input("registration-email-input").value).toBe("");
    expect(byTestId<HTMLInputElement>(container, "country-select").value).toBe(
      "",
    );
    expect(error("firstName")).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });

  it("clears a company-only form after every double opt-in and scrolls the notice into view", async () => {
    const { container, actions, form, input, error } = await setup(
      registerMock(async () => ({ ok: true, doubleOptIn: true })),
      { companyOnly: true },
    );
    const scroll = vi.spyOn(
      query<HTMLOutputElement>(container, "output"),
      "scrollIntoView",
    );

    for (const round of [1, 2]) {
      await fill(input, {
        ...personalData,
        ...addressData,
        "registration-company-input": "Acme GmbH",
      });
      await chooseCountry(container, "Poland");
      await interact(() => submitForm(form));

      expect(actions.register).toHaveBeenCalledTimes(round);
      expect(actions.register.mock.calls[round - 1]?.[0].accountType).toBe(
        "business",
      );
      expect(scroll).toHaveBeenCalledTimes(round);
      expect(input("registration-company-input").value).toBe("");
      byTestId(container, "registration-vatid-input");
      expect(
        container.querySelector(
          '[data-testid="registration-account-type-select"]',
        ),
      ).toBeNull();
      expect(error("company")).toBeNull();
      expect(error("firstName")).toBeNull();
    }
  });

  it("reports unavailable countries, keeps the input and retries the read", async () => {
    const { container, actions, form, input } = await setup(registerMock(), {
      countries: [],
      countriesUnavailable: true,
    });
    const combobox = byTestId<HTMLInputElement>(container, "country-select");

    await interact(() => combobox.click());

    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(container.textContent).not.toContain("No countries found");
    expect(combobox.getAttribute("aria-invalid")).toBe("true");
    expect(combobox.getAttribute("aria-describedby")).toBe("country-error");
    expect(query(container, "#country-error").textContent).toBe(
      "Countries could not be loaded",
    );

    await fill(input, { ...personalData, ...addressData });
    await interact(() => submitForm(form));
    expect(actions.register).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(combobox);

    const retry = queryAll<HTMLButtonElement>(container, "button").find(
      (button) => button.textContent === "Try again",
    );
    expect(retry?.type).toBe("button");
    await interact(() => retry?.click());

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(input("registration-first-name-input").value).toBe("Jane");
  });

  it("reports an unexpected thrown registration error without losing the input", async () => {
    const { container, notify, form, input } = await setup(
      registerMock(async () => {
        throw new Error("Service unavailable");
      }),
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "Service unavailable",
    });
    expect(input("registration-first-name-input").value).toBe("Jane");
  });
});

describe("RegistrationForm in Polish", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/pl-PL/account/login");
  });

  it("reports the Polish validation messages", async () => {
    const { form, error } = await setup(registerMock(), {}, null, "pl-PL");

    await interact(() => submitForm(form));

    expect(error("firstName")?.textContent).toBe("Wartość jest wymagana");
    expect(error("emailAddress")?.textContent).toBe("Wartość jest wymagana");
  });

  it("navigates to the prefixed redirect target after a completed registration", async () => {
    const { container, form, input } = await setup(
      registerMock(async () => ({ ok: true })),
      { redirectUrl: "/account" },
      null,
      "pl-PL",
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(push).toHaveBeenCalledWith("/pl-PL/account");
  });
});

function settingsWith(
  overrides: Partial<RegistrationSettings> = {},
): RegistrationSettings {
  return shopSettings({ loginRegistration: overrides }).loginRegistration;
}

const everyField = settingsWith({
  passwordMinLength: 12,
  requireDataProtectionCheckbox: true,
  showSalutation: true,
  showTitleField: true,
  showBirthdayField: true,
  birthdayFieldRequired: true,
  requireEmailConfirmation: true,
  requirePasswordConfirmation: true,
  showAdditionalAddressField1: true,
  additionalAddressField1Required: true,
  showAdditionalAddressField2: true,
  additionalAddressField2Required: true,
  showPhoneNumberField: true,
  phoneNumberFieldRequired: true,
});

const salutations = [
  { label: "Mr.", value: "salutation-mr" },
  { label: "Mrs.", value: "salutation-mrs" },
];

const settingsControl: { apply: (settings: RegistrationSettings) => void } = {
  apply: () => {
    throw new Error("RefreshedRegistrationForm is not mounted");
  },
};

function RefreshedRegistrationForm() {
  const [settings, setSettings] = useState(settingsWith());
  useEffect(() => {
    settingsControl.apply = setSettings;
  }, []);
  return <RegistrationForm countries={countries} settings={settings} />;
}

async function chooseBirthday(
  container: HTMLElement,
  parts: { day?: string; month?: string; year?: string },
) {
  for (const [part, value] of Object.entries(parts)) {
    const select = byTestId<HTMLSelectElement>(
      container,
      `registration-birthday-${part}-select`,
    );
    await interact(() => setSelectValue(select, value));
    await interact(() =>
      select.dispatchEvent(new FocusEvent("focusout", { bubbles: true })),
    );
  }
}

function checkbox(container: HTMLElement): HTMLInputElement {
  return byTestId<HTMLInputElement>(
    container,
    "registration-data-protection-checkbox",
  );
}

describe("RegistrationForm with the shop settings in the browser", () => {
  it("reports every field the shop requires and focuses the first one in page order", async () => {
    const { container, actions, form, input, error } = await setup(
      registerMock(),
      { settings: everyField, salutations, birthYearMax: 2026 },
    );

    await interact(() => submitForm(form));

    expect(actions.register).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input("registration-first-name-input"));
    expect(error("salutation")).toBeNull();
    expect(error("title")).toBeNull();
    expect(error("birthday")?.textContent).toBe("Value is required");
    for (const part of ["day", "month", "year"]) {
      expect(
        byTestId(
          container,
          `registration-birthday-${part}-select`,
        ).getAttribute("aria-invalid"),
      ).toBe("true");
    }
    expect(error("emailConfirmation")?.textContent).toBe("Value is required");
    expect(error("passwordConfirmation")?.textContent).toBe(
      "Value is required",
    );
    expect(error("additionalAddressLine1")?.textContent).toBe(
      "Value is required",
    );
    expect(error("additionalAddressLine2")?.textContent).toBe(
      "Value is required",
    );
    expect(error("phoneNumber")?.textContent).toBe("Value is required");
    expect(error("acceptedDataProtection")?.textContent).toBe(
      "Please confirm that you have read the data protection information.",
    );
    expect(checkbox(container).getAttribute("aria-describedby")).toBe(
      "acceptedDataProtection-error",
    );
  });

  it("clears the data protection error once the box is ticked", async () => {
    const { container, form, error } = await setup(registerMock(), {
      settings: settingsWith({ requireDataProtectionCheckbox: true }),
    });

    await interact(() => submitForm(form));
    expect(error("acceptedDataProtection")).not.toBeNull();
    expect(checkbox(container).getAttribute("aria-invalid")).toBe("true");

    await interact(() => checkbox(container).click());

    expect(checkbox(container).checked).toBe(true);
    expect(error("acceptedDataProtection")).toBeNull();
    expect(checkbox(container).hasAttribute("aria-invalid")).toBe(false);
  });

  it("asks for the rest of a started optional birthday", async () => {
    const { container, actions, form, input, error } = await setup(
      registerMock(),
      { settings: settingsWith({ showBirthdayField: true }) },
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await chooseBirthday(container, { day: "12" });
    await interact(() => submitForm(form));

    expect(actions.register).not.toHaveBeenCalled();
    expect(error("birthday")?.textContent).toBe(
      "Enter the full date of birth or leave all three fields empty.",
    );
    expect(document.activeElement).toBe(
      byTestId(container, "registration-birthday-month-select"),
    );
  });

  it("sends every field the shop asks for in the Store API body", async () => {
    const { container, actions, form, input } = await setup(registerMock(), {
      settings: everyField,
      salutations,
      birthYearMax: 2026,
    });

    await interact(() =>
      setSelectValue(
        byTestId<HTMLSelectElement>(
          container,
          "registration-salutation-select",
        ),
        "salutation-mrs",
      ),
    );
    await fill(input, {
      "registration-title-input": "Dr.",
      ...personalData,
      "registration-password-input": "password-12345",
      "registration-email-confirmation-input": "jane.doe@example.com",
      "registration-password-confirmation-input": "password-12345",
      ...addressData,
      "registration-additional-address-line1-input": "Building B",
      "registration-additional-address-line2-input": "Floor 3",
      "registration-phone-input": "+49 30 123456",
    });
    await chooseBirthday(container, { day: "5", month: "10", year: "1990" });
    await chooseCountry(container, "Poland");
    await interact(() => checkbox(container).click());
    await interact(() => submitForm(form));

    expect(actions.register).toHaveBeenCalledExactlyOnceWith({
      accountType: "private",
      salutationId: "salutation-mrs",
      title: "Dr.",
      firstName: "Jane",
      lastName: "Doe",
      birthdayDay: 5,
      birthdayMonth: 10,
      birthdayYear: 1990,
      email: "jane.doe@example.com",
      password: "password-12345",
      acceptedDataProtection: true,
      billingAddress: {
        id: "",
        customerId: "",
        firstName: "Jane",
        lastName: "Doe",
        street: "Main Street 1",
        additionalAddressLine1: "Building B",
        additionalAddressLine2: "Floor 3",
        zipcode: "12345",
        city: "Munich",
        countryId: "country-pl",
        phoneNumber: "+49 30 123456",
      },
    });
  });

  it("registers a private customer when the shop hides the account type select", async () => {
    const { container, actions, form, input } = await setup(registerMock(), {
      settings: settingsWith({ showAccountTypeSelection: false }),
    });

    expect(
      container.querySelector(
        '[data-testid="registration-account-type-select"]',
      ),
    ).toBeNull();
    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    const payload = sentPayload(actions.register);
    expect(payload.accountType).toBe("private");
    expect(payload).not.toHaveProperty("vatIds");
  });

  it("registers a private customer when a refresh hides the account type select after a company was chosen", async () => {
    const register = registerMock();
    mounted = await mount(
      withI18n(
        <CmsActionsProvider actions={{ notify: vi.fn() }}>
          <SessionActionsProvider actions={{ register }}>
            <RefreshedRegistrationForm />
          </SessionActionsProvider>
        </CmsActionsProvider>,
      ),
    );
    const { container } = mounted;
    const input = (testId: string) =>
      byTestId<HTMLInputElement>(container, testId);
    await interact(() =>
      setSelectValue(
        byTestId<HTMLSelectElement>(
          container,
          "registration-account-type-select",
        ),
        "business",
      ),
    );
    byTestId(container, "registration-company-input");

    await interact(() =>
      settingsControl.apply(settingsWith({ showAccountTypeSelection: false })),
    );

    expect(
      container.querySelector(
        '[data-testid="registration-account-type-select"]',
      ),
    ).toBeNull();
    expect(
      container.querySelector('[data-testid="registration-company-input"]'),
    ).toBeNull();
    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() =>
      submitForm(byTestId<HTMLFormElement>(container, "registration-form")),
    );

    const payload = sentPayload(register);
    expect(payload.accountType).toBe("private");
    expect(payload).not.toHaveProperty("vatIds");
    expect(payload.billingAddress).not.toHaveProperty("company");
  });

  it("still registers a business for a company-only group when the shop hides the account type select", async () => {
    const { container, actions, form, input } = await setup(registerMock(), {
      companyOnly: true,
      requestedGroupId: "group-b2b",
      settings: settingsWith({ showAccountTypeSelection: false }),
    });

    await fill(input, {
      ...personalData,
      ...addressData,
      "registration-company-input": "Acme GmbH",
    });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    const payload = sentPayload(actions.register);
    expect(payload.accountType).toBe("business");
    expect(payload.billingAddress.company).toBe("Acme GmbH");
    expect(payload.requestedGroupId).toBe("group-b2b");
  });

  it("skips the disabled salutation when it moves focus to the first invalid field and retries the read", async () => {
    const { container, form, input } = await setup(registerMock(), {
      settings: settingsWith({ showSalutation: true }),
      salutationsUnavailable: true,
    });
    const salutation = byTestId<HTMLSelectElement>(
      container,
      "registration-salutation-select",
    );
    expect(salutation.disabled).toBe(true);
    expect(salutation.getAttribute("aria-invalid")).toBe("true");

    await interact(() => submitForm(form));
    expect(document.activeElement).toBe(input("registration-first-name-input"));

    const retry = queryAll<HTMLButtonElement>(container, "button").find(
      (button) => button.textContent === "Try again",
    );
    await interact(() => retry?.click());
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("describes the salutation retry with the failure message the disabled select carries", async () => {
    const { container } = await setup(registerMock(), {
      settings: settingsWith({ showSalutation: true }),
      salutationsUnavailable: true,
    });

    const retry = queryAll<HTMLButtonElement>(container, "button").find(
      (button) => button.textContent === "Try again",
    );
    const describedBy = retry?.getAttribute("aria-describedby") ?? "";
    const description = describedBy
      ? container.querySelector(`[id="${describedBy}"]`)
      : null;
    expect(description?.textContent).toBe(
      "Unfortunately, something went wrong. Please try again in a few moments. If the problem persists, you can return to the homepage or contact our support team for assistance.",
    );
    expect(
      byTestId<HTMLSelectElement>(
        container,
        "registration-salutation-select",
      ).getAttribute("aria-describedby"),
    ).toBe(describedBy);
  });

  it("clears the data protection tick with the rest of the form after a double opt-in", async () => {
    const { container, form, input } = await setup(
      registerMock(async () => ({ ok: true, doubleOptIn: true })),
      { settings: settingsWith({ requireDataProtectionCheckbox: true }) },
    );

    await fill(input, { ...personalData, ...addressData });
    await chooseCountry(container, "Poland");
    await interact(() => checkbox(container).click());
    await interact(() => submitForm(form));

    expect(container.querySelector("output")?.textContent).toContain(
      "Thank you for signing up!",
    );
    expect(checkbox(container).checked).toBe(false);
    expect(container.querySelector("#acceptedDataProtection-error")).toBeNull();
  });

  it("reports a confirmation mismatch in German", async () => {
    window.history.replaceState(null, "", "/de-DE/account/login");
    const { container, form, input, error } = await setup(
      registerMock(),
      {
        settings: settingsWith({
          requireEmailConfirmation: true,
          requirePasswordConfirmation: true,
        }),
      },
      null,
      "de-DE",
    );

    await fill(input, {
      ...personalData,
      "registration-email-confirmation-input": "jane@example.com",
      "registration-password-confirmation-input": "password124",
      ...addressData,
    });
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(error("emailConfirmation")?.textContent).toBe(
      "Der Wert muss dem Wert E-Mail entsprechen",
    );
    expect(error("passwordConfirmation")?.textContent).toBe(
      "Die Passwörter stimmen nicht überein",
    );
    expect(document.activeElement).toBe(
      input("registration-email-confirmation-input"),
    );
  });
});
