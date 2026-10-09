import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { countries } from "@/components/form/countries.fixture";
import { accountCustomer } from "@/features/account/customer/customer.fixture";
import { fakeCustomer } from "@/features/account/customer/fakeCustomer.fixture";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  ShopwareClientHarness,
  apiError,
} from "@/features/checkout/checkoutTestDoubles";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, queryAll, submitForm } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  LIST_ADDRESS,
  UPDATE_ADDRESS,
  customerAddress,
  salutations,
  sentBody,
} from "../address.fixture";
import {
  chooseCountry,
  field,
  submitButton,
  typeInto,
} from "./addressFormDriver.fixture";
import { EditAddressContent } from "./EditAddressContent";

const { push, refresh } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("@/features/account/customer/useCustomer", async () => ({
  useCustomer: (
    await import("@/features/account/customer/fakeCustomer.fixture")
  ).useFakeCustomer,
}));

const stored = customerAddress({
  id: "0190a3c4d5e6f7a8b9c0d1e2f3a4b5c6",
  title: "Dr.",
  company: "Acme",
  department: "Sales",
  additionalAddressLine1: "Building B",
  phoneNumber: "+49 30 1234",
});

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  refresh.mockReset();
  fakeCustomer.reset();
  fakeCustomer.set({ status: "ready", customer: accountCustomer() });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

function storedAnswer(overrides: Partial<Record<string, FakeAnswer>> = {}) {
  return (operation: string, params: unknown) => {
    const override = overrides[operation];
    if (override) return override(operation, params);
    if (operation === LIST_ADDRESS) return { elements: [stored] };
    if (operation === UPDATE_ADDRESS) return stored;
    return {};
  };
}

async function setup(
  answer: FakeAnswer = storedAnswer(),
  id = stored.id,
  locale: Locale = "en-GB",
) {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  const refreshSession = vi.fn(async () => {});
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <SessionActionsProvider actions={{ refreshSession }}>
          <ShopwareClientHarness client={shopware.client}>
            <Suspense fallback={<p>suspended</p>}>
              <EditAddressContent
                params={Promise.resolve({ id })}
                countries={countries}
                salutations={salutations}
              />
            </Suspense>
          </ShopwareClientHarness>
        </SessionActionsProvider>
      </CmsActionsProvider>,
      locale,
    ),
  );
  await interact(() => {});
  const { container } = mounted;
  return {
    container,
    shopware,
    notify,
    refreshSession,
    form: () => container.querySelector<HTMLFormElement>("form"),
  };
}

function alertText(root: ParentNode): string | null {
  return root.querySelector('[role="alert"]')?.textContent ?? null;
}

describe("EditAddressContent in the browser", () => {
  it("reads the address by id and prefills the form", async () => {
    const { container, shopware } = await setup();

    expect(shopware.invocations).toEqual([
      {
        operation: LIST_ADDRESS,
        params: {
          body: {
            associations: { country: {}, countryState: {}, salutation: {} },
            filter: [{ type: "equals", field: "id", value: stored.id }],
          },
        },
      },
    ]);
    expect(field<HTMLSelectElement>(container, "salutation").value).toBe(
      "salutation-mr",
    );
    expect(field<HTMLInputElement>(container, "first-name").value).toBe("Jane");
    expect(field<HTMLInputElement>(container, "city").value).toBe("Berlin");
    expect(field<HTMLInputElement>(container, "country").value).toBe("Germany");
    expect(field<HTMLSelectElement>(container, "state").value).toBe(
      "state-de-be",
    );
  });

  it("patches every stored field with the edits, refreshes and returns to the list", async () => {
    const { container, form, shopware, notify, refreshSession } = await setup();

    await typeInto(container, "city", "Potsdam");
    await interact(() => {
      const element = form();
      if (element) submitForm(element);
    });

    expect(shopware.calls(UPDATE_ADDRESS)).toEqual([
      {
        operation: UPDATE_ADDRESS,
        params: {
          pathParams: { addressId: stored.id },
          body: {
            salutationId: "salutation-mr",
            title: "Dr.",
            firstName: "Jane",
            lastName: "Doe",
            company: "Acme",
            department: "Sales",
            street: "Main Street 1",
            additionalAddressLine1: "Building B",
            zipcode: "12345",
            city: "Potsdam",
            countryId: "country-de",
            countryStateId: "state-de-be",
            phoneNumber: "+49 30 1234",
          },
        },
      },
    ]);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Address has been successfully updated.",
    });
    expect(fakeCustomer.refresh).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledExactlyOnceWith("/account/address");
  });

  it("drops the stored state when the new country has none", async () => {
    const { container, form, shopware } = await setup();

    await chooseCountry(container, "Poland");
    await interact(() => {
      const element = form();
      if (element) submitForm(element);
    });

    const body = sentBody(shopware.calls(UPDATE_ADDRESS)[0]);
    expect(body).toMatchObject({ countryId: "country-pl", company: "Acme" });
    expect(body).not.toHaveProperty("countryStateId");
  });

  it("shows the API errors of a failed update and stays on the page", async () => {
    const { container, form, notify, refreshSession } = await setup(
      storedAnswer({
        [UPDATE_ADDRESS]: () => {
          throw apiError([{ code: "X", status: "400", detail: "Nope" }]);
        },
      }),
    );

    await interact(() => {
      const element = form();
      if (element) submitForm(element);
    });

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "error",
      message: "Nope",
    });
    expect(push).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
    expect(submitButton(container).getAttribute("aria-busy")).toBe("false");
  });

  it("says the address was not found when the customer has no such address", async () => {
    const { container, form } = await setup(
      storedAnswer({ [LIST_ADDRESS]: () => ({ elements: [] }) }),
    );

    expect(form()).toBeNull();
    expect(alertText(container)).toContain("Address not found");
    const back = queryAll<HTMLAnchorElement>(container, "a").find(
      (link) => link.textContent === "Back",
    );
    expect(back?.getAttribute("href")).toBe("/account/address");
  });

  it("treats an id the backend rejects as an invalid uuid as not found", async () => {
    const { container } = await setup(
      storedAnswer({
        [LIST_ADDRESS]: () => {
          throw apiError([
            {
              code: "FRAMEWORK__INVALID_UUID",
              status: "400",
              detail: 'Value is not a valid UUID: "nope"',
            },
          ]);
        },
      }),
      "nope",
    );

    expect(alertText(container)).toContain("Address not found");
  });

  it("offers a retry when the address cannot be read", async () => {
    let fail = true;
    const { container, form, shopware } = await setup(
      storedAnswer({
        [LIST_ADDRESS]: () => {
          if (fail) throw new Error("offline");
          return { elements: [stored] };
        },
      }),
    );

    expect(alertText(container)).toContain(
      "Something went wrong while loading results.",
    );

    fail = false;
    const retry = queryAll<HTMLButtonElement>(container, "button").find(
      (button) => button.textContent === "Try again",
    );
    await interact(() => retry?.click());

    expect(shopware.calls(LIST_ADDRESS)).toHaveLength(2);
    expect(form()).not.toBeNull();
  });
});

describe("EditAddressContent in German", () => {
  it("says the address was not found in German and links back to the prefixed list", async () => {
    const { container } = await setup(
      storedAnswer({ [LIST_ADDRESS]: () => ({ elements: [] }) }),
      stored.id,
      "de-DE",
    );

    expect(alertText(container)).toContain("Adresse nicht gefunden");
    expect(
      container.querySelector('a[href="/de-DE/account/address"]')?.textContent,
    ).toBe("Zurück");
  });

  it("returns to the prefixed list after saving", async () => {
    const { form, notify } = await setup(storedAnswer(), stored.id, "de-DE");

    await interact(() => {
      const current = form();
      if (current) submitForm(current);
    });

    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "Adresse wurde erfolgreich aktualisiert.",
    });
    expect(push).toHaveBeenCalledExactlyOnceWith("/de-DE/account/address");
  });
});
