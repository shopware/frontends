import { z } from "zod";

import type { Schemas } from "#shopware";
import type { AccountType } from "@/features/account/registrationSchema";
import type { Translate } from "@/i18n/translate";

import type {
  ChangeEmailBody,
  ChangePasswordBody,
  ChangeProfileBody,
} from "./profileApi";

export type PersonalDataValues = {
  salutationId: string;
  title: string;
  accountType: AccountType;
  firstName: string;
  lastName: string;
  company: string;
  vatIds: string;
};

export type PersonalDataField = keyof PersonalDataValues;

export type PersonalDataErrors = Partial<Record<PersonalDataField, string>>;

export type ChangeEmailValues = ChangeEmailBody;

export type ChangeEmailField = keyof ChangeEmailValues;

export type ChangeEmailErrors = Partial<Record<ChangeEmailField, string>>;

export type ChangePasswordValues = ChangePasswordBody;

export type ChangePasswordField = keyof ChangePasswordValues;

export type ChangePasswordErrors = Partial<Record<ChangePasswordField, string>>;

export const emptyChangeEmailValues: ChangeEmailValues = {
  email: "",
  emailConfirmation: "",
  password: "",
};

export const emptyChangePasswordValues: ChangePasswordValues = {
  newPassword: "",
  newPasswordConfirm: "",
  password: "",
};

const PERSONAL_DATA_FIELDS: readonly PersonalDataField[] = [
  "salutationId",
  "title",
  "accountType",
  "firstName",
  "lastName",
  "company",
  "vatIds",
];

const CHANGE_EMAIL_FIELDS: readonly ChangeEmailField[] = [
  "email",
  "emailConfirmation",
  "password",
];

const CHANGE_PASSWORD_FIELDS: readonly ChangePasswordField[] = [
  "newPassword",
  "newPasswordConfirm",
  "password",
];

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function requiredString(t: Translate) {
  return z
    .string()
    .refine((value) => !isBlank(value), t("validations.required"));
}

function requiredMinLength(t: Translate, min: number) {
  return requiredString(t).min(min, t("validations.minLength", { min }));
}

export function createPersonalDataSchema(t: Translate) {
  return z
    .object({
      salutationId: z.string(),
      title: z.string(),
      accountType: z.enum(["private", "business"], t("validations.required")),
      firstName: requiredString(t),
      lastName: requiredString(t),
      company: z.string(),
      vatIds: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.accountType !== "business") return;
      for (const field of ["company", "vatIds"] as const) {
        if (isBlank(values[field])) {
          ctx.addIssue({
            code: "custom",
            message: t("validations.requiredIf"),
            path: [field],
          });
        }
      }
    });
}

export function createChangeEmailSchema(t: Translate) {
  return z
    .object({
      email: requiredString(t).pipe(z.email(t("validations.email"))),
      emailConfirmation: requiredString(t),
      password: requiredString(t),
    })
    .superRefine((values, ctx) => {
      if (
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
    });
}

export function createChangePasswordSchema(t: Translate) {
  return z
    .object({
      newPassword: requiredMinLength(t, 8),
      newPasswordConfirm: requiredString(t),
      password: requiredString(t),
    })
    .superRefine((values, ctx) => {
      if (
        !isBlank(values.newPasswordConfirm) &&
        values.newPasswordConfirm !== values.newPassword
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("validations.newPasswordConfirm"),
          path: ["newPasswordConfirm"],
        });
      }
    });
}

function firstErrors<Field extends string>(
  issues: readonly z.core.$ZodIssue[] | undefined,
  fields: readonly Field[],
): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  for (const issue of issues ?? []) {
    const field = fields.find((name) => name === issue.path[0]);
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export function validatePersonalData(
  values: PersonalDataValues,
  t: Translate,
): PersonalDataErrors {
  return firstErrors(
    createPersonalDataSchema(t).safeParse(values).error?.issues,
    PERSONAL_DATA_FIELDS,
  );
}

export function validateChangeEmail(
  values: ChangeEmailValues,
  t: Translate,
): ChangeEmailErrors {
  return firstErrors(
    createChangeEmailSchema(t).safeParse(values).error?.issues,
    CHANGE_EMAIL_FIELDS,
  );
}

export function validateChangePassword(
  values: ChangePasswordValues,
  t: Translate,
): ChangePasswordErrors {
  return firstErrors(
    createChangePasswordSchema(t).safeParse(values).error?.issues,
    CHANGE_PASSWORD_FIELDS,
  );
}

export function personalDataFromCustomer(
  customer: Schemas["Customer"],
): PersonalDataValues {
  const values: PersonalDataValues = {
    salutationId: customer.salutationId ?? "",
    title: customer.title ?? "",
    accountType: "private",
    firstName: customer.firstName ?? "",
    lastName: customer.lastName ?? "",
    company: "",
    vatIds: "",
  };
  if (customer.accountType !== "business") return values;
  return {
    ...values,
    accountType: "business",
    company: customer.company ?? "",
    vatIds: customer.vatIds?.[0] ?? "",
  };
}

export function toChangeProfileBody(
  values: PersonalDataValues,
): ChangeProfileBody {
  const base = {
    firstName: values.firstName,
    lastName: values.lastName,
    salutationId: values.salutationId,
    title: values.title,
  };
  if (values.accountType === "business") {
    return {
      ...base,
      accountType: "business",
      company: values.company,
      vatIds: [values.vatIds],
    };
  }
  return { ...base, accountType: "private" };
}
