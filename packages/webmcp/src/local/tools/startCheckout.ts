import { WebMcpToolError } from "../../types";
import { defineLocalTool } from "../tool";

/**
 * Never places an order. Reads the cart and the session and reports the real
 * next step, so the host can navigate to the page the shopper has to confirm.
 */
export const startCheckout = defineLocalTool({
  name: "start_checkout",
  title: "Start checkout",
  description:
    "Use only when the shopper explicitly asks to check out or go to checkout. Opens the checkout page where the shopper confirms the order themselves. Never places an order. Fails when the cart is empty.",
  params: { properties: {} },
  annotations: { consequentialHint: true },
  minimumMode: "shopping",
  async execute(_input, context, apiClient) {
    const [{ data: cart }, { data: session }] = await Promise.all([
      apiClient.invoke("readCart get /checkout/cart", {
        fetchOptions: { signal: context.signal },
      }),
      apiClient.invoke("readContext get /context", {
        fetchOptions: { signal: context.signal },
      }),
    ]);
    if (!cart.lineItems || cart.lineItems.length === 0) {
      throw new WebMcpToolError("The cart is empty", "failed");
    }
    const status = session.customer
      ? "ready_for_confirmation"
      : "customer_details_needed";
    const target = session.customer ? "checkout.confirm" : "checkout.register";
    return {
      data: {
        status,
        message:
          status === "ready_for_confirmation"
            ? "Opening the checkout page. The shopper has to confirm the order there."
            : "Opening checkout. The shopper has to log in or enter their details first.",
      },
      next: { target },
    };
  },
});
