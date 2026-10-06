import { describe, expect, it } from "vitest";

import { businessCustomer, profileCustomer } from "./profile.fixture";
import {
  emptyChangeEmailValues,
  emptyChangePasswordValues,
  personalDataFromCustomer,
  toChangeProfileBody,
  validateChangeEmail,
  validateChangePassword,
  validatePersonalData,
} from "./profileSchemas";
import type { PersonalDataValues } from "./profileSchemas";

const privateValues: PersonalDataValues = {
  salutationId: "salutation-mr",
  title: "",
  accountType: "private",
  firstName: "Jane",
  lastName: "Doe",
  company: "",
  vatIds: "",
};

describe("validatePersonalData", () => {
  it("accepts a private customer with a first and a last name", () => {
    expect(validatePersonalData(privateValues)).toEqual({});
  });

  it("requires a first and a last name that are not blank", () => {
    expect(
      validatePersonalData({ ...privateValues, firstName: "", lastName: "  " }),
    ).toEqual({
      firstName: "Value is required",
      lastName: "Value is required",
    });
  });

  it("does not require a salutation or a title", () => {
    expect(
      validatePersonalData({ ...privateValues, salutationId: "", title: "" }),
    ).toEqual({});
  });

  it("requires the company and the VAT id only for a business account", () => {
    expect(
      validatePersonalData({ ...privateValues, accountType: "business" }),
    ).toEqual({
      company: "The value is required",
      vatIds: "The value is required",
    });
    expect(
      validatePersonalData({
        ...privateValues,
        accountType: "business",
        company: "Shopware AG",
        vatIds: "DE123456789",
      }),
    ).toEqual({});
  });

  it("reports the business fields next to the name errors", () => {
    expect(
      validatePersonalData({
        ...privateValues,
        accountType: "business",
        firstName: "",
      }),
    ).toEqual({
      firstName: "Value is required",
      company: "The value is required",
      vatIds: "The value is required",
    });
  });
});

describe("validateChangeEmail", () => {
  it("requires every field", () => {
    expect(validateChangeEmail(emptyChangeEmailValues)).toEqual({
      email: "Value is required",
      emailConfirmation: "Value is required",
      password: "Value is required",
    });
  });

  it("rejects an invalid email address", () => {
    expect(
      validateChangeEmail({
        email: "jane",
        emailConfirmation: "jane",
        password: "secret",
      }),
    ).toEqual({ email: "Value is not a valid email address" });
  });

  it("requires the confirmation to match the new email", () => {
    expect(
      validateChangeEmail({
        email: "new@example.com",
        emailConfirmation: "other@example.com",
        password: "secret",
      }),
    ).toEqual({
      emailConfirmation: "The value must be equal to the email value",
    });
  });

  it("accepts a matching confirmation and a password", () => {
    expect(
      validateChangeEmail({
        email: "new@example.com",
        emailConfirmation: "new@example.com",
        password: "secret",
      }),
    ).toEqual({});
  });
});

describe("validateChangePassword", () => {
  it("requires every field", () => {
    expect(validateChangePassword(emptyChangePasswordValues)).toEqual({
      newPassword: "Value is required",
      newPasswordConfirm: "Value is required",
      password: "Value is required",
    });
  });

  it("requires at least eight characters for the new password", () => {
    expect(
      validateChangePassword({
        newPassword: "short",
        newPasswordConfirm: "short",
        password: "old-secret",
      }),
    ).toEqual({ newPassword: "This minimum length should be at least 8" });
  });

  it("requires the confirmation to match the new password", () => {
    expect(
      validateChangePassword({
        newPassword: "new-secret",
        newPasswordConfirm: "new-secreT",
        password: "old-secret",
      }),
    ).toEqual({ newPasswordConfirm: "The passwords needs to be the same" });
  });

  it("accepts a valid change", () => {
    expect(
      validateChangePassword({
        newPassword: "new-secret",
        newPasswordConfirm: "new-secret",
        password: "old",
      }),
    ).toEqual({});
  });
});

describe("personalDataFromCustomer", () => {
  it("prefills a private customer and leaves the business fields empty", () => {
    expect(
      personalDataFromCustomer(
        profileCustomer({ title: "Dr.", company: "Ignored" }),
      ),
    ).toEqual({
      salutationId: "salutation-mr",
      title: "Dr.",
      accountType: "private",
      firstName: "Jane",
      lastName: "Doe",
      company: "",
      vatIds: "",
    });
  });

  it("prefills the company and the first VAT id of a business customer", () => {
    expect(
      personalDataFromCustomer(
        businessCustomer({ vatIds: ["DE1", "DE2"], title: undefined }),
      ),
    ).toEqual({
      salutationId: "salutation-mr",
      title: "",
      accountType: "business",
      firstName: "Jane",
      lastName: "Doe",
      company: "Shopware AG",
      vatIds: "DE1",
    });
  });

  it("copes with a business customer without VAT ids or salutation", () => {
    const values = personalDataFromCustomer(
      businessCustomer({ vatIds: null, company: null, salutationId: null }),
    );

    expect(values.vatIds).toBe("");
    expect(values.company).toBe("");
    expect(values.salutationId).toBe("");
  });
});

describe("toChangeProfileBody", () => {
  it("sends the names, salutation, title and the private account type", () => {
    expect(toChangeProfileBody({ ...privateValues, company: "Stale" })).toEqual(
      {
        firstName: "Jane",
        lastName: "Doe",
        salutationId: "salutation-mr",
        title: "",
        accountType: "private",
      },
    );
  });

  it("adds the company and the VAT id for a business account", () => {
    expect(
      toChangeProfileBody({
        ...privateValues,
        accountType: "business",
        company: "Shopware AG",
        vatIds: "DE123456789",
      }),
    ).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      salutationId: "salutation-mr",
      title: "",
      accountType: "business",
      company: "Shopware AG",
      vatIds: ["DE123456789"],
    });
  });
});
