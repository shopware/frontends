import { ApiClientError } from "@shopware/api-client";

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

  if (!isSameOriginPost(getRequestHeaders(event), getForwardedOrigin(event))) {
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
    // An agent's cart stays a guest session until the plugin completes the
    // checkout itself, which registers the guest and rotates the token. So a
    // session with a customer did not come from an open agent checkout.
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
    // A backend failure is not an expired link. Say so, and leave a trace
    // without the response object: Shopware echoes the token in its headers.
    const reason =
      error instanceof ApiClientError
        ? `${error.status} from ${error.url}: ${error.message}`
        : error instanceof Error
          ? error.message
          : String(error);
    console.error(
      `[agentic-handoff] could not read the agent's session: ${reason}`,
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
