import { z } from "zod";

import type { Schemas } from "#shopware";
import type { AccountType } from "@/features/account/registrationSchema";

import type {
  ChangeEmailBody,
  ChangePasswordBody,
  ChangeProfileBody,
} from "./profileApi";

const t = {
  validations: {
    required: "Value is required",
    requiredIf: "The value is required",
    email: "Value is not a valid email address",
    minLength: "This minimum length should be at least {min}",
    sameAs: "The value must be equal to the {otherName} value",
    newPasswordConfirm: "The passwords needs to be the same",
  },
};

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

function interpolate(message: string, params: Record<string, string>): string {
  return message.replace(/\{(\w+)\}/g, (_, name: string) => params[name] ?? "");
}

function requiredString() {
  return z.string().refine((value) => !isBlank(value), t.validations.required);
}

function requiredMinLength(min: number) {
  return requiredString().min(
    min,
    interpolate(t.validations.minLength, { min: String(min) }),
  );
}

export const personalDataSchema = z
  .object({
    salutationId: z.string(),
    title: z.string(),
    accountType: z.enum(["private", "business"], t.validations.required),
    firstName: requiredString(),
    lastName: requiredString(),
    company: z.string(),
    vatIds: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.accountType !== "business") return;
    for (const field of ["company", "vatIds"] as const) {
      if (isBlank(values[field])) {
        ctx.addIssue({
          code: "custom",
          message: t.validations.requiredIf,
          path: [field],
        });
      }
    }
  });

export const changeEmailSchema = z
  .object({
    email: requiredString().pipe(z.email(t.validations.email)),
    emailConfirmation: requiredString(),
    password: requiredString(),
  })
  .superRefine((values, ctx) => {
    if (
      !isBlank(values.emailConfirmation) &&
      values.emailConfirmation !== values.email
    ) {
      ctx.addIssue({
        code: "custom",
        message: interpolate(t.validations.sameAs, { otherName: "email" }),
        path: ["emailConfirmation"],
      });
    }
  });

export const changePasswordSchema = z
  .object({
    newPassword: requiredMinLength(8),
    newPasswordConfirm: requiredString(),
    password: requiredString(),
  })
  .superRefine((values, ctx) => {
    if (
      !isBlank(values.newPasswordConfirm) &&
      values.newPasswordConfirm !== values.newPassword
    ) {
      ctx.addIssue({
        code: "custom",
        message: t.validations.newPasswordConfirm,
        path: ["newPasswordConfirm"],
      });
    }
  });

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
): PersonalDataErrors {
  return firstErrors(
    personalDataSchema.safeParse(values).error?.issues,
    PERSONAL_DATA_FIELDS,
  );
}

export function validateChangeEmail(
  values: ChangeEmailValues,
): ChangeEmailErrors {
  return firstErrors(
    changeEmailSchema.safeParse(values).error?.issues,
    CHANGE_EMAIL_FIELDS,
  );
}

export function validateChangePassword(
  values: ChangePasswordValues,
): ChangePasswordErrors {
  return firstErrors(
    changePasswordSchema.safeParse(values).error?.issues,
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
