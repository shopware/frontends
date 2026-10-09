import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import type { ApiClient, Schemas, operations } from "#shopware";

import { resolveApiErrorMessages } from "./apiErrors";
import type { ApiErrorContext } from "./apiErrors";
import type { SessionActions } from "./components/SessionActionsContext";
import type { SessionActionResult } from "./types";

export type SessionNotification = { type: "error"; message: string };

export type SessionActionDeps = {
  client: Pick<ApiClient, "invoke">;
  refreshSession: () => Promise<void>;
  getStorefrontUrl: () => Promise<string>;
  notify: (notification: SessionNotification) => void;
};

const CUSTOMER_NOT_LOGGED_IN = "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN";

function isAlreadyLoggedOut(error: unknown): boolean {
  if (!(error instanceof ApiClientError) || error.status !== 403) return false;
  const errors: ApiError[] | undefined = error.details?.errors;
  return (
    Array.isArray(errors) &&
    errors.some((apiError) => apiError?.code === CUSTOMER_NOT_LOGGED_IN)
  );
}

export function createSessionActions({
  client,
  refreshSession,
  getStorefrontUrl,
  notify,
}: SessionActionDeps): Omit<SessionActions, "retrySession"> {
  function fail(
    error: unknown,
    context?: ApiErrorContext,
  ): SessionActionResult {
    const messages = resolveApiErrorMessages(error, context);
    for (const message of messages) {
      notify({ type: "error", message });
    }
    return { ok: false, message: messages[0] };
  }

  async function refreshAfterMutation(): Promise<void> {
    try {
      await refreshSession();
    } catch (error) {
      console.error("[Session] refreshing the session failed", error);
    }
  }

  return {
    async login({ username, password }) {
      try {
        await client.invoke("loginCustomer post /account/login", {
          body: { username, password },
        });
      } catch (error) {
        return fail(error, "account_login");
      }
      await refreshAfterMutation();
      return { ok: true };
    },

    async register(input) {
      let customer: Schemas["Customer"];
      try {
        const storefrontUrl = await getStorefrontUrl();
        const { data } = await client.invoke(
          "register post /account/register",
          {
            body: {
              ...(input as operations["register post /account/register"]["body"]),
              storefrontUrl,
            },
          },
        );
        customer = data;
      } catch (error) {
        return fail(error, "account_registration_form");
      }
      await refreshAfterMutation();
      const doubleOptIn = Boolean(customer.doubleOptInRegistration);
      return { ok: Boolean(customer.active || doubleOptIn), doubleOptIn };
    },

    async logout() {
      try {
        await client.invoke("logoutCustomer post /account/logout");
      } catch (error) {
        if (!isAlreadyLoggedOut(error)) return fail(error);
      }
      await refreshAfterMutation();
      return { ok: true };
    },
  };
}
