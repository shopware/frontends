<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useCheckout, useSessionContext } from "@shopware-pwa/composables-next";
import { Error } from "@shopware-pwa/types";

const {
  paymentMethods,
  shippingMethods,
  getPaymentMethods,
  getShippingMethods,
  createOrder,
} = useCheckout();
const {
  setPaymentMethod,
  setShippingMethod,
  selectedPaymentMethod: paymentMethod,
  selectedShippingMethod: shippingMethod,
  refreshSessionContext,
} = useSessionContext();

const checkoutPaymentMethod = computed({
  get: () => paymentMethod.value?.id,
  set: (value) => value && setPaymentMethod({ id: value }),
});

const checkoutShippingMethod = computed({
  get: () => shippingMethod.value?.id,
  set: (value) => value && setShippingMethod({ id: value }),
});

const createOrderError = ref<Error[]>([]);

const createOrderProxy = async () => {
  try {
    const response = await createOrder();
  } catch (error) {
    createOrderError.value = (error as any).messages || [];
  }
};

onMounted(async () => {
  await refreshSessionContext();
  getPaymentMethods();
  getShippingMethods();
});
</script>
<template>
  <div>
    <div
      class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Payment methods
      </h5>
      <div
        v-for="paymentMethod in paymentMethods"
        :id="paymentMethod.id"
        class="flex mb-4"
      >
        <div class="flex items-center h-5">
          <input
            name="payment-method"
            v-model="checkoutPaymentMethod"
            :value="paymentMethod.id"
            :id="`paymentMethod-${paymentMethod.id}`"
            :aria-describedby="`paymentMethod-${paymentMethod.id}-text`"
            type="radio"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div class="ml-2 text-sm">
          <label
            :for="`paymentMethod-${paymentMethod.id}`"
            class="font-medium text-gray-900 dark:text-gray-300"
            >{{ paymentMethod.translated?.name }}</label
          >
          <p
            :id="`paymentMethod-${paymentMethod.id}-text`"
            class="text-xs font-normal text-gray-500 dark:text-gray-300"
          >
            {{ paymentMethod.translated?.description }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="mt-4 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Shipping methods
      </h5>
      <div
        v-for="shippingMethod in shippingMethods"
        :id="shippingMethod.id"
        class="flex mb-4"
      >
        <div class="flex items-center h-5">
          <input
            name="shipping-method"
            v-model="checkoutShippingMethod"
            :value="shippingMethod.id"
            :id="`shippingMethod-${shippingMethod.id}`"
            :aria-describedby="`shippingMethod-${shippingMethod.id}-text`"
            type="radio"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div class="ml-2 text-sm">
          <label
            :for="`shippingMethod-${shippingMethod.id}`"
            class="font-medium text-gray-900 dark:text-gray-300"
            >{{ shippingMethod.translated?.name }}</label
          >
          <p
            :id="`shippingMethod-${shippingMethod.id}-text`"
            class="text-xs font-normal text-gray-500 dark:text-gray-300"
          >
            {{ shippingMethod.translated?.description }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-4 max-w-sm">
      <button
        @click="createOrderProxy"
        class="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
      >
        <span
          class="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
        >
          Create the order
        </span>
      </button>
    </div>
    <div v-if="createOrderError.length" class="max-w-sm">
      <div
        v-for="error in createOrderError"
        :id="error.code"
        class="p-4 mt-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
        role="alert"
      >
        <span class="font-medium">{{ error.code }}</span> {{ error.detail }}
      </div>
    </div>
  </div>
</template>
