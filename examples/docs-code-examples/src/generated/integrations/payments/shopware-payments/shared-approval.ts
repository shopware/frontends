import {
  useCart,
  useCheckout,
  useNotifications,
  useSessionContext,
  useShopwareContext,
} from "#imports";

import { shopwarePayments } from "./init";
import type { ApprovalResult } from "./snippet-context";

const { apiClient } = useShopwareContext();
const { refreshSessionContext } = useSessionContext();
const { createOrder, setPaymentMethod } = useCheckout();
const { refreshCart } = useCart();
const { pushError } = useNotifications();

async function onApprove(result: ApprovalResult, paymentMethodId: string) {
  let orderId: string;

  try {
    if (result.contextToken) {
      apiClient.defaultHeaders["sw-context-token"] = result.contextToken;
      await refreshSessionContext();
    }

    // The session holds one method. Select the one for the surface
    // the shopper approved before the order is placed.
    await setPaymentMethod({ id: paymentMethodId });
    const order = await createOrder();
    orderId = order.id;
  } catch (error) {
    console.error("ShopwarePayments could not place the order", error);
    pushError("The order was not placed. Stay on checkout and try again.", {
      persistent: true,
    });
    return;
  }

  try {
    await refreshCart();
  } catch (error) {
    console.error("ShopwarePayments could not refresh the cart", error);
  }

  const finishUrl = `${window.location.origin}/checkout/success/${orderId}`;
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
