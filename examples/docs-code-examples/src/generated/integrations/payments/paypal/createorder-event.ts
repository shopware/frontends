import { apiClient, getPayPal } from "./snippet-context";

const paypal = getPayPal();
const divContainer = "#paypal-button-container";

// client only
paypal
  .Buttons({
    createOrder: async () => {
      const response = await apiClient.invoke(
        "createPayPalOrder post /store-api/paypal/create-order",
      );
      return response.data?.token;
    },
  })
  .render(divContainer);
