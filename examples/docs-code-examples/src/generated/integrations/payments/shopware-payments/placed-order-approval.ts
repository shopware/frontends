import { useShopwareContext } from "#imports";

import { placedOrderCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { requireElement, type ApprovalResult } from "./snippet-context";

const { apiClient } = useShopwareContext();

// Store API id of the ShopwarePayments method for this surface.
const paymentMethodId = "SHOPWARE_PAYMENTS_METHOD_ID";

async function onApprovePlacedOrder(orderId: string, result: ApprovalResult) {
  const finishUrl = `${window.location.origin}/checkout/success/${orderId}`;
  const errorUrl = `${window.location.origin}/checkout/success/${orderId}/unpaid`;

  try {
    // A failed or cancelled transaction is not open. handle-payment only pays
    // an open one, so reopen this transaction or replace it before capture.
    await apiClient.invoke("orderSetPayment post /order/payment", {
      body: {
        orderId,
        paymentMethodId,
      },
    });

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

async function payExistingOrder(order: { id: string }) {
  const element = requireElement("paypal-button");

  await shopwarePayments.buttons({
    funding: "paypal",
    element,
    checkout: placedOrderCheckout(order),
    onApprove: (result) => onApprovePlacedOrder(order.id, result),
    onError,
  });
}

export { onApprovePlacedOrder, payExistingOrder };
