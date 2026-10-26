import { useCheckout, useShopwareContext } from "#imports";

import { instance } from "./snippet-context";

const { createOrder } = useCheckout();
const { apiClient } = useShopwareContext();

async function onPaymentSubmit() {
  // Get nonce from Braintree Drop-in
  const { nonce, deviceData } = await instance.requestPaymentMethod();

  // Create order (no braintree params here)
  const order = await createOrder();
  const paymentPayload = {
    orderId: order.id,
    finishUrl: `${window.location.origin}/checkout/finish`,
    errorUrl: `${window.location.origin}/checkout/error`,
    braintreeNonce: nonce,
    braintreeDeviceData: deviceData,
  };

  // Handle payment WITH Braintree data
  await apiClient.invoke("handlePaymentMethod post /handle-payment", {
    body: paymentPayload,
  });
}
