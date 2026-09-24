import type { OnApproveActions, OnApproveData } from "@paypal/paypal-js";

import { apiClient } from "./snippet-context";

async function createOrder(_payload: { paypalOrderId: string }) {
  return { id: "order-id" };
}

function refreshCart() {}

export const paypalButtonsConfig = {
  // part of window.paypal.Buttons({}) params
  onApprove: async (data: OnApproveData, _actions: OnApproveActions) => {
    await apiClient.invoke(
      "preparePayPalExpressCheckout post /store-api/paypal/express/prepare-checkout",
      {
        body: { token: data.orderID },
      },
    );
    // createOrder from useCheckout composable
    const order = await createOrder({ paypalOrderId: data.orderID });
    refreshCart();

    // redirect to order confirmation site

    // - OR - one-click checkout
    const handlePaymentResponse = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        query: {
          isPayPalExpressCheckout: true,
          paypalOrderId: data.orderID,
        },
        body: {
          orderId: order.id,
          finishUrl: `${window.location.origin}/order/finish?order=${order.id}&success=true`,
        },
      },
    );
    // call the /payment/finalize-transaction endpoint
    await fetch(handlePaymentResponse.data.redirectUrl);
    // ...
  },
};
