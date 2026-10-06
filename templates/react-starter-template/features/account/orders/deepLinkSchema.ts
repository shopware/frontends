import { z } from "zod";

import type { Translate } from "@/i18n/translate";

import type { DeepLinkCredentials } from "./ordersApi";

export type DeepLinkErrors = Partial<Record<keyof DeepLinkCredentials, string>>;

export const emptyDeepLinkCredentials: DeepLinkCredentials = {
  email: "",
  zipcode: "",
};

const required = (value: string) => value.trim().length > 0;

export function createDeepLinkCredentialsSchema(t: Translate) {
  return z.object({
    email: z
      .string()
      .trim()
      .refine(required, t("validations.required"))
      .pipe(z.email(t("validations.email"))),
    zipcode: z.string().refine(required, t("validations.required")),
  });
}

export function validateDeepLinkCredentials(
  values: DeepLinkCredentials,
  t: Translate,
): DeepLinkErrors {
  const result = createDeepLinkCredentialsSchema(t).safeParse(values);
  if (result.success) return {};
  const errors: DeepLinkErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === "email" || field === "zipcode") {
      errors[field] ??= issue.message;
    }
  }
  return errors;
}

export function parseDeepLinkCredentials(
  values: DeepLinkCredentials,
  t: Translate,
): DeepLinkCredentials | null {
  const result = createDeepLinkCredentialsSchema(t).safeParse(values);
  return result.success ? result.data : null;
}
