import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import {
  STOREFRONT_URL_FIELD,
  resolveFormFailure,
  violationField,
} from "@/features/forms/formViolations";
import { apiFailureSummary } from "@/features/session/apiErrors";
import { hasApiErrorCode } from "@/features/wishlist/wishlistApi";
import type { Translate } from "@/i18n/translate";

import { RECOVERY_HASH_EXPIRED, RECOVERY_HASH_NOT_FOUND } from "./recoveryApi";
import { RESET_PASSWORD_MIN_LENGTH } from "./recoverySchema";
import type { RecoverRequestField, ResetPasswordField } from "./recoverySchema";

export const LINK_ERROR_KEYS = {
  expired: "account.resetPassword.linkExpired",
  invalid: "account.resetPassword.linkInvalid",
} as const;

export type RecoveryLinkProblem = keyof typeof LINK_ERROR_KEYS;

export type RecoverRequestErrors = Partial<
  Record<RecoverRequestField | "form", string>
>;

export type ResetFieldErrors = Partial<Record<ResetPasswordField, string>>;

export type ResetFailure =
  | { kind: RecoveryLinkProblem }
  | { kind: "fields"; errors: ResetFieldErrors }
  | { kind: "message"; message: string };

const EMAIL_FIELD: RecoverRequestField = "email";

const NEW_PASSWORD_POINTER = "/newPassword";

export function logRecoveryFailure(scope: string, error: unknown): void {
  console.error(`[Recovery] ${scope}`, apiFailureSummary(error));
}

export function recoverRequestErrors(
  error: unknown,
  t: Translate,
): RecoverRequestErrors {
  const { message, violations = [] } = resolveFormFailure(error, t);
  const email = violations.find(({ field }) => field === EMAIL_FIELD)?.message;
  const form = violations.find(({ field }) => field !== EMAIL_FIELD)?.message;
  if (!email) return { form: form ?? message };
  return form ? { email, form } : { email };
}

function apiErrorsOf(error: unknown): ApiError[] {
  if (!(error instanceof ApiClientError)) return [];
  const errors: unknown = error.details?.errors;
  return Array.isArray(errors) ? (errors as ApiError[]) : [];
}

function isExpectedRequestFailure(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) return false;
  if (error.status === 429) return true;
  return (
    error.status === 400 &&
    !apiErrorsOf(error).some(
      ({ source }) => violationField(source?.pointer) === STOREFRONT_URL_FIELD,
    )
  );
}

export function logRecoverRequestFailure(error: unknown): void {
  if (isExpectedRequestFailure(error)) return;
  logRecoveryFailure("sending the recovery mail failed", error);
}

function numberParameter({ meta }: ApiError, name: string): number | null {
  const parameters: unknown = meta?.parameters;
  if (!parameters || typeof parameters !== "object") return null;
  const value: unknown = (parameters as Record<string, unknown>)[name];
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  return typeof value === "string" && /^[1-9]\d*$/.test(value)
    ? Number(value)
    : null;
}

type ResetFieldError = { field: ResetPasswordField; message: string };

function newPasswordError(
  apiError: ApiError,
  t: Translate,
  minLength: number,
): ResetFieldError | null {
  if (!apiError.code) {
    return {
      field: "newPasswordConfirm",
      message: t("validations.newPasswordConfirm"),
    };
  }
  switch (apiError.code) {
    case "VIOLATION::IS_BLANK_ERROR":
      return { field: "newPassword", message: t("validations.required") };
    case "VIOLATION::TOO_SHORT_ERROR":
      return {
        field: "newPassword",
        message: t("validations.minLength", {
          min: numberParameter(apiError, "{{ min }}") ?? minLength,
        }),
      };
    case "VIOLATION::TOO_LONG_ERROR": {
      const max = numberParameter(apiError, "{{ max }}");
      return max === null
        ? null
        : {
            field: "newPassword",
            message: t("validations.maxLength", { max }),
          };
    }
    default:
      return null;
  }
}

function resetFieldErrors(
  error: unknown,
  t: Translate,
  minLength: number,
): ResetFieldErrors | null {
  if (!(error instanceof ApiClientError) || error.status !== 400) return null;
  const apiErrors = apiErrorsOf(error);
  if (!apiErrors.length) return null;
  const errors: ResetFieldErrors = {};
  for (const apiError of apiErrors) {
    if (apiError.source?.pointer !== NEW_PASSWORD_POINTER) return null;
    const mapped = newPasswordError(apiError, t, minLength);
    if (!mapped) return null;
    errors[mapped.field] ??= mapped.message;
  }
  return errors;
}

export function classifyResetFailure(
  error: unknown,
  t: Translate,
  minLength: number = RESET_PASSWORD_MIN_LENGTH,
): ResetFailure {
  if (hasApiErrorCode(error, RECOVERY_HASH_EXPIRED)) return { kind: "expired" };
  if (hasApiErrorCode(error, RECOVERY_HASH_NOT_FOUND)) {
    return { kind: "invalid" };
  }
  const errors = resetFieldErrors(error, t, minLength);
  return errors
    ? { kind: "fields", errors }
    : { kind: "message", message: t("errors.message-default") };
}
