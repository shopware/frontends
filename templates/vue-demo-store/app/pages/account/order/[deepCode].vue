<script lang="ts" setup>
import { ApiClientError, type ApiError } from "@shopware/api-client";

const { apiClient } = useShopwareContext();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const route = useRoute();
const errorNotFound = ref(false);
const showOrderAuthForm = ref(false);
const order = ref();
const isOrderLoading = ref(true);
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
        email: orderAuthState.email,
        zipcode: orderAuthState.postalCode,
        login: true,
        filter: [
          {
            field: "deepLinkCode",
            type: "equals",
            value: route.params.deepCode as string,
          },
        ],
      },
    });

    const orderData = result.data.orders?.elements?.[0] ?? null;
    if (!orderData) {
      errorNotFound.value = true;
    }
    return orderData;
  } catch (e) {
    if (e instanceof ApiClientError) {
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
    }
    order.value = null;
  }
};

order.value = await getOrderData();
isOrderLoading.value = false;

const authOrder = async () => {
  isOrderLoading.value = true;
  errorNotFound.value = false;
  try {
    order.value = await getOrderData();
  } finally {
    isOrderLoading.value = false;
  }
};

onMounted(() => {
  getOrderData();
});
</script>
<template>
  <div
    class="max-w-2xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:max-w-5xl lg:px-8"
  >
    <div v-if="isLoggedIn" class="mb-5">
      <NuxtLink
        :to="formatLink('/account/order')"
        class="text-sm flex flex-row gap-1 text-secondary-700 hover:text-primary"
      >
        <div class="w-5 h-5 i-carbon-chevron-left" />
        {{ $t("account.order.backToList") }}
      </NuxtLink>
    </div>

    <div v-if="errorNotFound && !isOrderLoading">
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div
          class="w-16 h-16 i-carbon-document-unknown text-gray-400 mb-4"
        />
        <h2 class="text-xl font-semibold text-gray-800 mb-2">
          {{ $t("account.messages.orderNotFound") }}
        </h2>
        <p class="text-sm text-gray-500 max-w-md">
          {{ $t("account.order.authOrderText") }}
        </p>
      </div>
    </div>

    <div v-if="showOrderAuthForm && !order">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        {{ $t("account.order.authOrderTitle") }}
      </h2>
      <p class="mb-6 text-sm text-gray-500">
        {{ $t("account.order.authOrderText") }}
      </p>
      <form class="flex flex-col gap-4 max-w-lg" @submit.prevent="authOrder">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label
              for="deep-link-email"
              class="block text-sm font-medium text-secondary-700 mb-1"
            >
              {{ $t("account.order.emailPlaceholder") }}
            </label>
            <input
              id="deep-link-email"
              v-model="orderAuthState.email"
              type="email"
              autocomplete="email"
              required
              :placeholder="$t('account.order.emailPlaceholder')"
              class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
            />
          </div>
          <div class="sm:w-2/5">
            <label
              for="deep-link-postal-code"
              class="block text-sm font-medium text-secondary-700 mb-1"
            >
              {{ $t("account.order.postalCodePlaceholder") }}
            </label>
            <input
              id="deep-link-postal-code"
              v-model="orderAuthState.postalCode"
              type="text"
              autocomplete="postal-code"
              required
              :placeholder="$t('account.order.postalCodePlaceholder')"
              class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ $t("account.order.authOrderButton") }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="order">
      <AccountOrderDetailView :order-id="order.id" />
    </div>
  </div>
</template>
