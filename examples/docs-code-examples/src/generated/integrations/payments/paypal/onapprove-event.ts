type OnApproveData = { orderID: string };
type OnApproveActions = unknown;

const orderCreated = { value: null as unknown };
const order = { id: "order-id" };
const apiClient = {
  async invoke(_route: string, _payload: unknown) {
    return { data: { redirectUrl: "https://example.com/payment/finalize" } };
  },
};

async function createOrder(payload: { paypalOrderId: string }) {
  return { id: "order-id", ...payload };
}

function refreshCart() {}

const paypalButtons = {
  // part of window.paypal.Buttons({}) params
  onApprove: async (data: OnApproveData, actions: OnApproveActions) => {
    // createOrder from useCheckout composable
    orderCreated.value = await createOrder({
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
    // ...
  },
};

void paypalButtons.onApprove;
