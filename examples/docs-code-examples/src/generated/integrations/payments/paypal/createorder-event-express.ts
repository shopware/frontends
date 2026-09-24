import type { CreateOrderActions, CreateOrderData } from "@paypal/paypal-js";
import { ref } from "vue";

import {
  addToCart,
  apiClient,
  getPayPal,
  paypalMethod,
  setPaymentMethod,
} from "./snippet-context";

const divContainer = ref<HTMLElement>();

// client only
getPayPal()
  .Buttons({
    createOrder: async (
      _data: CreateOrderData,
      _actions: CreateOrderActions,
    ) => {
      await setPaymentMethod(paypalMethod.value);

      await addToCart();

      const response = await apiClient.invoke(
        "createPayPalExpressOrder post /store-api/paypal/express/create-order",
      );
      return response.data.token;
    },
  })
  .render(divContainer.value!);
