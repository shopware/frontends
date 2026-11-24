import { z } from "zod";

import type { Translate } from "@/i18n/translate";

export type LoginValues = { username: string; password: string };

export type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export const emptyLoginValues: LoginValues = { username: "", password: "" };

const PASSWORD_MIN_LENGTH = 3;

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

const required = (value: string) => !isBlank(value);

export function createLoginSchema(t: Translate) {
  return z.object({
    username: z
      .string()
      .refine(required, t("validations.required"))
      .pipe(z.email(t("validations.email"))),
    password: z
      .string()
      .refine(required, t("validations.required"))
      .min(
        PASSWORD_MIN_LENGTH,
        t("validations.minLength", { min: PASSWORD_MIN_LENGTH }),
      ),
  });
}

export function validateLogin(values: LoginValues, t: Translate): LoginErrors {
  const result = createLoginSchema(t).safeParse(values);
  if (result.success) return {};

  const errors: LoginErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === "username" || field === "password") {
      errors[field] ??= issue.message;
    }
  }
  return errors;
}
