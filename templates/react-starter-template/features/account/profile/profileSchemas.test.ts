import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

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

const t = testTranslator();

describe("validatePersonalData", () => {
  it("accepts a private customer with a first and a last name", () => {
    expect(validatePersonalData(privateValues, t)).toEqual({});
  });

  it("requires a first and a last name that are not blank", () => {
    expect(
      validatePersonalData(
        { ...privateValues, firstName: "", lastName: "  " },
        t,
      ),
    ).toEqual({
      firstName: "Value is required",
      lastName: "Value is required",
    });
  });

  it("does not require a salutation or a title", () => {
    expect(
      validatePersonalData(
        { ...privateValues, salutationId: "", title: "" },
        t,
      ),
    ).toEqual({});
  });

  it("requires the company and the VAT id only for a business account", () => {
    expect(
      validatePersonalData({ ...privateValues, accountType: "business" }, t),
    ).toEqual({
      company: "The value is required",
      vatIds: "The value is required",
    });
    expect(
      validatePersonalData(
        {
          ...privateValues,
          accountType: "business",
          company: "Shopware AG",
          vatIds: "DE123456789",
        },
        t,
      ),
    ).toEqual({});
  });

  it("reports the business fields next to the name errors", () => {
    expect(
      validatePersonalData(
        {
          ...privateValues,
          accountType: "business",
          firstName: "",
        },
        t,
      ),
    ).toEqual({
      firstName: "Value is required",
      company: "The value is required",
      vatIds: "The value is required",
    });
  });
});

describe("validateChangeEmail", () => {
  it("requires every field", () => {
    expect(validateChangeEmail(emptyChangeEmailValues, t)).toEqual({
      email: "Value is required",
      emailConfirmation: "Value is required",
      password: "Value is required",
    });
  });

  it("rejects an invalid email address", () => {
    expect(
      validateChangeEmail(
        {
          email: "jane",
          emailConfirmation: "jane",
          password: "secret",
        },
        t,
      ),
    ).toEqual({ email: "Value is not a valid email address" });
  });

  it("requires the confirmation to match the new email", () => {
    expect(
      validateChangeEmail(
        {
          email: "new@example.com",
          emailConfirmation: "other@example.com",
          password: "secret",
        },
        t,
      ),
    ).toEqual({
      emailConfirmation: "The value must be equal to the email value",
    });
  });

  it("accepts a matching confirmation and a password", () => {
    expect(
      validateChangeEmail(
        {
          email: "new@example.com",
          emailConfirmation: "new@example.com",
          password: "secret",
        },
        t,
      ),
    ).toEqual({});
  });
});

describe("validateChangePassword", () => {
  it("requires every field", () => {
    expect(validateChangePassword(emptyChangePasswordValues, t)).toEqual({
      newPassword: "Value is required",
      newPasswordConfirm: "Value is required",
      password: "Value is required",
    });
  });

  it("requires at least eight characters for the new password", () => {
    expect(
      validateChangePassword(
        {
          newPassword: "short",
          newPasswordConfirm: "short",
          password: "old-secret",
        },
        t,
      ),
    ).toEqual({ newPassword: "This minimum length should be at least 8" });
  });

  it("requires the confirmation to match the new password", () => {
    expect(
      validateChangePassword(
        {
          newPassword: "new-secret",
          newPasswordConfirm: "new-secreT",
          password: "old-secret",
        },
        t,
      ),
    ).toEqual({ newPasswordConfirm: "The passwords needs to be the same" });
  });

  it("accepts a valid change", () => {
    expect(
      validateChangePassword(
        {
          newPassword: "new-secret",
          newPasswordConfirm: "new-secret",
          password: "old",
        },
        t,
      ),
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

describe("profile validation in Polish", () => {
  const pl = testTranslator("pl-PL");

  it("names the email field in Polish when the confirmation differs", () => {
    expect(
      validateChangeEmail(
        {
          email: "jane@example.com",
          emailConfirmation: "jane@example.org",
          password: "secret",
        },
        pl,
      ),
    ).toEqual({
      emailConfirmation: "Wartość musi być równa wartości e-mail",
    });
  });

  it("reports the Polish password and personal data messages", () => {
    expect(
      validateChangePassword(
        { newPassword: "short", newPasswordConfirm: "other", password: "" },
        pl,
      ),
    ).toEqual({
      newPassword: "Minimalna długość 8",
      newPasswordConfirm: "Hasła nie są takie same",
      password: "Wartość jest wymagana",
    });
    expect(
      validatePersonalData(
        { ...privateValues, accountType: "business", firstName: "" },
        pl,
      ),
    ).toEqual({
      firstName: "Wartość jest wymagana",
      company: "Wartość jest wymagana",
      vatIds: "Wartość jest wymagana",
    });
  });
});
