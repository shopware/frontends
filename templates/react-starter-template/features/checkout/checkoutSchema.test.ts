import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

import {
  emptyCheckoutAddressValues,
  emptyCheckoutValues,
  toBillingAddressFields,
  toCheckoutAddressFields,
  toCheckoutRegistration,
  validateCheckout,
  validateCheckoutAddress,
} from "./checkoutSchema";
import type { CheckoutAddressValues, CheckoutValues } from "./checkoutSchema";

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

const guest = {
  createAccount: false,
  countryHasStates: false,
  passwordMinLength: 8,
};

const shipping: CheckoutAddressValues = {
  firstName: "John",
  lastName: "Smith",
  street: "Harbour Road 7",
  zipcode: "20095",
  city: "Hamburg",
  countryId: "country-de",
  countryStateId: "state-hh",
};

const t = testTranslator();

describe("validateCheckout", () => {
  it("accepts a complete guest address without a password", () => {
    expect(validateCheckout(valid, guest, t)).toEqual({});
  });

  it("requires every customer and address field except the password and state", () => {
    expect(validateCheckout(emptyCheckoutValues, guest, t)).toEqual({
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
      validateCheckout({ ...valid, city: "   ", zipcode: " " }, guest, t),
    ).toEqual({ city: REQUIRED, zipcode: REQUIRED });
  });

  it("rejects an invalid email address", () => {
    expect(validateCheckout({ ...valid, email: "jane@" }, guest, t)).toEqual({
      email: "Value is not a valid email address",
    });
  });

  it("needs at least three characters for the names and the street", () => {
    expect(
      validateCheckout(
        { ...valid, firstName: "Jo", lastName: "Do", street: "St" },
        guest,
        t,
      ),
    ).toEqual({ firstName: MIN_3, lastName: MIN_3, street: MIN_3 });
  });

  it("requires a password of eight characters only when an account is created", () => {
    const account = { ...guest, createAccount: true };

    expect(validateCheckout(valid, account, t)).toEqual({ password: REQUIRED });
    expect(
      validateCheckout({ ...valid, password: "short" }, account, t),
    ).toEqual({
      password: MIN_8,
    });
    expect(
      validateCheckout({ ...valid, password: "password123" }, account, t),
    ).toEqual({});
    expect(validateCheckout({ ...valid, password: "short" }, guest, t)).toEqual(
      {},
    );
  });

  it("uses the password minimum of the shop", () => {
    const account = { ...guest, createAccount: true, passwordMinLength: 12 };

    expect(
      validateCheckout({ ...valid, password: "password123" }, account, t),
    ).toEqual({ password: "This minimum length should be at least 12" });
    expect(
      validateCheckout({ ...valid, password: "password1234" }, account, t),
    ).toEqual({});
  });

  it("requires a state when the chosen country has states", () => {
    const withStates = { ...guest, countryHasStates: true };

    expect(
      validateCheckout({ ...valid, countryId: "country-de" }, withStates, t),
    ).toEqual({ countryStateId: "The value is required" });
    expect(
      validateCheckout(
        { ...valid, countryId: "country-de", countryStateId: "state-by" },
        withStates,
        t,
      ),
    ).toEqual({});
  });
});

describe("validateCheckout in other locales", () => {
  it("returns Polish messages with the Polish translator", () => {
    expect(
      validateCheckout(
        { ...valid, email: "", firstName: "Jo" },
        guest,
        testTranslator("pl-PL"),
      ),
    ).toEqual({
      email: "Wartość jest wymagana",
      firstName: "Minimalna długość 3",
    });
    expect(
      validateCheckout(
        { ...valid, email: "jane@" },
        guest,
        testTranslator("pl-PL"),
      ),
    ).toEqual({ email: "Wartość nie jest prawidłowym adresem e-mail" });
  });

  it("returns German messages with the German translator", () => {
    expect(
      validateCheckout(
        { ...valid, countryId: "country-de", password: "short" },
        { createAccount: true, countryHasStates: true, passwordMinLength: 8 },
        testTranslator("de-DE"),
      ),
    ).toEqual({
      password: "Mindestlänge 8",
      countryStateId: "Der Wert ist erforderlich",
    });
  });
});

describe("validateCheckoutAddress", () => {
  it("accepts a complete address", () => {
    expect(
      validateCheckoutAddress(shipping, { countryHasStates: true }, t),
    ).toEqual({});
  });

  it("applies the billing address rules to every field", () => {
    expect(
      validateCheckoutAddress(
        emptyCheckoutAddressValues,
        { countryHasStates: true },
        t,
      ),
    ).toEqual({
      firstName: REQUIRED,
      lastName: REQUIRED,
      street: REQUIRED,
      zipcode: REQUIRED,
      city: REQUIRED,
      countryId: REQUIRED,
      countryStateId: "The value is required",
    });
    expect(
      validateCheckoutAddress(
        { ...shipping, firstName: "Jo", street: "St", countryStateId: "" },
        { countryHasStates: false },
        t,
      ),
    ).toEqual({ firstName: MIN_3, street: MIN_3 });
  });

  it("returns Polish messages with the Polish translator", () => {
    expect(
      validateCheckoutAddress(
        { ...shipping, city: " " },
        { countryHasStates: true },
        testTranslator("pl-PL"),
      ),
    ).toEqual({ city: "Wartość jest wymagana" });
  });
});

describe("toCheckoutAddressFields", () => {
  it("maps an address and keeps its state", () => {
    expect(toCheckoutAddressFields(shipping)).toEqual({
      firstName: "John",
      lastName: "Smith",
      street: "Harbour Road 7",
      zipcode: "20095",
      city: "Hamburg",
      countryId: "country-de",
      countryStateId: "state-hh",
    });
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
      toCheckoutRegistration(
        { ...valid, password: "ignored" },
        { createAccount: false, acceptedDataProtection: false },
      ),
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
      acceptedDataProtection: false,
    });
  });

  it("registers a customer account with the password", () => {
    const input = toCheckoutRegistration(
      { ...valid, password: "password123" },
      { createAccount: true, acceptedDataProtection: false },
    );

    expect(input.guest).toBe(false);
    expect(input.password).toBe("password123");
  });

  it("sends the data protection consent it is given", () => {
    expect(
      toCheckoutRegistration(valid, {
        createAccount: false,
        acceptedDataProtection: true,
      }).acceptedDataProtection,
    ).toBe(true);
  });

  it("adds a separate shipping address only when there is one", () => {
    const withShipping = toCheckoutRegistration(valid, {
      createAccount: false,
      acceptedDataProtection: false,
      shippingAddress: shipping,
    });

    expect(withShipping.shippingAddress).toEqual({
      customerId: "",
      id: "",
      firstName: "John",
      lastName: "Smith",
      street: "Harbour Road 7",
      zipcode: "20095",
      city: "Hamburg",
      countryId: "country-de",
      countryStateId: "state-hh",
    });
    expect(withShipping.billingAddress.street).toBe("Main Street 1");
    expect(
      toCheckoutRegistration(valid, {
        createAccount: false,
        acceptedDataProtection: false,
        shippingAddress: null,
      }),
    ).not.toHaveProperty("shippingAddress");
    expect(
      toCheckoutRegistration(valid, {
        createAccount: false,
        acceptedDataProtection: false,
      }),
    ).not.toHaveProperty("shippingAddress");
  });
});
