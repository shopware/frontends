const divContainer = ref();

// client only
window.paypal
  .Buttons({
    createOrder: async (data: CreateOrderData, actions: CreateOrderActions) => {
      const response = await apiClient.invoke(
        "createPayPalOrder post /store-api/paypal/create-order",
      );
      return response.data?.token;
    },
  })
  .render(divContainer);
