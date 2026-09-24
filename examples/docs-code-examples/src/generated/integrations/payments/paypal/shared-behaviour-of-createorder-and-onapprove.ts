const orderCreated = { value: null as unknown };
const order = { id: "order-id" };
const apiClient = {
  async invoke(_route: string, _payload: unknown) {
    return {
      data: {
        redirectUrl: "https://example.com/payment/finalize",
        token: "paypal-order-token",
      },
    };
  },
};

function refreshCart() {}

async function createOrder(
  product?: "paylater" | "acdc" | "applepay" | "googlepay" | "venmo",
) {
  const response = await apiClient.invoke(
    "createPayPalOrder post /store-api/paypal/create-order",
    { body: { product } },
  );

  return response?.data?.token;
}

async function createShopwareOrder(payload: { paypalOrderId: string }) {
  return { id: "order-id", ...payload };
}

async function onApprove(data: { orderID: string }) {
  // createOrder from useCheckout composable
  orderCreated.value = await createShopwareOrder({
    paypalOrderId: data.orderID,
  });
  refreshCart();
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

await createOrder();
await onApprove({ orderID: "paypal-order-id" });
