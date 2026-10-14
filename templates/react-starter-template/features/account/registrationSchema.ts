import { z } from "zod";

import { isValidBirthday } from "@/components/form/birthday";
import type { RegistrationInput } from "@/features/session/types";
import type { Translate } from "@/i18n/translate";
import type { LoginRegistrationSettings } from "@/platform/shopware/shopSettings";

export type AccountType = "private" | "business";

export type RegistrationSettings = LoginRegistrationSettings;

export type RegistrationValues = {
  accountType: AccountType;
  salutationId: string;
  title: string;
  firstName: string;
  lastName: string;
  birthdayDay: string;
  birthdayMonth: string;
  birthdayYear: string;
  email: string;
  emailConfirmation: string;
  password: string;
  passwordConfirmation: string;
  vatId: string;
  company: string;
  street: string;
  additionalAddressLine1: string;
  additionalAddressLine2: string;
  zipcode: string;
  city: string;
  countryId: string;
  countryStateId: string;
  phoneNumber: string;
  acceptedDataProtection: boolean;
};

export type RegistrationField = keyof RegistrationValues;

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export type RegistrationSchemaOptions = {
  countryHasStates: boolean;
  settings: RegistrationSettings;
  birthYearMax: number;
};

export const emptyRegistrationValues: RegistrationValues = {
  accountType: "private",
  salutationId: "",
  title: "",
  firstName: "",
  lastName: "",
  birthdayDay: "",
  birthdayMonth: "",
  birthdayYear: "",
  email: "",
  emailConfirmation: "",
  password: "",
  passwordConfirmation: "",
  vatId: "",
  company: "",
  street: "",
  additionalAddressLine1: "",
  additionalAddressLine2: "",
  zipcode: "",
  city: "",
  countryId: "",
  countryStateId: "",
  phoneNumber: "",
  acceptedDataProtection: false,
};

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export const REGISTRATION_MIN_LENGTHS = {
  firstName: 3,
  lastName: 3,
  password: 8,
  street: 3,
} as const;

export const REGISTRATION_MAX_LENGTHS = {
  title: 100,
  phoneNumber: 40,
} as const;

const BIRTHDAY_FIELDS = [
  "birthdayDay",
  "birthdayMonth",
  "birthdayYear",
] as const;

function requiredString(t: Translate) {
  return z
    .string()
    .refine((value) => !isBlank(value), t("validations.required"));
}

function requiredMinLength(t: Translate, min: number) {
  return requiredString(t).min(min, t("validations.minLength", { min }));
}

function textField(
  t: Translate,
  {
    shown,
    required = false,
    max,
  }: { shown: boolean; required?: boolean; max?: number },
) {
  if (!shown) return z.string();
  const field = required ? requiredString(t) : z.string();
  return max === undefined
    ? field
    : field.refine(
        (value) => value.trim().length <= max,
        t("validations.maxLength", { max }),
      );
}

function passwordField(t: Translate, minLength: number) {
  return minLength > 0 ? requiredMinLength(t, minLength) : requiredString(t);
}

export function createRegistrationSchema(
  { countryHasStates, settings, birthYearMax }: RegistrationSchemaOptions,
  t: Translate,
) {
  return z
    .object({
      accountType: z.enum(["private", "business"], t("validations.required")),
      salutationId: z.string(),
      title: textField(t, {
        shown: settings.showTitleField,
        max: REGISTRATION_MAX_LENGTHS.title,
      }),
      firstName: requiredMinLength(t, REGISTRATION_MIN_LENGTHS.firstName),
      lastName: requiredMinLength(t, REGISTRATION_MIN_LENGTHS.lastName),
      birthdayDay: z.string(),
      birthdayMonth: z.string(),
      birthdayYear: z.string(),
      email: requiredString(t).pipe(z.email(t("validations.email"))),
      emailConfirmation: textField(t, {
        shown: settings.requireEmailConfirmation,
        required: true,
      }),
      password: passwordField(t, settings.passwordMinLength),
      passwordConfirmation: textField(t, {
        shown: settings.requirePasswordConfirmation,
        required: true,
      }),
      vatId: z.string(),
      company: z.string(),
      street: requiredMinLength(t, REGISTRATION_MIN_LENGTHS.street),
      additionalAddressLine1: textField(t, {
        shown: settings.showAdditionalAddressField1,
        required: settings.additionalAddressField1Required,
      }),
      additionalAddressLine2: textField(t, {
        shown: settings.showAdditionalAddressField2,
        required: settings.additionalAddressField2Required,
      }),
      zipcode: requiredString(t),
      city: requiredString(t),
      countryId: requiredString(t),
      countryStateId: z.string(),
      phoneNumber: textField(t, {
        shown: settings.showPhoneNumberField,
        required: settings.phoneNumberFieldRequired,
        max: REGISTRATION_MAX_LENGTHS.phoneNumber,
      }),
      acceptedDataProtection: settings.requireDataProtectionCheckbox
        ? z
            .boolean()
            .refine(
              (accepted) => accepted,
              t("account.registration.dataProtectionRequired"),
            )
        : z.boolean(),
    })
    .superRefine((values, ctx) => {
      if (values.accountType === "business" && isBlank(values.company)) {
        ctx.addIssue({
          code: "custom",
          message: t("validations.requiredIf"),
          path: ["company"],
        });
      }
      if (
        countryHasStates &&
        !isBlank(values.countryId) &&
        isBlank(values.countryStateId)
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("validations.requiredIf"),
          path: ["countryStateId"],
        });
      }
      if (
        settings.requireEmailConfirmation &&
        !isBlank(values.emailConfirmation) &&
        values.emailConfirmation !== values.email
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("validations.sameAs", {
            otherName: t("account.changeEmail.form.emailFieldName"),
          }),
          path: ["emailConfirmation"],
        });
      }
      if (
        settings.requirePasswordConfirmation &&
        !isBlank(values.passwordConfirmation) &&
        values.passwordConfirmation !== values.password
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("validations.newPasswordConfirm"),
          path: ["passwordConfirmation"],
        });
      }
      if (!settings.showBirthdayField) return;
      const blank = BIRTHDAY_FIELDS.filter((field) => isBlank(values[field]));
      if (blank.length === 0) {
        const valid = isValidBirthday(
          {
            day: values.birthdayDay,
            month: values.birthdayMonth,
            year: values.birthdayYear,
          },
          birthYearMax,
        );
        if (!valid) {
          ctx.addIssue({
            code: "custom",
            message: t("account.registration.birthdayInvalid"),
            path: ["birthdayDay"],
          });
        }
        return;
      }
      if (!settings.birthdayFieldRequired && blank.length === 3) return;
      const message = settings.birthdayFieldRequired
        ? t("validations.required")
        : t("account.registration.birthdayIncomplete");
      for (const field of blank) {
        ctx.addIssue({ code: "custom", message, path: [field] });
      }
    });
}

function isRegistrationField(
  key: PropertyKey | undefined,
): key is RegistrationField {
  return typeof key === "string" && key in emptyRegistrationValues;
}

export function validateRegistration(
  values: RegistrationValues,
  options: RegistrationSchemaOptions,
  t: Translate,
): RegistrationErrors {
  const result = createRegistrationSchema(options, t).safeParse(values);
  if (result.success) return {};

  const errors: RegistrationErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (isRegistrationField(field) && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export type RegistrationInputOptions = {
  settings: RegistrationSettings;
  requestedGroupId?: string;
};

function shownText(shown: boolean, value: string): string | null {
  const text = value.trim();
  return shown && text ? text : null;
}

function birthdayInput(
  values: RegistrationValues,
): Pick<RegistrationInput, "birthdayDay" | "birthdayMonth" | "birthdayYear"> {
  if (BIRTHDAY_FIELDS.some((field) => isBlank(values[field]))) return {};
  return {
    birthdayDay: Number(values.birthdayDay),
    birthdayMonth: Number(values.birthdayMonth),
    birthdayYear: Number(values.birthdayYear),
  };
}

export function toRegistrationInput(
  values: RegistrationValues,
  { settings, requestedGroupId }: RegistrationInputOptions,
): RegistrationInput {
  const business = values.accountType === "business";
  const title = shownText(settings.showTitleField, values.title);
  const additionalAddressLine1 = shownText(
    settings.showAdditionalAddressField1,
    values.additionalAddressLine1,
  );
  const additionalAddressLine2 = shownText(
    settings.showAdditionalAddressField2,
    values.additionalAddressLine2,
  );
  const phoneNumber = shownText(
    settings.showPhoneNumberField,
    values.phoneNumber,
  );

  const billingAddress: RegistrationInput["billingAddress"] = {
    id: "",
    customerId: "",
    firstName: values.firstName,
    lastName: values.lastName,
    street: values.street,
    ...(additionalAddressLine1 ? { additionalAddressLine1 } : {}),
    ...(additionalAddressLine2 ? { additionalAddressLine2 } : {}),
    zipcode: values.zipcode,
    city: values.city,
    countryId: values.countryId,
    ...(values.countryStateId ? { countryStateId: values.countryStateId } : {}),
    ...(phoneNumber ? { phoneNumber } : {}),
    ...(business ? { company: values.company } : {}),
  };

  return {
    accountType: values.accountType,
    ...(settings.showSalutation && values.salutationId
      ? { salutationId: values.salutationId }
      : {}),
    ...(title ? { title } : {}),
    firstName: values.firstName,
    lastName: values.lastName,
    ...(settings.showBirthdayField ? birthdayInput(values) : {}),
    email: values.email,
    password: values.password,
    acceptedDataProtection:
      settings.requireDataProtectionCheckbox && values.acceptedDataProtection,
    ...(business ? { vatIds: [values.vatId] } : {}),
    ...(requestedGroupId ? { requestedGroupId } : {}),
    billingAddress,
  };
}
