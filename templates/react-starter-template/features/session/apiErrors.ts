import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import { errorMessages } from "./errorMessages";

export type ApiErrorContext = "account_login" | "account_registration_form";

type ErrorCode = keyof typeof errorMessages.errors;

const CONTEXT_ERRORS: Partial<
  Record<ApiErrorContext, Partial<Record<string, ErrorCode>>>
> = {
  account_login: {
    "0": "login_no_matching_customer_internal",
  },
};

const NO_DETAILS = "No details provided";

function isErrorCode(code: string): code is ErrorCode {
  return Object.hasOwn(errorMessages.errors, code);
}

function contextErrorCode(
  code: string,
  context?: ApiErrorContext,
): ErrorCode | undefined {
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

function interpolate(
  message: string,
  parameters: Record<string, string>,
): string {
  return message.replace(/\{(\w+)\}/g, (_, name: string) =>
    Object.hasOwn(parameters, name) ? (parameters[name] ?? "") : "",
  );
}

function resolveApiError(
  { code, detail, meta }: ApiError,
  context?: ApiErrorContext,
): string {
  if (code && isErrorCode(code)) {
    return interpolate(
      errorMessages.errors[code],
      cleanParameters(meta?.parameters),
    );
  }
  const contextCode = code ? contextErrorCode(code, context) : undefined;
  if (contextCode) return errorMessages.errors[contextCode];
  return detail || NO_DETAILS;
}

export function resolveApiErrorMessages(
  error: unknown,
  context?: ApiErrorContext,
): string[] {
  const fallback = [errorMessages.errors["message-default"]];
  if (!(error instanceof ApiClientError)) return fallback;
  const errors: ApiError[] | undefined = error.details?.errors;
  if (!Array.isArray(errors) || errors.length === 0) return fallback;
  return errors.map((apiError) => resolveApiError(apiError, context));
}
