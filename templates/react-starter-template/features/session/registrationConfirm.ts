import { ApiClientError } from "@shopware/api-client";

import { hasApiErrorCode } from "@/features/wishlist/wishlistApi";

import { apiFailureSummary } from "./apiErrors";

export type RegistrationConfirmInput = { em: string; hash: string };

export type RegistrationConfirmFailure =
  | "alreadyConfirmed"
  | "invalidLink"
  | "failed";

export type RegistrationConfirmResult =
  | { status: "confirmed"; guest: boolean }
  | { status: RegistrationConfirmFailure };

export const CUSTOMER_IS_ALREADY_CONFIRMED =
  "CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED";

export function classifyRegistrationConfirmError(
  error: unknown,
): RegistrationConfirmFailure {
  if (!(error instanceof ApiClientError)) return "failed";
  if (hasApiErrorCode(error, CUSTOMER_IS_ALREADY_CONFIRMED)) {
    return "alreadyConfirmed";
  }
  return error.status === 400 || error.status === 404
    ? "invalidLink"
    : "failed";
}

export function isGuestCustomer(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { guest?: unknown }).guest === true
  );
}

export function logRegistrationConfirmFailure(error: unknown): void {
  console.error(
    "[Session] confirming the registration failed",
    apiFailureSummary(error),
  );
}
