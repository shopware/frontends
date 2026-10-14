import "server-only";
import type { ApiClient } from "#shopware";

import { apiFailureSummary } from "./apiErrors";
import { READ_TIMEOUT_MS } from "./readTimeout";

const CONTEXT_TOKEN_HEADER = "sw-context-token";

export type ImitationCredentials = {
  token: string;
  customerId: string;
  userId: string;
};

export type ImitationClient = Pick<ApiClient, "invoke" | "defaultHeaders">;

function formValue(form: FormData, name: keyof ImitationCredentials) {
  const value = form.get(name);
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

export function parseImitationForm(
  form: FormData | null,
): ImitationCredentials | null {
  if (!form) return null;
  const token = formValue(form, "token");
  const customerId = formValue(form, "customerId");
  const userId = formValue(form, "userId");
  if (!token || !customerId || !userId) return null;
  return { token, customerId, userId };
}

export async function imitateCustomer(
  client: ImitationClient,
  credentials: ImitationCredentials,
): Promise<string | null> {
  try {
    await client.invoke(
      "imitateCustomerLogin post /account/login/imitate-customer",
      {
        body: credentials,
        fetchOptions: { timeout: READ_TIMEOUT_MS },
      },
    );
  } catch (error) {
    console.error(
      "[Imitation] the Store API refused the customer imitation",
      apiFailureSummary(error),
    );
    return null;
  }

  const contextToken = client.defaultHeaders[CONTEXT_TOKEN_HEADER];
  if (!contextToken) {
    console.error(
      "[Imitation] the Store API answered without a new context token",
    );
    return null;
  }
  return contextToken;
}
