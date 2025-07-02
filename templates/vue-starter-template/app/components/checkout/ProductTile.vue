<script lang="ts" setup>
import { getSmallestThumbnailUrl } from "@shopware/helpers";
import type { Schemas } from "#shopware";

const { item } = defineProps<{
  item: Schemas["LineItem"];
}>();

const quantity = ref(item.quantity);

const emit = defineEmits<{
  remove: [id: string];
  updateQuantity: [id: string, quantity: number];
}>();
</script>
<template>
  <div class="flex gap-4">
    <NuxtImg
      :src="getSmallestThumbnailUrl(item.cover)"
      :alt="`${item.label || item.payload.name || ''} cart item`"
      class="object-cover object-center"
      width="151"
      height="151"
    />
    <div class="grid grid-cols-2 justify-between py-2.5 grow">
      <div class="self-stretch justify-start text-surface-on-surface">
        {{ item.label }}
      </div>

      <SharedPrice
        class="text-right justify-start text-surface-on-surface ml-auto"
        :value="item.price?.totalPrice"
      />

      <div class="content-end">
        <FormQuantitySelect v-model="quantity" size="small" @update:modelValue="emit('updateQuantity', item.id, quantity)" />
      </div>
      <div class="content-end text-right">
        <FormLinkButton label="Remove" @click="emit('remove', item.id)" />
      </div>
    </div>
  </div>
</template>
