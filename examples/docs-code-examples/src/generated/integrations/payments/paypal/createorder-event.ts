import type { CreateOrderActions, CreateOrderData } from "@paypal/paypal-js";
import { ref } from "vue";

import { apiClient, getPayPal } from "./snippet-context";

const divContainer = ref<HTMLElement>();

// client only
getPayPal()
  .Buttons({
    createOrder: async (
      _data: CreateOrderData,
      _actions: CreateOrderActions,
    ) => {
      const response = await apiClient.invoke(
        "createPayPalOrder post /store-api/paypal/create-order",
      );
      return response.data.token;
    },
  })
  .render(divContainer.value!);
