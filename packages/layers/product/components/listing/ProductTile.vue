<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";

type Props = {
  product: Schemas["Product"];
};
const emit = defineEmits<{
  addToCart: [{ id: string; qty?: number }];
}>();

const { product } = defineProps<Props>();
</script>
<template>
  <div>
    <img
      :src="product.cover?.media.url"
      alt="Product Image"
      class="h-80 object-cover"
    />
    <div class="p-2 flex flex-col gap-4">
      <div
        class="self-stretch justify-start text-surface-on-surface text-2xl font-normal font-['Noto_Serif'] leading-9"
      >
        {{ product.translated.name }} // We are using full props paths
      </div>
      <div class="text-surface-on-surface font-bold leading-normal">
        {{ product.calculatedCheapestPrice?.unitPrice }} $
      </div>
      <BaseButton
        @click.prevent="emit('addToCart', { id: product.id, qty: 1 })"
        class="w-full"
        :label="$t('product.addToCart')"
      />
    </div>
  </div>
</template>
