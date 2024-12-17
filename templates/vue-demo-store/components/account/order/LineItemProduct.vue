<script setup lang="ts">
import {
  downloadFile,
  getMedia,
  getSmallestThumbnailUrl,
} from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";
const props = defineProps<{
  lineItem: Schemas["OrderLineItem"];
}>();

const { getMediaFile } = useOrderDetails(props.lineItem.orderId);

const isDigital = computed(
  () => !!props.lineItem.states?.includes("is-download"),
);

const getMediaFileHandler = async (mediaId: string, fileName: string) => {
  const response = await getMediaFile(mediaId);
  downloadFile(response, fileName);
};
</script>
<template>
  <div
    class="flex flex-col sm:flex-row sm:grid grid-cols-5 gap-y-1 sm:gap-y-10 gap-x-1 py-4 border-t border-secondary-200 text-secondary-400 sm:items-center"
  >
    <div
      class="sm:flex items-center sm:items-center col-span-2 text-secondary-900"
    >
      <div
        class="w-full sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md mr-2"
      >
        <img
          :src="getSmallestThumbnailUrl(lineItem.cover)"
          :alt="lineItem.label"
          class="h-full w-full object-cover object-center"
        />
      </div>

      <div class="my-5 text-start">
        {{ lineItem.label }}
        <span
          v-if="isDigital"
          data-testid="cart-product-digital-label"
          class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
          >{{ $t("cart.digital") }}</span
        >
      </div>
    </div>
    <div class="flex justify-between">
      <div class="sm:hidden">{{ $t("account.order.quantity") }}</div>
      <div>{{ lineItem.quantity }}</div>
    </div>
    <div v-if="lineItem.unitPrice" class="flex justify-between">
      <div class="sm:hidden">{{ $t("account.order.price") }}</div>
      <SharedPrice
        :value="lineItem.unitPrice"
        class="text-secondary-600 font-normal"
        data-testid="order-item-unitprice"
      />
    </div>
    <div
      v-if="lineItem.totalPrice"
      class="flex justify-between sm:justify-self-end"
    >
      <div class="sm:hidden">{{ $t("account.order.subtotal") }}</div>
      <SharedPrice
        :value="lineItem.totalPrice"
        class="text-secondary-600 font-normal"
        data-testid="order-item-totalprice"
      />
    </div>
  </div>
  <template v-for="media in getMedia(lineItem)" :key="media.id">
    <div
      v-if="media.accessGranted"
      class="flex gap-2 cursor-pointer pl-5 pb-3 hover:text-primary-500"
      @click="getMediaFileHandler(media.id, media.fileName)"
    >
      <div class="w-5 h-5 i-carbon-download" />
      {{ media.fileName }}
    </div>
  </template>
</template>
