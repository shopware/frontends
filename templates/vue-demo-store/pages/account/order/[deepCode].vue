<script lang="ts" setup>
import { ApiClientError, type ApiError } from "@shopware/api-client";
const { apiClient } = useShopwareContext();
const route = useRoute();
const errorNotFound = ref(false);
const showOrderAuthForm = ref(false);
const order = ref();
const { t } = useI18n();

const orderAuthState = reactive({
  email: "",
  postalCode: "",
});

const { pushError } = useNotifications();
const { isLoggedIn } = useUser();
const getOrderData = async () => {
  try {
    const result = await apiClient.invoke(
      "getOrderSuccess post /order/{deepCode}",
      {
        pathParams: {
          deepCode: route.params.deepCode as string,
        },
        body: {
          email: orderAuthState.email,
          zipcode: orderAuthState.postalCode,
        },
      },
    );

    return result;
  } catch (e) {
    if (e instanceof ApiClientError)
      e.details.errors.forEach((error: ApiError) => {
        // Display no order error container
        if (error.code === "CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND") {
          errorNotFound.value = true;
        } else if (error.code === "CHECKOUT__GUEST_NOT_AUTHENTICATED") {
          showOrderAuthForm.value = true;
        } else if (error.code === "CHECKOUT__GUEST_WRONG_CREDENTIALS") {
          pushError(t("account.messages.orderWrongData"));
        } else {
          if (error?.detail) pushError(error.detail);
        }
      });
    order.value = null;
  }
};

order.value = await getOrderData();

const authOrder = async () => {
  order.value = await getOrderData();
};
</script>
<template>
  <div class="container mx-auto my-8">
    <div v-if="isLoggedIn">{{ $t("account.order.backToList") }}</div>
    <div v-if="errorNotFound">
      <div class="text-center text-xl m-20">
        {{ $t("account.messages.orderSuccessNoOrder") }}
      </div>
    </div>
    <div v-if="showOrderAuthForm && !order">
      <form class="flex flex-col gap-3">
        <input
          v-model="orderAuthState.email"
          type="email"
          placeholder="Email"
          class="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          v-model="orderAuthState.postalCode"
          type="text"
          placeholder="Postal Code"
          class="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          class="w-full p-2 bg-blue-500 text-white rounded-md"
          @click.prevent="authOrder"
        >
          {{ $t("account.order.authOrderButton") }}
        </button>
      </form>
    </div>
    <div v-if="order">
      <OrderDetails :order="order" />
    </div>
  </div>
</template>
