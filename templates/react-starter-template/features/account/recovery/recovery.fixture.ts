import type { ApiError } from "@shopware/api-client";

import type { Schemas } from "#shopware";
import { anonymousSession } from "@/features/session/anonymousSession";
import { salesChannelContext } from "@/features/session/session.fixture";
import type { StorefrontSession } from "@/features/session/types";

export const VALID_HASH = "AbCdEfGhIjKlMnOpQrStUvWxYz012345";

export const CHECK_HASH =
  "getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired";

export const SEND_MAIL = "sendRecoveryMail post /account/recovery-password";

export const RESET_PASSWORD =
  "recoveryPassword post /account/recovery-password-confirm";

export function isExpiredAnswer(isExpired: boolean) {
  return { isExpired, apiAlias: "array_struct" };
}

export function violation(
  code: string | null,
  pointer: string,
  parameters: Record<string, unknown> = {},
  detail = "Constraint violation",
): ApiError {
  return {
    code,
    status: "400",
    title: "Constraint violation error",
    detail,
    source: { pointer },
    meta: { parameters },
  } as unknown as ApiError;
}

export type DomainFixture = Pick<
  Schemas["SalesChannelDomain"],
  "url" | "languageId"
>;

export function contextWithDomains(
  domains: DomainFixture[],
  languageId = "language-en",
): Schemas["SalesChannelContext"] {
  const context = salesChannelContext();
  return {
    ...context,
    context: { ...context.context, languageIdChain: [languageId] },
    salesChannel: { ...context.salesChannel, languageId, domains },
  } as Schemas["SalesChannelContext"];
}

export function anonymousSessionWithDomains(
  domains: DomainFixture[],
  languageId?: string,
): StorefrontSession {
  return {
    ...anonymousSession,
    status: "ready",
    context: contextWithDomains(domains, languageId),
  };
}
