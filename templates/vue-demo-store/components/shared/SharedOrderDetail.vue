<script setup lang="ts">
import { Order } from '@shopware-pwa/types';
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import SharedPrice from './SharedPrice.vue';
import SharedProductOrders from './SharedProductOrders.vue';

const props = defineProps<{
  order: Order;
}>();
const {
  loadOrderDetails,
  billingAddress,
  shippingAddress,
  paymentMethod,
  shippingMethod,
  order,
} = useOrderDetails(props.order.id);
const isLoading = ref(true);

onMounted(async () => {
  await loadOrderDetails();
  isLoading.value = false;
});
</script>

<template>
  <div
    v-if="isLoading"
    class="w-full h-full"
  >
    <div class="flex animate-pulse flex-col items-top h-full space-y-5">
      <div class="w-35 bg-gray-300 h-8 rounded-md" />
      <div class="w-20 bg-gray-300 h-6 rounded-md" />
      <div class="w-full bg-gray-300 h-10 rounded-md" />
      <div class="w-30 bg-gray-300 h-6 rounded-md" />
      <div class="w-full bg-gray-300 h-10 rounded-md" />
    </div>
  </div>
  <div v-else>
    <SharedProductOrders :line-items="order?.lineItems || []" />
    <div class="mt-6 border-b border-b-gray-200 text-gray-900">
      <div class="mb-6 flex justify-between">
        <span>{{ $t('subtotal') }}</span>
        <SharedPrice :value="order?.price?.totalPrice" />
      </div>
      <div class="mb-6 flex justify-between">
        <span>{{ $t('shipping') }}</span>
        <SharedPrice :value="order?.shippingTotal" />
      </div>
    </div>

    <div class="py-6 border-b border-b-gray-200 text-gray-900 flex items-center justify-between text-lg font-medium">
      <span>{{ $t('order_total') }}</span>
      <SharedPrice :value="order?.amountTotal" />
    </div>

    <div class="py-6 border-b border-b-gray-200 text-gray-900 grid grid-cols-2 text-sm">
      <div>
        <p class="font-medium text-gray-900 mb-2">
          {{ $t('shipping_address') }}
        </p>
        <p class="text-sm text-gray-500">
          {{ shippingAddress?.firstName }} {{ shippingAddress?.lastName }} <br>
          {{ shippingAddress?.street }}  <br>
          {{ shippingAddress?.zipcode }} {{ shippingAddress?.city }}<br>
        </p>
      </div>
      <div>
        <p class="font-medium text-gray-900 mb-2">
          {{ $t('billing_address') }}
        </p>
        <p class="text-sm text-gray-500">
          {{ billingAddress?.firstName }} {{ billingAddress?.lastName }} <br>
          {{ billingAddress?.street }}  <br>
          {{ billingAddress?.zipcode }} {{ billingAddress?.city }}<br>
        </p>
      </div>
    </div>
    <div class="pt-6 text-gray-900 grid grid-cols-2 text-sm">
      <div>
        <p class="font-medium text-gray-900 mb-2">
          {{ $t('payment_method') }}
        </p>
        <p class="text-sm text-gray-500">
          {{ getTranslatedProperty(paymentMethod, 'name') }}
        </p>
      </div>
      <div>
        <p class="font-medium text-gray-900 mb-2">
          {{ $t('shipping_method') }}
        </p>
        <p class="text-sm text-gray-500">
          {{ getTranslatedProperty(shippingMethod, 'name') }}<br>
          {{ getTranslatedProperty(shippingMethod?.deliveryTime, 'name') }}
        </p>
      </div>
    </div>
  </div>
</template>
