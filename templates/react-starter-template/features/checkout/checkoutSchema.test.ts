import { describe, expect, it } from "vitest";

import {
  emptyCheckoutValues,
  toBillingAddressFields,
  toCheckoutRegistration,
  validateCheckout,
} from "./checkoutSchema";
import type { CheckoutValues } from "./checkoutSchema";

const REQUIRED = "Value is required";
const MIN_3 = "This minimum length should be at least 3";
const MIN_8 = "This minimum length should be at least 8";

const valid: CheckoutValues = {
  email: "jane@example.com",
  password: "",
  firstName: "Jane",
  lastName: "Doe",
  street: "Main Street 1",
  zipcode: "12345",
  city: "Berlin",
  countryId: "country-pl",
  countryStateId: "",
};

const guest = { createAccount: false, countryHasStates: false };

describe("validateCheckout", () => {
  it("accepts a complete guest address without a password", () => {
    expect(validateCheckout(valid, guest)).toEqual({});
  });

  it("requires every customer and address field except the password and state", () => {
    expect(validateCheckout(emptyCheckoutValues, guest)).toEqual({
      email: REQUIRED,
      firstName: REQUIRED,
      lastName: REQUIRED,
      street: REQUIRED,
      zipcode: REQUIRED,
      city: REQUIRED,
      countryId: REQUIRED,
    });
  });

  it("treats whitespace as an empty value", () => {
    expect(
      validateCheckout({ ...valid, city: "   ", zipcode: " " }, guest),
    ).toEqual({ city: REQUIRED, zipcode: REQUIRED });
  });

  it("rejects an invalid email address", () => {
    expect(validateCheckout({ ...valid, email: "jane@" }, guest)).toEqual({
      email: "Value is not a valid email address",
    });
  });

  it("needs at least three characters for the names and the street", () => {
    expect(
      validateCheckout(
        { ...valid, firstName: "Jo", lastName: "Do", street: "St" },
        guest,
      ),
    ).toEqual({ firstName: MIN_3, lastName: MIN_3, street: MIN_3 });
  });

  it("requires a password of eight characters only when an account is created", () => {
    const account = { createAccount: true, countryHasStates: false };

    expect(validateCheckout(valid, account)).toEqual({ password: REQUIRED });
    expect(validateCheckout({ ...valid, password: "short" }, account)).toEqual({
      password: MIN_8,
    });
    expect(
      validateCheckout({ ...valid, password: "password123" }, account),
    ).toEqual({});
    expect(validateCheckout({ ...valid, password: "short" }, guest)).toEqual(
      {},
    );
  });

  it("requires a state when the chosen country has states", () => {
    const withStates = { createAccount: false, countryHasStates: true };

    expect(
      validateCheckout({ ...valid, countryId: "country-de" }, withStates),
    ).toEqual({ countryStateId: "The value is required" });
    expect(
      validateCheckout(
        { ...valid, countryId: "country-de", countryStateId: "state-by" },
        withStates,
      ),
    ).toEqual({});
  });
});

describe("toBillingAddressFields", () => {
  it("maps the address fields and drops an empty state", () => {
    expect(toBillingAddressFields(valid)).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      street: "Main Street 1",
      zipcode: "12345",
      city: "Berlin",
      countryId: "country-pl",
      countryStateId: undefined,
    });
    expect(
      toBillingAddressFields({ ...valid, countryStateId: "state-by" })
        .countryStateId,
    ).toBe("state-by");
  });
});

describe("toCheckoutRegistration", () => {
  it("registers a guest without a password", () => {
    expect(
      toCheckoutRegistration({ ...valid, password: "ignored" }, false),
    ).toEqual({
      accountType: "private",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "",
      guest: true,
      billingAddress: {
        customerId: "",
        id: "",
        firstName: "Jane",
        lastName: "Doe",
        street: "Main Street 1",
        zipcode: "12345",
        city: "Berlin",
        countryId: "country-pl",
        countryStateId: undefined,
      },
      acceptedDataProtection: true,
    });
  });

  it("registers a customer account with the password", () => {
    const input = toCheckoutRegistration(
      { ...valid, password: "password123" },
      true,
    );

    expect(input.guest).toBe(false);
    expect(input.password).toBe("password123");
  });
});
