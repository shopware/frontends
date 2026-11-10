// Target of the form on the continue page. Configure the plugin with
// continueUrlTemplate = https://<storefront>/checkout/continue/{checkoutId}
// The checkout id is the context token of the agent's cart, so continuing
// the checkout means adopting that token as this browser's session.
// handoff-page.ts has already answered 404 when the handoff is off or the
// host is not the shop's, and set the no-store and no-referrer headers.
export default defineEventHandler(async (event) => {
  // Only the continue page on this origin may adopt a token. Another site
  // cannot post here on the buyer's behalf, and an agent cannot skip the page.
  if (getRequestHeader(event, "sec-fetch-site") !== "same-origin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const token = getRouterParam(event, "token") ?? "";
  if (!CONTEXT_TOKEN_PATTERN.test(token)) {
    return sendRedirect(event, "/checkout/cart?handoff=invalid", 303);
  }

  // Shopware answers an unknown token (expired, or rotated away by a guest
  // registration or a placed order) with an empty cart. Adopting it would
  // only replace the buyer's current cart with nothing.
  const apiClient = createServerApiClient({ contextToken: token });
  let lineItemCount = 0;
  try {
    const { data } = await apiClient.invoke("readCart get /checkout/cart");
    lineItemCount = data.lineItems?.length ?? 0;
  } catch (error) {
    // A backend failure is not an expired link. Say so, and leave a trace.
    console.error("[agentic-handoff] could not read the agent's cart", error);
    throw createError({ statusCode: 502, statusMessage: "Bad Gateway" });
  }

  if (lineItemCount === 0) {
    return sendRedirect(event, "/checkout/cart?handoff=unavailable", 303);
  }

  // Same cookie, and same Secure rule, as the nuxt-module writes on context
  // changes. It has to stay readable from JavaScript.
  setCookie(event, "sw-context-token", token, {
    path: "/",
    sameSite: "lax",
    secure:
      useRuntimeConfig(event).public.shopware.endpoint.startsWith("https://"),
    maxAge: 60 * 60 * 24 * 365,
  });

  return sendRedirect(event, "/checkout", 303);
});
