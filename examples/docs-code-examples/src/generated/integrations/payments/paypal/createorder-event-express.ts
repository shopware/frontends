import { ref } from "#imports";

const divContainer = ref();

// client only
window.paypal
  .Buttons({
    createOrder: async (data: CreateOrderData, actions: CreateOrderActions) => {
      await setPaymentMethod(paypalMethod.value);

      await addToCart();

      const response = await apiClient.invoke(
        "createPayPalExpressOrder post /store-api/paypal/express/create-order",
      );
      return response.data?.token;
    },
  })
  .render(divContainer);
