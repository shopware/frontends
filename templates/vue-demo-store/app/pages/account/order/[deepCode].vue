<script lang="ts" setup>
import { ApiClientError, type ApiError } from "@shopware/api-client";

const orderAssociations = useDefaultOrderAssociations();

const { apiClient } = useShopwareContext();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

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
    const result = await apiClient.invoke("readOrder post /order", {
      body: {
        filter: [
          {
            type: "equals",
            field: "deepLinkCode",
            value: route.params.deepCode as string,
          },
        ],
        email: orderAuthState.email,
        zipcode: orderAuthState.postalCode,
        login: true,
        associations: orderAssociations,
      },
    });

    return result.data.orders.elements[0];
  } catch (e) {
    if (e instanceof ApiClientError)
      for (const error of e.details.errors) {
        if (error.code === "CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND") {
          errorNotFound.value = true;
        } else if (error.code === "CHECKOUT__GUEST_NOT_AUTHENTICATED") {
          showOrderAuthForm.value = true;
        } else if (error.code === "CHECKOUT__GUEST_WRONG_CREDENTIALS") {
          pushError(t("account.messages.orderWrongData"));
        } else {
          if (error?.detail) pushError(error.detail);
        }
      }
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
    <div v-if="isLoggedIn">
      <NuxtLink
        :to="formatLink('/account/order')"
        class="flex items-center text-base font-normal text-secondary-900 break-words hover:underline gap-1.5 mb-5"
      >
        <div class="i-carbon-arrow-left h-5 w-5 ml-1"></div>
        {{ $t("account.order.backToList") }}
      </NuxtLink>
    </div>
    <div v-if="errorNotFound">
      <div class="text-center text-xl m-20">
        {{ $t("account.messages.orderSuccessNoOrder") }}
      </div>
    </div>
    <div v-if="showOrderAuthForm && !order">
      <h2 class="text-2xl font-bold">
        {{ $t("account.order.authOrderTitle") }}
      </h2>
      <p class="mb-3">{{ $t("account.order.authOrderText") }}</p>
      <form class="flex flex-col gap-3">
        <div class="flex flex-row gap-5">
          <input
            v-model="orderAuthState.email"
            type="email"
            placeholder="Email"
            class="w-6/10 p-2 border border-gray-300 rounded-md"
          />
          <input
            v-model="orderAuthState.postalCode"
            type="text"
            placeholder="Postal Code"
            class="w-4/10 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <button
            type="submit"
            class="p-2 bg-blue-500 text-white rounded-md"
            @click.prevent="authOrder"
          >
            {{ $t("account.order.authOrderButton") }}
          </button>
        </div>
      </form>
    </div>
    <div v-if="order">
      <OrderDetails :order="order" />
    </div>
  </div>
</template>
