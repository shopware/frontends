import type { OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { ref } from "vue";

import { apiClient } from "./snippet-context";

async function createOrder(_payload: { paypalOrderId: string }) {
  return { id: "order-id" };
}

function refreshCart() {}

const orderCreated = ref<{ id: string }>();

export const paypalButtonsConfig = {
  // part of window.paypal.Buttons({}) params
  onApprove: async (data: OnApproveData, _actions: OnApproveActions) => {
    // createOrder from useCheckout composable
    orderCreated.value = await createOrder({
      paypalOrderId: data.orderID,
    });
    refreshCart();
    const order = orderCreated.value;

    // apiClient from useShopwareContext composable
    const handlePaymentResponse = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        query: {
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
