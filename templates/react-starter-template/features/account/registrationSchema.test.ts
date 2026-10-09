import { describe, expect, it } from "vitest";

import {
  createRegistrationSchema,
  emptyRegistrationValues,
  toRegistrationInput,
  validateRegistration,
} from "./registrationSchema";
import type { RegistrationValues } from "./registrationSchema";

const validPrivate: RegistrationValues = {
  accountType: "private",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  password: "password123",
  vatId: "",
  company: "",
  street: "Main Street 1",
  zipcode: "12345",
  city: "Berlin",
  countryId: "country-de",
  countryStateId: "",
};

const validBusiness: RegistrationValues = {
  ...validPrivate,
  accountType: "business",
  vatId: "DE123456789",
  company: "Acme GmbH",
  countryStateId: "state-be",
};

const noStates = { countryHasStates: false };
const withStates = { countryHasStates: true };

describe("validateRegistration", () => {
  it("accepts a complete private registration", () => {
    expect(validateRegistration(validPrivate, noStates)).toEqual({});
  });

  it("accepts a complete business registration with a state", () => {
    expect(validateRegistration(validBusiness, withStates)).toEqual({});
  });

  it("requires every mandatory field with the Vue message", () => {
    const errors = validateRegistration(emptyRegistrationValues, noStates);

    expect(errors).toEqual({
      firstName: "Value is required",
      lastName: "Value is required",
      email: "Value is required",
      password: "Value is required",
      street: "Value is required",
      zipcode: "Value is required",
      city: "Value is required",
      countryId: "Value is required",
    });
  });

  it("treats whitespace-only values as missing", () => {
    const errors = validateRegistration(
      { ...validPrivate, firstName: "   ", city: " " },
      noStates,
    );

    expect(errors.firstName).toBe("Value is required");
    expect(errors.city).toBe("Value is required");
  });

  it("interpolates the minimum length into the message", () => {
    const errors = validateRegistration(
      {
        ...validPrivate,
        firstName: "Jo",
        lastName: "Li",
        password: "short",
        street: "A1",
      },
      noStates,
    );

    expect(errors.firstName).toBe("This minimum length should be at least 3");
    expect(errors.lastName).toBe("This minimum length should be at least 3");
    expect(errors.password).toBe("This minimum length should be at least 8");
    expect(errors.street).toBe("This minimum length should be at least 3");
  });

  it("rejects a malformed email address", () => {
    const errors = validateRegistration(
      { ...validPrivate, email: "jane.doe" },
      noStates,
    );

    expect(errors.email).toBe("Value is not a valid email address");
  });

  it("never reports the optional VAT id", () => {
    expect(
      validateRegistration({ ...validBusiness, vatId: "" }, noStates),
    ).toEqual({});
    expect(
      validateRegistration({ ...validPrivate, vatId: "" }, noStates),
    ).toEqual({});
  });

  it("requires the company only for business accounts", () => {
    expect(
      validateRegistration({ ...validPrivate, company: "" }, noStates),
    ).toEqual({});
    expect(
      validateRegistration({ ...validBusiness, company: "" }, noStates),
    ).toEqual({ company: "The value is required" });
    expect(
      validateRegistration({ ...validBusiness, company: "  " }, noStates),
    ).toEqual({ company: "The value is required" });
  });

  it("requires the state only when the chosen country has states", () => {
    const withoutState = { ...validPrivate, countryStateId: "" };

    expect(validateRegistration(withoutState, noStates)).toEqual({});
    expect(validateRegistration(withoutState, withStates)).toEqual({
      countryStateId: "The value is required",
    });
    expect(
      validateRegistration({ ...withoutState, countryId: "" }, withStates),
    ).toEqual({ countryId: "Value is required" });
  });

  it("reports the first message per field", () => {
    const schema = createRegistrationSchema(noStates);
    const result = schema.safeParse({ ...validPrivate, firstName: "" });

    expect(result.success).toBe(false);
    const messages = result.error?.issues
      .filter((issue) => issue.path[0] === "firstName")
      .map((issue) => issue.message);
    expect(messages?.[0]).toBe("Value is required");
    expect(
      validateRegistration({ ...validPrivate, firstName: "" }, noStates)
        .firstName,
    ).toBe("Value is required");
  });
});

describe("toRegistrationInput", () => {
  it("builds the private Store API body without business keys", () => {
    const input = toRegistrationInput(validPrivate);

    expect(input).toEqual({
      accountType: "private",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      acceptedDataProtection: true,
      billingAddress: {
        id: "",
        customerId: "",
        firstName: "Jane",
        lastName: "Doe",
        street: "Main Street 1",
        zipcode: "12345",
        city: "Berlin",
        countryId: "country-de",
      },
    });
    expect("vatIds" in input).toBe(false);
    expect("company" in input.billingAddress).toBe(false);
    expect("countryStateId" in input.billingAddress).toBe(false);
  });

  it("builds the business Store API body with VAT id, company and state", () => {
    const input = toRegistrationInput(validBusiness);

    expect(input.accountType).toBe("business");
    expect(input.vatIds).toEqual(["DE123456789"]);
    expect(input.billingAddress.company).toBe("Acme GmbH");
    expect(input.billingAddress.countryStateId).toBe("state-be");
    expect(input.acceptedDataProtection).toBe(true);
  });

  it("sends an empty VAT id entry for a business without one", () => {
    expect(toRegistrationInput({ ...validBusiness, vatId: "" }).vatIds).toEqual(
      [""],
    );
  });
});
