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
      <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md mr-2">
        <img
          :src="getMainImageUrl(lineItem)"
          :alt="lineItem.label"
          class="h-full w-full object-cover object-center"
        />
      </div>
      {{ lineItem.label }}
    </div>
    <div>{{ lineItem.quantity }}</div>
    <div>{{ lineItem.unitPrice }}</div>
    <div class="justify-self-end">
      {{ lineItem.totalPrice }}
    </div>
  </div>
</template>
