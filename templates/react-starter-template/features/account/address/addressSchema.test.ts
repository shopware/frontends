import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

import { customerAddress } from "./address.fixture";
import {
  addressValuesFrom,
  emptyAddressValues,
  toAddressBody,
  validateAddress,
} from "./addressSchema";
import type { AddressValues } from "./addressSchema";

const valid: AddressValues = {
  salutationId: "salutation-mr",
  firstName: "Jo",
  lastName: "Li",
  street: "Elm",
  zipcode: "12345",
  city: "Berlin",
  countryId: "country-pl",
  countryStateId: "",
};

const noStates = { countryHasStates: false };

const t = testTranslator();

describe("validateAddress", () => {
  it("accepts the Form.vue minimum lengths", () => {
    expect(validateAddress(valid, noStates, t)).toEqual({});
  });

  it("requires every Form.vue field of an empty form", () => {
    expect(validateAddress(emptyAddressValues, noStates, t)).toEqual({
      salutationId: "Value is required",
      firstName: "Value is required",
      lastName: "Value is required",
      street: "Value is required",
      zipcode: "Value is required",
      city: "Value is required",
      countryId: "Value is required",
    });
  });

  it("treats whitespace as blank", () => {
    expect(
      validateAddress({ ...valid, city: "   ", zipcode: " " }, noStates, t),
    ).toEqual({ city: "Value is required", zipcode: "Value is required" });
  });

  it("enforces minLength 2 on the names and 3 on the street", () => {
    expect(
      validateAddress(
        { ...valid, firstName: "J", lastName: "L", street: "El" },
        noStates,
        t,
      ),
    ).toEqual({
      firstName: "This minimum length should be at least 2",
      lastName: "This minimum length should be at least 2",
      street: "This minimum length should be at least 3",
    });
  });

  it("requires the state only when the country has states", () => {
    expect(validateAddress(valid, { countryHasStates: true }, t)).toEqual({
      countryStateId: "The value is required",
    });
    expect(
      validateAddress(
        { ...valid, countryStateId: "state-de-by" },
        { countryHasStates: true },
        t,
      ),
    ).toEqual({});
  });
});

describe("addressValuesFrom", () => {
  it("copies the editable fields of a stored address", () => {
    expect(addressValuesFrom(customerAddress())).toEqual({
      salutationId: "salutation-mr",
      firstName: "Jane",
      lastName: "Doe",
      street: "Main Street 1",
      zipcode: "12345",
      city: "Berlin",
      countryId: "country-de",
      countryStateId: "state-de-be",
    });
  });

  it("turns missing optional fields into empty strings", () => {
    expect(
      addressValuesFrom(
        customerAddress({
          salutationId: undefined,
          zipcode: undefined,
          countryStateId: undefined,
        }),
      ),
    ).toMatchObject({ salutationId: "", zipcode: "", countryStateId: "" });
  });
});

describe("toAddressBody", () => {
  it("sends the form fields and the state only when one is chosen", () => {
    expect(toAddressBody(valid)).toEqual({
      salutationId: "salutation-mr",
      firstName: "Jo",
      lastName: "Li",
      street: "Elm",
      zipcode: "12345",
      city: "Berlin",
      countryId: "country-pl",
    });
    expect(
      toAddressBody({ ...valid, countryStateId: "state-de-by" }),
    ).toMatchObject({ countryStateId: "state-de-by" });
  });
});

describe("validateAddress in Polish", () => {
  it("reports the Polish validation messages", () => {
    const pl = testTranslator("pl-PL");

    expect(
      validateAddress(
        { ...valid, firstName: "J", city: " ", countryStateId: "" },
        { countryHasStates: true },
        pl,
      ),
    ).toEqual({
      firstName: "Minimalna długość 2",
      city: "Wartość jest wymagana",
      countryStateId: "Wartość jest wymagana",
    });
  });
});
