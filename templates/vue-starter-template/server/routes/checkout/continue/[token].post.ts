// Target of the form on the continue page. Configure the plugin with
// continueUrlTemplate = https://<storefront>/checkout/continue/{checkoutId}
// The checkout id is the context token of the agent's cart, so continuing
// the checkout means adopting that token as this browser's session.
export default defineEventHandler(async (event) => {
  // handoff-page.ts answers the same way for the whole path. Checked again
  // here, so this route never depends on a path pattern in another file.
  if (!isHandoffEnabled(event) || !isStorefrontHost(event)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  // Only the continue page on this origin may adopt a token. Another site
  // cannot post here on the buyer's behalf, and an agent cannot skip the page.
  // Browsers without Sec-Fetch-Site still send Origin on a form post.
  const site = getRequestHeader(event, "sec-fetch-site");
  const sameOrigin = site
    ? site === "same-origin"
    : getRequestHeader(event, "origin") === getRequestedOrigin(event);
  if (!sameOrigin) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const token = getRouterParam(event, "token") ?? "";
  if (!CONTEXT_TOKEN_PATTERN.test(token)) {
    return sendRedirect(event, "/checkout/cart?handoff=invalid", 303);
  }

  const apiClient = createServerApiClient({ contextToken: token });
  let signedIn = false;
  let lineItemCount = 0;
  try {
    // Any Store API session with a cart would pass the cart check, and a
    // session that is signed in would sign the buyer in to that account.
    // An agent's cart is a guest session, so a customer means a planted link.
    const context = await apiClient.invoke("readContext get /context");
    signedIn = Boolean(context.data.customer);

    // Shopware answers an unknown token (expired, or rotated away by a guest
    // registration or a placed order) with an empty cart. Adopting it would
    // only replace the buyer's current cart with nothing.
    if (!signedIn) {
      const cart = await apiClient.invoke("readCart get /checkout/cart");
      lineItemCount = cart.data.lineItems?.length ?? 0;
    }
  } catch (error) {
    // A backend failure is not an expired link. Say so, and leave a trace.
    console.error(
      "[agentic-handoff] could not read the agent's session",
      error,
    );
    return sendRedirect(event, "/checkout/cart?handoff=error", 303);
  }

  if (signedIn || lineItemCount === 0) {
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
