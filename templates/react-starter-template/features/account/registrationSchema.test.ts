import { afterEach, describe, expect, it, vi } from "vitest";

import { shopSettings } from "@/platform/shopware/shopSettings.fixture";
import { testTranslator } from "@/test/i18n";

import {
  REGISTRATION_MIN_LENGTHS,
  createRegistrationSchema,
  emptyRegistrationValues,
  toRegistrationInput,
  validateRegistration,
} from "./registrationSchema";
import type {
  RegistrationSchemaOptions,
  RegistrationSettings,
  RegistrationValues,
} from "./registrationSchema";

const validPrivate: RegistrationValues = {
  ...emptyRegistrationValues,
  accountType: "private",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  password: "password123",
  street: "Main Street 1",
  zipcode: "12345",
  city: "Berlin",
  countryId: "country-de",
};

const validBusiness: RegistrationValues = {
  ...validPrivate,
  accountType: "business",
  vatId: "DE123456789",
  company: "Acme GmbH",
  countryStateId: "state-be",
};

const BIRTH_YEAR_MAX = 2026;

function settingsWith(
  overrides: Partial<RegistrationSettings> = {},
): RegistrationSettings {
  return shopSettings({ loginRegistration: overrides }).loginRegistration;
}

const defaults = settingsWith();

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

function optionsWith(
  settings: RegistrationSettings,
  countryHasStates = false,
): RegistrationSchemaOptions {
  return { countryHasStates, settings, birthYearMax: BIRTH_YEAR_MAX };
}

const noStates = optionsWith(defaults);
const withStates = optionsWith(defaults, true);
const withDefaults = { settings: defaults };

const t = testTranslator();

afterEach(() => {
  vi.useRealTimers();
});

describe("validateRegistration", () => {
  it("accepts a complete private registration", () => {
    expect(validateRegistration(validPrivate, noStates, t)).toEqual({});
  });

  it("accepts a complete business registration with a state", () => {
    expect(validateRegistration(validBusiness, withStates, t)).toEqual({});
  });

  it("requires every mandatory field with the Vue message", () => {
    const errors = validateRegistration(emptyRegistrationValues, noStates, t);

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
      t,
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
      t,
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
      t,
    );

    expect(errors.email).toBe("Value is not a valid email address");
  });

  it("never reports the optional VAT id", () => {
    expect(
      validateRegistration({ ...validBusiness, vatId: "" }, noStates, t),
    ).toEqual({});
    expect(
      validateRegistration({ ...validPrivate, vatId: "" }, noStates, t),
    ).toEqual({});
  });

  it("requires the company only for business accounts", () => {
    expect(
      validateRegistration({ ...validPrivate, company: "" }, noStates, t),
    ).toEqual({});
    expect(
      validateRegistration({ ...validBusiness, company: "" }, noStates, t),
    ).toEqual({ company: "The value is required" });
    expect(
      validateRegistration({ ...validBusiness, company: "  " }, noStates, t),
    ).toEqual({ company: "The value is required" });
  });

  it("requires the state only when the chosen country has states", () => {
    const withoutState = { ...validPrivate, countryStateId: "" };

    expect(validateRegistration(withoutState, noStates, t)).toEqual({});
    expect(validateRegistration(withoutState, withStates, t)).toEqual({
      countryStateId: "The value is required",
    });
    expect(
      validateRegistration({ ...withoutState, countryId: "" }, withStates, t),
    ).toEqual({ countryId: "Value is required" });
  });

  it("reports the first message per field", () => {
    const schema = createRegistrationSchema(noStates, t);
    const result = schema.safeParse({ ...validPrivate, firstName: "" });

    expect(result.success).toBe(false);
    const messages = result.error?.issues
      .filter((issue) => issue.path[0] === "firstName")
      .map((issue) => issue.message);
    expect(messages?.[0]).toBe("Value is required");
    expect(
      validateRegistration({ ...validPrivate, firstName: "" }, noStates, t)
        .firstName,
    ).toBe("Value is required");
  });
});

describe("toRegistrationInput", () => {
  it("builds the private Store API body without business keys or a consent nobody gave", () => {
    const input = toRegistrationInput(validPrivate, withDefaults);

    expect(input).toEqual({
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
        city: "Berlin",
        countryId: "country-de",
      },
    });
    expect("vatIds" in input).toBe(false);
    expect("company" in input.billingAddress).toBe(false);
    expect("countryStateId" in input.billingAddress).toBe(false);
  });

  it("builds the business Store API body with VAT id, company and state", () => {
    const input = toRegistrationInput(validBusiness, withDefaults);

    expect(input.accountType).toBe("business");
    expect(input.vatIds).toEqual(["DE123456789"]);
    expect(input.billingAddress.company).toBe("Acme GmbH");
    expect(input.billingAddress.countryStateId).toBe("state-be");
    expect(input.acceptedDataProtection).toBe(false);
  });

  it("sends an empty VAT id entry for a business without one", () => {
    expect(
      toRegistrationInput({ ...validBusiness, vatId: "" }, withDefaults).vatIds,
    ).toEqual([""]);
  });

  it("requests the customer group of a group registration page", () => {
    expect(
      toRegistrationInput(validPrivate, {
        ...withDefaults,
        requestedGroupId: "group-b2b",
      }),
    ).toEqual({
      ...toRegistrationInput(validPrivate, withDefaults),
      requestedGroupId: "group-b2b",
    });
  });

  it("leaves requestedGroupId out without a group", () => {
    expect(
      "requestedGroupId" in toRegistrationInput(validPrivate, withDefaults),
    ).toBe(false);
    expect(
      "requestedGroupId" in
        toRegistrationInput(validPrivate, {
          ...withDefaults,
          requestedGroupId: "",
        }),
    ).toBe(false);
  });

  it("keeps company and VAT id in a business body that requests a group", () => {
    const input = toRegistrationInput(validBusiness, {
      ...withDefaults,
      requestedGroupId: "group-b2b",
    });

    expect(input.requestedGroupId).toBe("group-b2b");
    expect(input.accountType).toBe("business");
    expect(input.vatIds).toEqual(["DE123456789"]);
    expect(input.billingAddress.company).toBe("Acme GmbH");
  });
});

describe("validateRegistration in German", () => {
  it("reports the German validation messages", () => {
    const de = testTranslator("de-DE");

    const errors = validateRegistration(
      { ...validBusiness, company: "", password: "short", email: "jane" },
      noStates,
      de,
    );

    expect(errors).toEqual({
      company: "Der Wert ist erforderlich",
      password: "Mindestlänge 8",
      email: "Der Wert ist keine gültige E-Mail-Adresse",
    });
  });
});

const completeEveryField: RegistrationValues = {
  ...validPrivate,
  password: "password-12345",
  salutationId: "salutation-mrs",
  title: "  Dr.  ",
  birthdayDay: "29",
  birthdayMonth: "2",
  birthdayYear: "2000",
  emailConfirmation: "jane.doe@example.com",
  passwordConfirmation: "password-12345",
  additionalAddressLine1: " Building B ",
  additionalAddressLine2: " Floor 3 ",
  phoneNumber: " +49 30 123456 ",
  acceptedDataProtection: true,
};

describe("validateRegistration with the shop settings", () => {
  it("keeps the template minimum of 8 characters for the password by default", () => {
    expect(defaults.passwordMinLength).toBe(REGISTRATION_MIN_LENGTHS.password);
    expect(
      validateRegistration(
        { ...validPrivate, password: "1234567" },
        noStates,
        t,
      ).password,
    ).toBe("This minimum length should be at least 8");
  });

  it("takes the password minimum from the shop settings", () => {
    const twelve = optionsWith(settingsWith({ passwordMinLength: 12 }));

    expect(
      validateRegistration(
        { ...validPrivate, password: "password123" },
        twelve,
        t,
      ).password,
    ).toBe("This minimum length should be at least 12");
    expect(
      validateRegistration(
        { ...validPrivate, password: "password1234" },
        twelve,
        t,
      ),
    ).toEqual({});
  });

  it("only requires a password when the minimum is 0", () => {
    const none = optionsWith(settingsWith({ passwordMinLength: 0 }));

    expect(
      validateRegistration({ ...validPrivate, password: "a" }, none, t),
    ).toEqual({});
    expect(
      validateRegistration({ ...validPrivate, password: " " }, none, t)
        .password,
    ).toBe("Value is required");
  });

  it("accepts a complete registration with every field the shop can ask for", () => {
    expect(
      validateRegistration(completeEveryField, optionsWith(everyField), t),
    ).toEqual({});
  });

  it("requires every field the shop marks as required", () => {
    const errors = validateRegistration(
      validPrivate,
      optionsWith(everyField),
      t,
    );

    expect(errors).toEqual({
      birthdayDay: "Value is required",
      birthdayMonth: "Value is required",
      birthdayYear: "Value is required",
      emailConfirmation: "Value is required",
      password: "This minimum length should be at least 12",
      passwordConfirmation: "Value is required",
      additionalAddressLine1: "Value is required",
      additionalAddressLine2: "Value is required",
      phoneNumber: "Value is required",
      acceptedDataProtection:
        "Please confirm that you have read the data protection information.",
    });
  });

  it("asks for nothing the shop does not show", () => {
    expect(
      validateRegistration(
        {
          ...validPrivate,
          title: "x".repeat(101),
          phoneNumber: "1".repeat(41),
          emailConfirmation: "other@example.com",
          passwordConfirmation: "other",
          birthdayDay: "31",
        },
        noStates,
        t,
      ),
    ).toEqual({});
  });

  it("reports a confirmation that differs from the email or the password", () => {
    const confirmations = optionsWith(
      settingsWith({
        requireEmailConfirmation: true,
        requirePasswordConfirmation: true,
      }),
    );
    const mismatch = {
      ...validPrivate,
      emailConfirmation: "jane@example.com",
      passwordConfirmation: "password124",
    };

    expect(validateRegistration(mismatch, confirmations, t)).toEqual({
      emailConfirmation: "The value must be equal to the email value",
      passwordConfirmation: "The passwords needs to be the same",
    });
    expect(
      validateRegistration(mismatch, confirmations, testTranslator("de-DE")),
    ).toEqual({
      emailConfirmation: "Der Wert muss dem Wert E-Mail entsprechen",
      passwordConfirmation: "Die Passwörter stimmen nicht überein",
    });
  });

  it("requires the data protection checkbox only with the setting", () => {
    const checkbox = optionsWith(
      settingsWith({ requireDataProtectionCheckbox: true }),
    );

    expect(
      validateRegistration(validPrivate, checkbox, t).acceptedDataProtection,
    ).toBe(
      "Please confirm that you have read the data protection information.",
    );
    expect(
      validateRegistration(
        { ...validPrivate, acceptedDataProtection: true },
        checkbox,
        t,
      ),
    ).toEqual({});
    expect(validateRegistration(validPrivate, noStates, t)).toEqual({});
  });

  it("limits the title to 100 and the phone number to 40 characters", () => {
    const optional = optionsWith(
      settingsWith({ showTitleField: true, showPhoneNumberField: true }),
    );

    expect(
      validateRegistration(
        {
          ...validPrivate,
          title: "x".repeat(101),
          phoneNumber: "1".repeat(41),
        },
        optional,
        t,
      ),
    ).toEqual({
      title: "The maximum length allowed is 100",
      phoneNumber: "The maximum length allowed is 40",
    });
    expect(
      validateRegistration(
        {
          ...validPrivate,
          title: "x".repeat(100),
          phoneNumber: "1".repeat(40),
        },
        optional,
        t,
      ),
    ).toEqual({});
  });

  it("leaves the shown optional fields optional", () => {
    const optional = optionsWith(
      settingsWith({
        showTitleField: true,
        showPhoneNumberField: true,
        showAdditionalAddressField1: true,
        showAdditionalAddressField2: true,
        showBirthdayField: true,
      }),
    );

    expect(validateRegistration(validPrivate, optional, t)).toEqual({});
  });
});

describe("validateRegistration of the birthday", () => {
  const optional = optionsWith(settingsWith({ showBirthdayField: true }));
  const required = optionsWith(
    settingsWith({ showBirthdayField: true, birthdayFieldRequired: true }),
  );

  function birthday(day: string, month: string, year: string) {
    return {
      ...validPrivate,
      birthdayDay: day,
      birthdayMonth: month,
      birthdayYear: year,
    };
  }

  it("allows an empty optional birthday", () => {
    expect(validateRegistration(birthday("", "", ""), optional, t)).toEqual({});
  });

  it("asks for the missing parts of a partial optional birthday", () => {
    expect(validateRegistration(birthday("12", "", ""), optional, t)).toEqual({
      birthdayMonth:
        "Enter the full date of birth or leave all three fields empty.",
      birthdayYear:
        "Enter the full date of birth or leave all three fields empty.",
    });
  });

  it("requires every part of a required birthday", () => {
    expect(validateRegistration(birthday("", "5", ""), required, t)).toEqual({
      birthdayDay: "Value is required",
      birthdayYear: "Value is required",
    });
  });

  it("rejects a date that does not exist on the day field", () => {
    expect(
      validateRegistration(birthday("31", "2", "2000"), optional, t),
    ).toEqual({ birthdayDay: "Enter a valid date of birth." });
    expect(
      validateRegistration(birthday("29", "2", "2001"), required, t),
    ).toEqual({ birthdayDay: "Enter a valid date of birth." });
    expect(
      validateRegistration(birthday("29", "2", "2000"), required, t),
    ).toEqual({});
  });

  it("rejects a year outside 1900 to the newest year offered", () => {
    expect(
      validateRegistration(birthday("1", "1", "1899"), optional, t),
    ).toEqual({ birthdayDay: "Enter a valid date of birth." });
    expect(
      validateRegistration(birthday("1", "1", "2027"), optional, t),
    ).toEqual({ birthdayDay: "Enter a valid date of birth." });
  });

  it("rejects a date after today", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 14, 12));

    expect(
      validateRegistration(birthday("14", "10", "2026"), required, t),
    ).toEqual({});
    expect(
      validateRegistration(birthday("15", "10", "2026"), required, t),
    ).toEqual({ birthdayDay: "Enter a valid date of birth." });
  });
});

describe("toRegistrationInput with the shop settings", () => {
  it("sends every shown field, trimmed, with the birthday as numbers and never the confirmations", () => {
    const input = toRegistrationInput(completeEveryField, {
      settings: everyField,
    });

    expect(input).toEqual({
      accountType: "private",
      salutationId: "salutation-mrs",
      title: "Dr.",
      firstName: "Jane",
      lastName: "Doe",
      birthdayDay: 29,
      birthdayMonth: 2,
      birthdayYear: 2000,
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
        city: "Berlin",
        countryId: "country-de",
        phoneNumber: "+49 30 123456",
      },
    });
    expect("emailConfirmation" in input).toBe(false);
    expect("passwordConfirmation" in input).toBe(false);
  });

  it("sends no field the shop does not show and no consent it did not ask for", () => {
    expect(toRegistrationInput(completeEveryField, withDefaults)).toEqual({
      ...toRegistrationInput(validPrivate, withDefaults),
      password: "password-12345",
    });
  });

  it("sends the consent the customer gave and false without a tick", () => {
    const checkbox = settingsWith({ requireDataProtectionCheckbox: true });

    expect(
      toRegistrationInput(
        { ...validPrivate, acceptedDataProtection: true },
        { settings: checkbox },
      ).acceptedDataProtection,
    ).toBe(true);
    expect(
      toRegistrationInput(validPrivate, { settings: checkbox })
        .acceptedDataProtection,
    ).toBe(false);
  });

  it("leaves out blank optional fields and an incomplete birthday", () => {
    const input = toRegistrationInput(
      {
        ...validPrivate,
        title: "  ",
        phoneNumber: " ",
        birthdayDay: "1",
        birthdayMonth: "1",
      },
      { settings: everyField },
    );

    expect(input).not.toHaveProperty("title");
    expect(input).not.toHaveProperty("salutationId");
    expect(input).not.toHaveProperty("birthdayDay");
    expect(input).not.toHaveProperty("birthdayYear");
    expect(input.billingAddress).not.toHaveProperty("phoneNumber");
    expect(input.billingAddress).not.toHaveProperty("additionalAddressLine1");
  });
});
