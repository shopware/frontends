import { createAPIClient } from "@shopware/api-client";
// @ts-ignore - #shopware is resolved by the Nuxt module at build time
import type { operations } from "#shopware";

export default defineEventHandler(async (event) => {
  const rawBody = await readBody<string>(event);
  const params = new URLSearchParams(rawBody);
  const token = params.get("token");
  const customerId = params.get("customerId");
  const userId = params.get("userId");

  if (!token || !customerId || !userId) {
    return sendRedirect(event, "/");
  }

  const config = useRuntimeConfig(event);
  const apiClient = createAPIClient<operations>({
    accessToken: config.public.shopware.accessToken,
    baseURL: config.public.shopware.endpoint,
  });

  try {
    await apiClient.invoke(
      "imitateCustomerLogin post /account/login/imitate-customer",
      {
        body: {
          token: String(token),
          customerId: String(customerId),
          userId: String(userId),
        },
      },
    );
  } catch {
    return sendRedirect(event, "/");
  }

  const contextToken = apiClient.defaultHeaders["sw-context-token"];
  if (!contextToken) {
    return sendRedirect(event, "/");
  }

  setCookie(event, "sw-context-token", contextToken, {
    sameSite: "lax",
    secure: true,
    path: "/",
  });

  return sendRedirect(event, "/account");
});
