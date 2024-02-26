<script setup lang="ts">
import type { Schemas } from "#shopware";
import {
  CreateOrderActions,
  CreateOrderData,
  loadScript,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { onMounted, ref, computed, watch } from "vue";
import {
  useCheckout,
  useSessionContext,
  useProductSearch,
  useProductPrice,
  usePrice,
  useShopwareContext,
  useAddToCart,
  useCart,
} from "@shopware-pwa/composables-next/dist";
import {
  getSmallestThumbnailUrl,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import { useRoute } from "vue-router";

const route = useRoute();

const orderCreated = ref();
const redirectPaymentUrl = ref();
const productFound = ref<Schemas["Product"]>();
const isLoading = ref(true);
const { unitPrice } = useProductPrice(productFound);
const { search } = useProductSearch();
const { getFormattedPrice } = usePrice();
const { paymentMethods, getPaymentMethods, createOrder } = useCheckout();
const { setPaymentMethod } = useSessionContext();
const { apiClient } = useShopwareContext();
const { addToCart } = useAddToCart(productFound);
const { refreshCart } = useCart();

const productName = computed(() =>
  getTranslatedProperty(productFound.value, "name"),
);

const paypalMethod = computed(() => {
  return paymentMethods.value?.find(
    (method) => method.shortName === "pay_pal_payment_handler",
  );
});

const renderPaypalButtons = async () => {
  const paypal = await loadScript({
    clientId:
      "AfHYkB-D2otC9Ct7ohQJbhVqvq9IeMA5_sQ5p7aJVyd0lz3oEYn0K7v9ujnjaEBOpXUZhuBuR22R953z",
    currency: "EUR",
    locale: "en_US",
  });
  if (!paypal || !paypal.Buttons) {
    return;
  }

  paypal
    .Buttons({
      style: {
        label: "buynow",
      },
      onError(err) {
        console.warn("[PayPal > App.vue][onError]", err);
      },
      createOrder: async (
        data: CreateOrderData,
        actions: CreateOrderActions,
      ) => {
        if (!paypalMethod.value) {
          return "";
        }
        // 1. set the payment method id in the context PATCH /context -> setPaymentMethod
        // 2. add product to cart -> addToCart
        // 3. create order -> /store-api/paypal/express/create-order
        await setPaymentMethod(paypalMethod.value);
        await addToCart();

        const response = await apiClient.invoke(
          "payPalCreateOrder post /store-api/paypal/express/create-order?isPayPalExpressCheckout=1",
        );
        return response?.data?.token;
      },

      // Finalize the transaction after payer approval
      // Will be called if the payment process is approved by paypal
      onApprove: async (data: OnApproveData, actions: OnApproveActions) => {
        console.warn("onApprove", data);
        const response = await apiClient.invoke(
          "payPalPrepare post /store-api/paypal/express/prepare-checkout?isPayPalExpressCheckout=1",
          {
            token: data.orderID,
          },
        );
        orderCreated.value = await createOrder();
        refreshCart();
        const handlePaymentResponse = await apiClient.invoke(
          "handlePaymentMethod post /store-api/handle-payment",
          {
            orderId: orderCreated.value.id,
            successUrl: `${window.location.origin}/ExpressCheckout?order=${orderCreated.value.id}&success=true`,
          },
        );
        redirectPaymentUrl.value = handlePaymentResponse?.data?.redirectUrl;
        //
      },
    })
    .render("#paypal-buttons");
};
const orderId = Array.isArray(route?.query?.order)
  ? route?.query?.order.shift()
  : route?.query?.order;

watch(
  () => isLoading.value,
  (isLoading) => {
    if (!isLoading && !orderId) {
      renderPaypalButtons();
    }
  },
);

onMounted(async () => {
  if (!orderId) {
    await getPaymentMethods();
    const productResponse = await search("85a0d7e39bdf49d0a6f6318c6e464cc1");
    productFound.value = productResponse.product;
    isLoading.value = false;
    return;
  }
  const orderResponse = await apiClient.invoke("readOrder post /order", {
    filter: [{ type: "equals", field: "id", value: orderId }],
    associations: {
      transactions: { associations: { paymentMethod: {} } },
      addresses: {},
    },
  });

  if (orderResponse?.elements?.length) {
    orderCreated.value = orderResponse.elements[0];
  }
  isLoading.value = false;
});
</script>
<template>
  <div test-id="test-wrapper">
    <div v-if="!orderCreated">
      <div
        class="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
        role="alert"
      >
        <span class="font-medium">Sandbox mode!</span>Please use your own
        sandbox PayPal account to test the payment flow.<br /><br />⚠️Then Edit
        <strong>App.vue</strong> > <strong>clientId</strong> in
        <strong>renderPaypalButtons()</strong> function in order to have
        configured client for corresponding sandbox account.<br />
        It's better to test the example on your own API instance due to
        credentials problems in our demo store.
        <hr class="mt-4 mb-4" />
        Note that Pop-ups can be blocked by StackBlitz, so it's better to run
        this example locally.
      </div>
      <div
        v-if="!isLoading"
        class="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
      >
        <a href="#">
          <img
            class="p-8 rounded-t-lg"
            :src="getSmallestThumbnailUrl(productFound.cover.media)"
            alt="product image"
          />
        </a>
        <div class="px-5 pb-5">
          <a href="#">
            <h5
              class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
            >
              {{ productName }}
            </h5>
          </a>
          <div class="flex items-center justify-between">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">{{
              getFormattedPrice(unitPrice)
            }}</span>
          </div>
          <div class="mt-8" id="paypal-buttons"></div>
        </div>
      </div>
      <div
        v-else
        role="status"
        class="p-4 max-w-sm rounded border border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700"
      >
        <div
          class="flex justify-center items-center mb-4 h-48 bg-gray-300 rounded dark:bg-gray-700"
        >
          <svg
            class="w-32 h-32 p-8 text-gray-200 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path
              d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"
            />
          </svg>
        </div>
        <div
          class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
        ></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div class="flex justify-between items-center pt-4">
          <div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"
            ></div>
            <div
              class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
            ></div>
          </div>
          <div class="h-8 bg-gray-300 rounded-md dark:bg-gray-700 w-24"></div>
        </div>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else>
      <h1
        class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
      >
        Your order
        <mark class="px-2 text-white bg-blue-600 rounded dark:bg-blue-500"
          >#{{ orderCreated.orderNumber }}</mark
        >
        was created!
      </h1>
      <div
        class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Billing address
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{ orderCreated.addresses?.[0]?.firstName }}
          {{ orderCreated.addresses?.[0]?.lastName }}
        </p>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{ orderCreated.addresses?.[0]?.street }}
        </p>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{ orderCreated.addresses?.[0]?.zipcode }}
          {{ orderCreated.addresses?.[0]?.city }}
        </p>
      </div>
      <div
        class="mt-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Payment method
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{
            orderCreated.transactions?.[0]?.paymentMethod?.translated
              ?.description
          }}
        </p>
        <p
          v-if="redirectPaymentUrl"
          class="font-normal text-gray-700 dark:text-gray-400"
        >
          <a
            :href="redirectPaymentUrl"
            class="mt-4 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Finish your payment
            <svg
              class="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
