import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import type { ApiClient } from "#shopware";
import { NEWSLETTER_RECIPIENT_NOT_FOUND } from "@/features/account/profile/profileApi";
import { apiFailureSummary } from "@/features/session/apiErrors";
import { hasApiErrorCode } from "@/features/wishlist/wishlistApi";

import type { EmailLinkParams } from "./emailLinkParams";

export type NewsletterConfirmClient = Pick<ApiClient, "invoke">;

export type NewsletterConfirmFailure =
  | "alreadyConfirmed"
  | "invalidLink"
  | "failed";

export type NewsletterConfirmResult = {
  status: "confirmed" | NewsletterConfirmFailure;
};

const CONFIRMED_STATUSES = new Set(["optIn", "direct"]);

function violationAt(
  errors: ApiError[],
  pointer: string,
): ApiError | undefined {
  return errors.find((apiError) => apiError?.source?.pointer === pointer);
}

function violationValue(violation: ApiError): string {
  const parameters = violation.meta?.parameters;
  if (!parameters || Array.isArray(parameters)) return "";
  return String(parameters["{{ value }}"] ?? "").replaceAll('"', "");
}

export function classifyNewsletterConfirmError(
  error: unknown,
): NewsletterConfirmFailure {
  if (!(error instanceof ApiClientError)) return "failed";
  if (hasApiErrorCode(error, NEWSLETTER_RECIPIENT_NOT_FOUND)) {
    return "invalidLink";
  }
  const details: unknown = error.details?.errors;
  const errors: ApiError[] = Array.isArray(details) ? details : [];
  if (violationAt(errors, "/em")) return "invalidLink";
  const status = violationAt(errors, "/status");
  if (status) {
    return CONFIRMED_STATUSES.has(violationValue(status))
      ? "alreadyConfirmed"
      : "invalidLink";
  }
  return error.status === 400 || error.status === 404
    ? "invalidLink"
    : "failed";
}

export async function confirmNewsletter(
  getClient: () => Promise<NewsletterConfirmClient>,
  { em, hash }: EmailLinkParams,
): Promise<NewsletterConfirmResult> {
  try {
    const client = await getClient();
    await client.invoke("confirmNewsletter post /newsletter/confirm", {
      body: { em, hash },
    });
    return { status: "confirmed" };
  } catch (error) {
    const status = classifyNewsletterConfirmError(error);
    if (status === "failed") {
      console.error(
        "[Newsletter] confirming the subscription failed",
        apiFailureSummary(error),
      );
    }
    return { status };
  }
}
