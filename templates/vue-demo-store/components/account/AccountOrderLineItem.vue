<script setup lang="ts">
import { OrderLineItem } from "@shopware-pwa/types";
import { getMainImageUrl } from "@shopware-pwa/helpers-next";

defineProps<{
  lineItem: OrderLineItem;
}>();
</script>

<script lang="ts">
export default {
  name: "AccountOrderLineItem",
};
</script>

<template>
  <div
    class="grid grid-cols-5 gap-y-10 gap-x-6 py-4 border-t border-gray-200 text-gray-400 items-center"
  >
    <div class="flex items-center col-span-2 text-gray-900">
      <div
        v-if="lineItem.type == 'product'"
        class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md mr-2"
      >
        <img
          :src="getMainImageUrl(lineItem)"
          :alt="lineItem.label"
          class="h-full w-full object-cover object-center"
        />
      </div>
      <div v-else class="w-24"></div>
      {{ lineItem.label }}
    </div>
    <div>{{ lineItem.quantity }}</div>
    <div v-if="lineItem.unitPrice">
      <SharedPrice
        :value="lineItem.unitPrice"
        class="text-gray-600 font-normal"
        data-testid="order-item-unitprice"
      />
    </div>
    <div v-if="lineItem.totalPrice" class="justify-self-end">
      <SharedPrice
        :value="lineItem.totalPrice"
        class="text-gray-600 font-normal"
        data-testid="order-item-totalprice"
      />
    </div>
  </div>
</template>
