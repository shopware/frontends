<script setup lang="ts">
import type { OrderLineItem } from "@shopware-pwa/types";
import {
  getSmallestThumbnailUrl,
  getMedia,
  downloadFile,
} from "@shopware-pwa/helpers-next";
const props = defineProps<{
  lineItem: OrderLineItem;
}>();

const { getMediaFile } = useOrderDetails(props.lineItem.orderId);

const getMediaFileHandler = async (mediaId: string, fileName: string) => {
  const response = await getMediaFile(mediaId);
  downloadFile(response, fileName);
};
</script>

<script lang="ts">
export default {
  name: "AccountOrderLineItem",
};
</script>

<template>
  <div
    class="flex flex-col sm:flex-row sm:grid grid-cols-5 gap-y-3 sm:gap-y-10 gap-x-6 py-4 border-t border-gray-200 text-gray-400 sm:items-center"
  >
    <div class="sm:flex items-center sm:items-start col-span-2 text-gray-900">
      <div
        v-if="lineItem.type == 'product'"
        class="w-full sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md mr-2"
      >
        <img
          :src="getSmallestThumbnailUrl(lineItem.cover)"
          :alt="lineItem.label"
          class="h-full w-full object-cover object-center"
        />
      </div>
      <div v-else class="w-24" />
      <div class="my-5 text-center">
        {{ lineItem.label }}
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
        class="text-gray-600 font-normal"
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
        class="text-gray-600 font-normal"
        data-testid="order-item-totalprice"
      />
    </div>
  </div>
  <div class="pl-5 pb-3">
    <div
      v-for="media in getMedia(lineItem)"
      :key="media.id"
      class="cursor-pointer"
      @click="getMediaFileHandler(media.id, media.fileName)"
    >
      <div class="flex gap-2">
        <div class="w-5 h-5 i-carbon-result" />
        {{ media.fileName }}
      </div>
    </div>
  </div>
</template>
