import { z } from "zod";

import { REGISTRATION_MIN_LENGTHS } from "@/features/account/registrationSchema";
import type { Translate } from "@/i18n/translate";

export const RESET_PASSWORD_MIN_LENGTH = REGISTRATION_MIN_LENGTHS.password;

export type RecoverRequestValues = { email: string };

export type RecoverRequestField = keyof RecoverRequestValues;

export type ResetPasswordValues = {
  newPassword: string;
  newPasswordConfirm: string;
};

export type ResetPasswordField = keyof ResetPasswordValues;

export const emptyRecoverRequestValues: RecoverRequestValues = { email: "" };

export const emptyResetPasswordValues: ResetPasswordValues = {
  newPassword: "",
  newPasswordConfirm: "",
};

const RECOVER_REQUEST_FIELDS: readonly RecoverRequestField[] = ["email"];

const RESET_PASSWORD_FIELDS: readonly ResetPasswordField[] = [
  "newPassword",
  "newPasswordConfirm",
];

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function requiredString(t: Translate) {
  return z
    .string()
    .refine((value) => !isBlank(value), t("validations.required"));
}

export function createRecoverRequestSchema(t: Translate) {
  return z.object({
    email: requiredString(t).pipe(z.email(t("validations.email"))),
  });
}

export function createResetPasswordSchema(
  t: Translate,
  minLength: number = RESET_PASSWORD_MIN_LENGTH,
) {
  return z
    .object({
      newPassword: requiredString(t).min(
        minLength,
        t("validations.minLength", { min: minLength }),
      ),
      newPasswordConfirm: requiredString(t),
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

export function validateRecoverRequest(
  values: RecoverRequestValues,
  t: Translate,
): Partial<Record<RecoverRequestField, string>> {
  return firstErrors(
    createRecoverRequestSchema(t).safeParse(values).error?.issues,
    RECOVER_REQUEST_FIELDS,
  );
}

export function validateResetPassword(
  values: ResetPasswordValues,
  t: Translate,
  minLength: number = RESET_PASSWORD_MIN_LENGTH,
): Partial<Record<ResetPasswordField, string>> {
  return firstErrors(
    createResetPasswordSchema(t, minLength).safeParse(values).error?.issues,
    RESET_PASSWORD_FIELDS,
  );
}
