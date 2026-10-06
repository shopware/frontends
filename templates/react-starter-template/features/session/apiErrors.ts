import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import { hasTranslation } from "@/i18n/translate";
import type { Translate } from "@/i18n/translate";

export type ApiErrorContext = "account_login" | "account_registration_form";

const CONTEXT_ERRORS: Partial<
  Record<ApiErrorContext, Partial<Record<string, string>>>
> = {
  account_login: {
    "0": "login_no_matching_customer_internal",
  },
};

function contextErrorCode(
  code: string,
  context?: ApiErrorContext,
): string | undefined {
  const codes = context ? CONTEXT_ERRORS[context] : undefined;
  return codes && Object.hasOwn(codes, code) ? codes[code] : undefined;
}

function cleanParameters(
  parameters: NonNullable<ApiError["meta"]>["parameters"],
): Record<string, string> {
  if (!parameters || Array.isArray(parameters)) return {};
  return Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => [
      key.replace(/[^a-zA-Z0-9]/g, ""),
      value,
    ]),
  );
}

function resolveApiError(
  { code, detail, meta }: ApiError,
  t: Translate,
  context?: ApiErrorContext,
): string {
  if (code && hasTranslation(t, `errors.${code}`)) {
    return t(`errors.${code}`, cleanParameters(meta?.parameters));
  }
  const contextCode = code ? contextErrorCode(code, context) : undefined;
  if (contextCode) return t(`errors.${contextCode}`);
  return detail || t("errors.noDetailsProvided");
}

export function resolveApiErrorMessages(
  error: unknown,
  t: Translate,
  context?: ApiErrorContext,
): string[] {
  const fallback = [t("errors.message-default")];
  if (!(error instanceof ApiClientError)) return fallback;
  const errors: ApiError[] | undefined = error.details?.errors;
  if (!Array.isArray(errors) || errors.length === 0) return fallback;
  return errors.map((apiError) => resolveApiError(apiError, t, context));
}
