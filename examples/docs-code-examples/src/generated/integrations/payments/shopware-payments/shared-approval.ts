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

async function onApprove(result: ApprovalResult) {
  if (result.contextToken) {
    apiClient.defaultHeaders["sw-context-token"] = result.contextToken;
    await refreshSessionContext();
  }

  const order = await createOrder();
  await refreshCart();
  const orderId = order.id;
  const finishUrl = `${window.location.origin}/checkout/success/${orderId}/paid`;
  const errorUrl = `${window.location.origin}/checkout/success/${orderId}/unpaid`;

  try {
    const response = await shopwarePayments.handlePayment({
      orderId,
      providerOrderId: result.providerOrderId,
      contextToken: result.contextToken,
      finishUrl,
      errorUrl,
    });
    window.location.assign(response.redirectUrl || finishUrl);
  } catch (error) {
    console.error("ShopwarePayments could not handle the payment", error);
    window.location.assign(errorUrl);
  }
}

export { onApprove };
