import { createAPIClient } from "@shopware/api-client";

import type { operations } from "#shopware";

// Target of the UCP continue_url. Configure the plugin with
// continueUrlTemplate = https://<storefront>/checkout/continue/{checkoutId}
// The checkout id is the context token of the agent's cart, so continuing
// the checkout means adopting that token as this browser's session.
export default defineEventHandler(async (event) => {
  // The URL carries a session token: keep it out of caches, search indexes
  // and the Referer of the next navigation.
  setResponseHeaders(event, {
    "Cache-Control": "no-store, private",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
  });

  // A continue_url only ever points at a configured storefront host. On any
  // other host this route does not exist, so it never adopts a token there.
  if (!isStorefrontHost(event)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  const token = getRouterParam(event, "token") ?? "";
  if (!CONTEXT_TOKEN_PATTERN.test(token)) {
    return sendRedirect(event, "/checkout/cart?handoff=invalid");
  }

  const config = useRuntimeConfig(event);
  const apiClient = createAPIClient<operations>({
    accessToken: config.public.shopware.accessToken,
    baseURL: config.shopware.endpoint || config.public.shopware.endpoint,
    contextToken: token,
  });

  // Shopware answers an unknown token (expired, or rotated away by a guest
  // registration or a placed order) with an empty cart. Adopting it would
  // only replace the buyer's current cart with nothing.
  let lineItemCount = 0;
  try {
    const { data } = await apiClient.invoke("readCart get /checkout/cart");
    lineItemCount = data.lineItems?.length ?? 0;
  } catch {
    return sendRedirect(event, "/checkout/cart?handoff=unavailable");
  }

  if (lineItemCount === 0) {
    return sendRedirect(event, "/checkout/cart?handoff=unavailable");
  }

  // Same cookie the nuxt-module writes on context changes, so it has to stay
  // readable from JavaScript.
  setCookie(event, "sw-context-token", token, {
    path: "/",
    sameSite: "lax",
    secure: getRequestProtocol(event, { xForwardedProto: true }) === "https",
    maxAge: 60 * 60 * 24 * 365,
  });

  return sendRedirect(event, "/checkout");
});
