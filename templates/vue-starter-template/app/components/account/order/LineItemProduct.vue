<script setup lang="ts">
import {
  downloadFile,
  getMedia,
  getSmallestThumbnailUrl,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";
const props = defineProps<{
  lineItem: Schemas["OrderLineItem"];
}>();

const { getMediaFile } = useOrderDetails(props.lineItem.orderId);

const isDigital = computed(
  () => !!props.lineItem.states?.includes("is-download"),
);

const coverUrl = computed(() => getSmallestThumbnailUrl(props.lineItem.cover));

const getMediaFileHandler = async (mediaId: string, fileName: string) => {
  const response = await getMediaFile(mediaId);
  downloadFile(response, fileName);
};
</script>
<template>
  <div class="flex gap-4 py-4 text-surface-on-surface">
    <div
      class="w-24 h-24 flex-shrink-0 overflow-hidden bg-surface-surface-container-low flex items-center justify-center"
    >
      <NuxtImg
        v-if="coverUrl"
        :src="coverUrl"
        :alt="lineItem.label"
        class="h-full w-full object-cover object-center"
      />
      <div
        v-else
        class="w-8 h-8 i-carbon-image text-surface-on-surface-variant"
      />
    </div>

    <div
      class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
    >
      <div>
        <div class="text-surface-on-surface leading-normal">
          {{ lineItem.label }}
          <span
            v-if="isDigital"
            data-testid="cart-product-digital-label"
            class="bg-states-info-container text-states-on-info-container text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full"
            >{{ $t("cart.digital") }}</span
          >
        </div>
        <div class="text-sm text-surface-on-surface-variant mt-1">
          {{ $t("account.order.quantity") }} {{ lineItem.quantity }}
        </div>
      </div>

      <div class="sm:text-right shrink-0">
        <SharedPrice
          v-if="lineItem.totalPrice"
          :value="lineItem.totalPrice"
          class="text-surface-on-surface"
          data-testid="order-item-totalprice"
        />
        <SharedPrice
          v-if="lineItem.unitPrice && lineItem.quantity > 1"
          :value="lineItem.unitPrice"
          class="text-sm text-surface-on-surface-variant font-normal"
          data-testid="order-item-unitprice"
        />
      </div>
    </div>
  </div>
  <template v-for="media in getMedia(lineItem)" :key="media.id">
    <div
      v-if="media.accessGranted"
      class="flex gap-2 cursor-pointer pl-5 pb-3 text-brand-primary hover:opacity-80"
      @click="getMediaFileHandler(media.id, media.fileName)"
    >
      <div class="w-5 h-5 i-carbon-download" />
      {{ media.fileName }}
    </div>
  </template>
</template>
