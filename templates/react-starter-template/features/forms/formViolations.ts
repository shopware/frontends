import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import type { CmsFormViolation } from "@shopware/cms-base-layer-react/client";

import { NEWSLETTER_RECIPIENT_NOT_FOUND } from "@/features/account/profile/profileApi";
import {
  apiFailureSummary,
  resolveApiErrorMessages,
} from "@/features/session/apiErrors";
import { hasApiErrorCode } from "@/features/wishlist/wishlistApi";
import type { Translate } from "@/i18n/translate";

export const RATE_LIMIT_EXCEEDED = "FRAMEWORK__RATE_LIMIT_EXCEEDED";

export const STOREFRONT_URL_FIELD = "storefrontUrl";

export type FormScope = "contact" | "newsletter";

export type FormFailure = {
  message: string;
  violations?: CmsFormViolation[];
};

const EXPECTED_STATUSES: readonly number[] = [400, 429];

const FIELD_MESSAGE_KEYS: Partial<Record<string, string>> = {
  "VIOLATION::IS_BLANK_ERROR": "validations.required",
  "VIOLATION::REGEX_FAILED_ERROR": "forms.errors.urlNotAllowed",
  "VIOLATION::ENTITY_DOES_NOT_EXISTS": "forms.errors.invalidChoice",
  "VIOLATION::NO_SUCH_CHOICE_ERROR": "forms.errors.invalidChoice",
};

const EMAIL_FORMAT_ERROR = "VIOLATION::INVALID_FORMAT_ERROR";

export function violationField(
  pointer: string | undefined,
): string | undefined {
  return pointer?.match(/^\/([^/]+)$/)?.[1];
}

function apiErrorsOf(error: unknown): ApiError[] {
  if (!(error instanceof ApiClientError) || error.status >= 500) return [];
  const errors: unknown = error.details?.errors;
  return Array.isArray(errors) ? (errors as ApiError[]) : [];
}

function waitSeconds({ meta }: ApiError): string | null {
  const parameters: unknown = meta?.parameters;
  if (!parameters || typeof parameters !== "object") return null;
  const seconds: unknown = (parameters as Record<string, unknown>).seconds;
  if (typeof seconds === "number" && Number.isFinite(seconds)) {
    return String(Math.max(0, Math.ceil(seconds)));
  }
  return typeof seconds === "string" && /^\d+$/.test(seconds) ? seconds : null;
}

function fieldMessageKey(
  code: string | undefined,
  field: string,
): string | undefined {
  if (!code) return undefined;
  if (code === EMAIL_FORMAT_ERROR) {
    return field === "email" ? "validations.email" : undefined;
  }
  return FIELD_MESSAGE_KEYS[code];
}

function toViolation(
  apiError: ApiError,
  resolved: string,
  t: Translate,
): CmsFormViolation {
  const { code } = apiError;
  const withCode = code ? { code } : {};
  const field = violationField(apiError.source?.pointer);
  if (code === RATE_LIMIT_EXCEEDED) {
    const seconds = waitSeconds(apiError);
    return {
      ...withCode,
      message: seconds ? t("errors.rateLimitExceeded", { seconds }) : resolved,
    };
  }
  if (field === STOREFRONT_URL_FIELD) {
    return { ...withCode, message: t("errors.message-default") };
  }
  if (!field) return { ...withCode, message: resolved };
  const key = fieldMessageKey(code, field);
  return { field, ...withCode, message: key ? t(key) : resolved };
}

export function resolveFormFailure(error: unknown, t: Translate): FormFailure {
  const apiErrors = apiErrorsOf(error);
  if (!apiErrors.length) return { message: t("errors.message-default") };
  const resolved = resolveApiErrorMessages(error, t);
  const violations = apiErrors.map((apiError, index) =>
    toViolation(apiError, resolved[index] ?? t("errors.message-default"), t),
  );
  const summary =
    violations.find((violation) => !violation.field) ?? violations[0];
  return {
    message: summary?.message ?? t("errors.message-default"),
    violations,
  };
}

export function isUnknownNewsletterRecipient(error: unknown): boolean {
  return hasApiErrorCode(error, NEWSLETTER_RECIPIENT_NOT_FOUND);
}

function needsAttention(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) return true;
  if (!EXPECTED_STATUSES.includes(error.status)) return true;
  return apiErrorsOf(error).some(
    ({ source }) => violationField(source?.pointer) === STOREFRONT_URL_FIELD,
  );
}

export function logFormFailure(scope: FormScope, error: unknown): void {
  if (!needsAttention(error)) return;
  console.error(`[Forms] ${scope} failed`, apiFailureSummary(error));
}
