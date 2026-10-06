import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { countries } from "@/components/form/countries.fixture";
import { interact, mount, query, submitForm } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { salutations } from "../address.fixture";
import type { AddressValues } from "../addressSchema";
import { AddressForm } from "./AddressForm";
import type { AddressFormProps } from "./AddressForm";
import {
  chooseCountry,
  errorText,
  field,
  fillAddress,
  setSelectValue,
  submitButton,
  typeInto,
} from "./addressFormDriver.fixture";

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

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

async function setup(props: Partial<AddressFormProps> = {}) {
  const onSubmit = vi.fn<(values: AddressValues) => Promise<void>>(
    async () => {},
  );
  mounted = await mount(
    <AddressForm
      countries={countries}
      salutations={salutations}
      onSubmit={onSubmit}
      {...props}
    />,
  );
  const { container } = mounted;
  return {
    container,
    onSubmit,
    form: query<HTMLFormElement>(container, "form"),
  };
}

describe("AddressForm in the browser", () => {
  it("rejects an empty submission, shows every Form.vue error and focuses the first field", async () => {
    const { container, form, onSubmit } = await setup();

    await interact(() => submitForm(form));

    expect(onSubmit).not.toHaveBeenCalled();
    for (const id of [
      "salutation",
      "first-name",
      "last-name",
      "street",
      "zipcode",
      "city",
      "country",
    ]) {
      expect(errorText(container, id)).toBe("Value is required");
    }
    const salutation = field<HTMLSelectElement>(container, "salutation");
    expect(salutation.getAttribute("aria-invalid")).toBe("true");
    expect(salutation.getAttribute("aria-describedby")).toBe(
      "salutation-error",
    );
    expect(document.activeElement).toBe(salutation);
  });

  it("shows a field error after the field is left, not before", async () => {
    const { container } = await setup();

    await typeInto(container, "first-name", "J");
    expect(errorText(container, "first-name")).toBeNull();

    await interact(() =>
      field<HTMLInputElement>(container, "first-name").dispatchEvent(
        new FocusEvent("focusout", { bubbles: true }),
      ),
    );

    expect(errorText(container, "first-name")).toBe(
      "This minimum length should be at least 2",
    );
  });

  it("submits the entered values for a country without states", async () => {
    const { container, form, onSubmit } = await setup();

    await fillAddress(container);
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      salutationId: "salutation-mrs",
      firstName: "Erika",
      lastName: "Musterfrau",
      street: "Lindenallee 4",
      zipcode: "50667",
      city: "Cologne",
      countryId: "country-pl",
      countryStateId: "",
    });
  });

  it("requires a state for a country with states and submits the chosen one", async () => {
    const { container, form, onSubmit } = await setup();

    await fillAddress(container);
    await chooseCountry(container, "Germany");
    await interact(() => submitForm(form));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(errorText(container, "state")).toBe("The value is required");
    expect(document.activeElement).toBe(field(container, "state"));

    await interact(() =>
      setSelectValue(
        field<HTMLSelectElement>(container, "state"),
        "state-de-by",
      ),
    );
    await interact(() => submitForm(form));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({
      countryId: "country-de",
      countryStateId: "state-de-by",
    });
  });

  it("clears the chosen state when the country changes", async () => {
    const { container, form, onSubmit } = await setup({
      initialValues: {
        salutationId: "salutation-mr",
        firstName: "Jane",
        lastName: "Doe",
        street: "Main Street 1",
        zipcode: "12345",
        city: "Berlin",
        countryId: "country-de",
        countryStateId: "state-de-be",
      },
    });

    expect(field<HTMLSelectElement>(container, "state").value).toBe(
      "state-de-be",
    );

    await chooseCountry(container, "Poland");
    expect(container.querySelector("#state")).toBeNull();
    await interact(() => submitForm(form));

    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({
      countryId: "country-pl",
      countryStateId: "",
    });
  });

  it("ignores a second submission while the first is pending", async () => {
    const pending = deferred();
    const { container, form, onSubmit } = await setup();
    onSubmit.mockImplementation(() => pending.promise);

    await fillAddress(container);
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));
    await interact(() => submitForm(form));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(submitButton(container).getAttribute("aria-busy")).toBe("true");
    expect(submitButton(container).getAttribute("aria-disabled")).toBe("true");

    await interact(() => pending.resolve());

    expect(submitButton(container).getAttribute("aria-busy")).toBe("false");
  });

  it("ignores a submission while the parent marks the form busy", async () => {
    const { container, form, onSubmit } = await setup({ busy: true });

    await fillAddress(container);
    await chooseCountry(container, "Poland");
    await interact(() => submitForm(form));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("refreshes the route to retry reference data that could not be read", async () => {
    const { container } = await setup({
      countries: [],
      countriesUnavailable: true,
    });

    const retry = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Try again",
    );
    await interact(() => retry?.click());

    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
