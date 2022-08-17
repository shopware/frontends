<script setup lang="ts">
import { getMainImageUrl, isProduct } from "@shopware-pwa/helpers-next";
import { OrderLineItem } from "@shopware-pwa/types";

const props = defineProps<{
  orderItem: OrderLineItem;
}>();

const isPromotion = computed(() => isProduct(props.orderItem.payload));
const itemRegularPrice = computed(() => props.orderItem?.unitPrice);
const itemQuantity = computed(() => props.orderItem?.quantity);
const productOptions = computed(() =>
  isProduct(props.orderItem.payload)
    ? (props.orderItem.payload.options as unknown as Array<{
        group: string;
        option: string;
      }>)
    : []
);
</script>

<template>
  <div
    v-if="!isPromotion"
    class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
  >
    <img
      :src="getMainImageUrl(orderItem)"
      alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
      class="h-full w-full object-cover object-center"
    />
  </div>

  <div class="ml-4 flex flex-1 flex-col">
    <div>
      <div class="flex justify-between text-base font-medium text-gray-900">
        <h3>
          {{ orderItem.label }}
        </h3>
        <p class="ml-4">{{ itemRegularPrice }} EUR</p>
      </div>
      <p class="mt-1 text-sm text-gray-500">
        <span v-for="option in productOptions" :key="option.group" class="mr-2">
          {{ option.group }}: {{ option.option }}
        </span>
      </p>
    </div>
    <div class="flex flex-1 items-end justify-between text-sm">
      <p class="text-gray-500">Qty {{ itemQuantity }}</p>
    </div>
  </div>
</template>
