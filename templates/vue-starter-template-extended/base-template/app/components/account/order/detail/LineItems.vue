<script setup lang="ts">
import { getMedia, getSmallestThumbnailUrl } from "@shopware/helpers";
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrderDetailLineItems",
});

defineProps<{
  lineItems: Array<Schemas["OrderLineItem"]>;
}>();

const emit = defineEmits<{
  download: [mediaId: string, fileName: string];
}>();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-outline-outline-variant">
      <thead class="bg-surface-surface-container-low">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
          >
            {{ $t("account.orderDetails.itemsHeader.item") }}
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
          >
            {{ $t("account.orderDetails.itemsHeader.quantity") }}
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
          >
            {{ $t("account.orderDetails.itemsHeader.price") }}
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
          >
            {{ $t("account.orderDetails.itemsHeader.total") }}
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-surface-surface divide-y divide-outline-outline-variant"
      >
        <template v-for="item in lineItems" :key="item.id">
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="item.type === 'product'"
                    class="h-10 w-10"
                    :src="getSmallestThumbnailUrl(item.cover)"
                    :alt="item.label"
                  />
                  <div
                    v-else-if="item.type === 'promotion'"
                    class="h-10 w-10 i-carbon-tag text-3xl text-center"
                  ></div>
                </div>
                <div class="ml-4">
                  <div
                    class="text-sm font-medium text-surface-on-surface"
                  >
                    {{ item.label }}

                    <span
                      v-if="item.type === 'promotion'"
                      class="bg-states-success-container text-states-on-success-container text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"
                      >{{ $t("cart.promotion") }}</span
                    >
                  </div>
                </div>
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant"
            >
              {{ item.quantity }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant"
            >
              <SharedPrice
                :value="item.unitPrice"
                class="text-surface-on-surface font-normal"
                data-testid="order-item-unitprice"
              />
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant"
            >
              <SharedPrice
                :value="item.totalPrice"
                class="text-surface-on-surface font-normal"
                data-testid="order-item-totalprice"
              />
            </td>
          </tr>
          <tr v-if="item.downloads?.length">
            <td colspan="4" class="py-3">
              <template
                v-for="media in getMedia(item)"
                :key="media.id"
              >
                <div
                  v-if="media.accessGranted"
                  class="flex gap-2 cursor-pointer pl-5 pb-3 hover:text-brand-primary"
                  @click="emit('download', media.id, media.fileName)"
                >
                  <div class="w-5 h-5 i-carbon-download" />
                  {{ media.fileName }}
                </div>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
