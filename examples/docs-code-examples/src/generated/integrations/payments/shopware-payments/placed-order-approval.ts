import { placedOrderCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { requireElement, type ApprovalResult } from "./snippet-context";

async function onApprovePlacedOrder(orderId: string, result: ApprovalResult) {
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
