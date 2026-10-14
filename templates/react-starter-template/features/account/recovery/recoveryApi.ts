import { ApiClientError } from "@shopware/api-client";

import type { ApiClient, operations } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import { hasApiErrorCode } from "@/features/wishlist/wishlistApi";

export type RecoveryClient = Pick<ApiClient, "invoke">;

export type RecoveryMailBody =
  operations["sendRecoveryMail post /account/recovery-password"]["body"];

export type ResetPasswordBody =
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"];

export type RecoveryHashStatus = "valid" | "expired" | "invalid";

export const RECOVERY_HASH_PATTERN = /^[A-Za-z0-9]{32}$/;

export const RECOVERY_HASH_EXPIRED = "CHECKOUT__CUSTOMER_RECOVERY_HASH_EXPIRED";

export const RECOVERY_HASH_NOT_FOUND = "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH";

export function readRecoveryHash(search: string): string | null {
  return new URLSearchParams(search).get("hash")?.trim() || null;
}

export function isRecoveryHash(value: string | null): value is string {
  return value !== null && RECOVERY_HASH_PATTERN.test(value);
}

export async function sendRecoveryMail(
  client: RecoveryClient,
  { email, storefrontUrl }: RecoveryMailBody,
): Promise<void> {
  await client.invoke("sendRecoveryMail post /account/recovery-password", {
    body: { email, storefrontUrl },
  });
}

function isExpiredFlag(data: unknown): boolean {
  const isExpired: unknown =
    typeof data === "object" && data !== null
      ? (data as { isExpired?: unknown }).isExpired
      : undefined;
  if (typeof isExpired !== "boolean") {
    throw new Error(
      "[Recovery] the recovery link check answered without isExpired",
    );
  }
  return isExpired;
}

export async function checkRecoveryHash(
  client: RecoveryClient,
  hash: string,
): Promise<RecoveryHashStatus> {
  let data: unknown;
  try {
    ({ data } = await client.invoke(
      "getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired",
      { body: { hash }, fetchOptions: { timeout: READ_TIMEOUT_MS } },
    ));
  } catch (error) {
    if (
      hasApiErrorCode(error, RECOVERY_HASH_NOT_FOUND) ||
      (error instanceof ApiClientError && error.status === 400)
    ) {
      return "invalid";
    }
    throw error;
  }
  return isExpiredFlag(data) ? "expired" : "valid";
}

export async function resetPassword(
  client: RecoveryClient,
  { hash, newPassword, newPasswordConfirm }: ResetPasswordBody,
): Promise<void> {
  await client.invoke(
    "recoveryPassword post /account/recovery-password-confirm",
    { body: { hash, newPassword, newPasswordConfirm } },
  );
}
