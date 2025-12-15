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

const cover = computed(() =>
  item.cover ? getSmallestThumbnailUrl(item.cover) : "",
);
</script>
<template>
  <div class="flex gap-4">
    <div class="w-37.5 h-37.5">
      <NuxtImg
        :src="cover"
        :alt="`${item.label || item.payload.name || ''} cart item`"
        class="object-cover object-center"
      />
    </div>
    <div class="grid grid-cols-2 justify-between py-2.5 grow">
      <div class="text-surface-on-surface">
        <div class="line-clamp-2">{{ item.label }}</div>
      </div>

      <SharedPrice
        class="text-right justify-start text-surface-on-surface ml-auto"
        :value="item.price?.totalPrice"
      />

      <div class="content-end">
        <FormQuantitySelect
          v-model="quantity"
          size="small"
          @update:modelValue="emit('updateQuantity', item.id, quantity)"
        />
      </div>
      <div class="content-end text-right">
        <FormLinkButton
          class="text-sm border-b-1 border-b-solid border-b-brand-primary hover:border-none"
          label="Remove"
          @click="emit('remove', item.id)"
        />
      </div>
    </div>
  </div>
</template>
