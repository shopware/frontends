import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { countries } from "@/components/form/countries.fixture";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  ShopwareClientHarness,
  apiError,
} from "@/features/checkout/checkoutTestDoubles";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, submitForm } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import {
  CREATE_ADDRESS,
  customerAddress,
  salutations,
  sentBody,
} from "../address.fixture";
import {
  chooseCountry,
  fillAddress,
  setSelectValue,
  field,
} from "./addressFormDriver.fixture";
import { NewAddressForm } from "./NewAddressForm";

const { push, refresh } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

let mounted: Mounted | undefined;

beforeEach(() => {
  push.mockReset();
  refresh.mockReset();
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(
  answer: FakeAnswer = () => customerAddress({ id: "address-new" }),
  locale: Locale = "en-GB",
) {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <ShopwareClientHarness client={shopware.client}>
          <NewAddressForm countries={countries} salutations={salutations} />
        </ShopwareClientHarness>
      </CmsActionsProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  return {
    container,
    shopware,
    notify,
    form: query<HTMLFormElement>(container, "form"),
  };
}

describe("NewAddressForm in the browser", () => {
  it("creates the address with the form body, confirms it and returns to the list", async () => {
    const { container, form, shopware, notify } = await setup();

    await fillAddress(container);
    await chooseCountry(container, "Germany");
    await interact(() =>
      setSelectValue(
        field<HTMLSelectElement>(container, "state"),
        "state-de-by",
      ),
    );
    await interact(() => submitForm(form));

    expect(shopware.invocations).toEqual([
      {
        operation: CREATE_ADDRESS,
        params: {
          body: {
            salutationId: "salutation-mrs",
            firstName: "Erika",
            lastName: "Musterfrau",
            street: "Lindenallee 4",
            zipcode: "50667",
            city: "Cologne",
            countryId: "country-de",
            countryStateId: "state-de-by",
          },
        },
      },
    ]);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Address has been successfully added.",
    });
    expect(push).toHaveBeenCalledExactlyOnceWith("/account/address");
  });

  it("leaves the state out for a country without states", async () => {
    const { container, form, shopware } = await setup();

    await fillAddress(container);
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    const body = sentBody(shopware.calls(CREATE_ADDRESS)[0]);
    expect(body).toMatchObject({ countryId: "country-pl" });
    expect(body).not.toHaveProperty("countryStateId");
  });

  it("does not create a second address after a successful save", async () => {
    const { container, form, shopware } = await setup();

    await fillAddress(container);
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));
    await interact(() => submitForm(form));

    expect(shopware.calls(CREATE_ADDRESS)).toHaveLength(1);
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("shows every API error, stays on the page and lets the customer retry", async () => {
    let fail = true;
    const { container, form, shopware, notify } = await setup(() => {
      if (fail) {
        throw apiError([
          {
            code: "VIOLATION::IS_BLANK_ERROR",
            status: "400",
            detail: "This value should not be blank.",
            source: { pointer: "/street" },
            meta: { parameters: { "{{ field }}": "street" } },
          },
          { code: "UNKNOWN", status: "400", detail: "Something else" },
        ]);
      }
      return customerAddress({ id: "address-new" });
    });

    await fillAddress(container);
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(notify.mock.calls).toEqual([
      [{ type: "error", message: "street should not be empty." }],
      [{ type: "error", message: "Something else" }],
    ]);
    expect(push).not.toHaveBeenCalled();

    fail = false;
    await interact(() => submitForm(form));

    expect(shopware.calls(CREATE_ADDRESS)).toHaveLength(2);
    expect(push).toHaveBeenCalledExactlyOnceWith("/account/address");
  });
});

describe("NewAddressForm in Polish", () => {
  it("validates in Polish, confirms in Polish and returns to the prefixed list", async () => {
    const { container, form, notify } = await setup(undefined, "pl-PL");

    await interact(() => submitForm(form));
    expect(container.querySelector("#street-error")?.textContent).toBe(
      "Wartość jest wymagana",
    );
    expect(
      container.querySelector('a[href="/pl-PL/account/address"]')?.textContent,
    ).toBe("Anuluj");

    await fillAddress(container);
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(notify).toHaveBeenCalledExactlyOnceWith({
      type: "success",
      message: "Adres został pomyślnie dodany.",
    });
    expect(push).toHaveBeenCalledExactlyOnceWith("/pl-PL/account/address");
  });
});
