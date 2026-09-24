import {
  addToCart,
  apiClient,
  getPayPal,
  paypalMethod,
  setPaymentMethod,
} from "./snippet-context";

const paypal = getPayPal();
const divContainer = "#paypal-button-container";

// client only
paypal
  .Buttons({
    createOrder: async () => {
      await setPaymentMethod(paypalMethod.value);

      await addToCart();

      const response = await apiClient.invoke(
        "createPayPalExpressOrder post /store-api/paypal/express/create-order",
      );
      return response.data?.token;
    },
  })
  .render(divContainer);
