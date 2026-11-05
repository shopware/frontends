import {
  useCart,
  useCheckout,
  useSessionContext,
  useShopwareContext,
} from "#imports";

import { shopwarePayments } from "./init";
import type { ApprovalResult } from "./snippet-context";

const { apiClient } = useShopwareContext();
const { refreshSessionContext } = useSessionContext();
const { createOrder } = useCheckout();
const { refreshCart } = useCart();

function shopwareOrderId(order: object): string {
  if ("id" in order && typeof order.id === "string" && order.id !== "") {
    return order.id;
  }

  throw new Error("The Store API order response did not include an id");
}

async function onApprove(result: ApprovalResult) {
  if (result.contextToken) {
    apiClient.defaultHeaders["sw-context-token"] = result.contextToken;
    await refreshSessionContext();
  }

  const order = await createOrder();
  await refreshCart();

  const response = await shopwarePayments.handlePayment({
    orderId: shopwareOrderId(order),
    providerOrderId: result.providerOrderId,
    contextToken: result.contextToken,
    finishUrl: `${window.location.origin}/checkout/success?order=${shopwareOrderId(order)}&success=true`,
    errorUrl: `${window.location.origin}/checkout/success?order=${shopwareOrderId(order)}&success=false`,
  });

  if (response.redirectUrl) {
    window.location.assign(response.redirectUrl);
  }
}

export { onApprove };
