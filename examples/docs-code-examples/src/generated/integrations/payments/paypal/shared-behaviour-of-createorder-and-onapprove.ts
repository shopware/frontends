import { ref } from "vue";

import { apiClient } from "./snippet-context";

type PayPalProduct = "paylater" | "acdc" | "applepay" | "googlepay" | "venmo";

async function createPayPalOrder(product?: PayPalProduct) {
  const response = await apiClient.invoke(
    "createPayPalOrder post /store-api/paypal/create-order",
    { body: { product } },
  );

  return response?.data?.token;
}

async function onApprove(data: { orderID: string }) {
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
}

async function createOrder(_payload: { paypalOrderId: string }) {
  return { id: "order-id" };
}

function refreshCart() {}

const orderCreated = ref<{ id: string }>();

export { createPayPalOrder, onApprove };
