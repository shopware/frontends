async function createOrder(product?: 'paylater' | 'acdc' | 'applepay' | 'googlepay' | 'applepay' | 'venmo') {
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
  refreshCart()
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
  ...
}
