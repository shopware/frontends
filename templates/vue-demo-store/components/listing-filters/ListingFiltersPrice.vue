<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
}>();

const prices = reactive<{ min: number; max: number }>({
  min: props.filter?.min || 0,
  max: props.filter?.max || 0,
});

const isOpen = ref<boolean>(false);

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isOpen.value = false));

function onMinPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice == oldPrice) return;
  emits("select-value", {
    code: "min-price",
    value: newPrice,
  });
}
const debounceMinPriceUpdate = useDebounceFn(onMinPriceChange, 1000);
watch(() => prices.min, debounceMinPriceUpdate);

function onMaxPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice == oldPrice) return;
  emits("select-value", {
    code: "max-price",
    value: newPrice,
  });
}
const debounceMaxPriceUpdate = useDebounceFn(onMaxPriceChange, 1000);
watch(() => prices.max, debounceMaxPriceUpdate);
</script>

<template>
  <div ref="dropdownElement" class="relative">
    <button
      type="button"
      class="border-2 border-gray-300 px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500 rounded"
      @click="isOpen = !isOpen"
    >
      <span class="font-medium text-gray-900">{{ filter.label }}</span>
      <span class="ml-6 flex items-center">
        <div
          class="h-5 w-5"
          :class="[!isOpen ? 'i-carbon-chevron-down' : 'i-carbon-chevron-up']"
        />
      </span>
    </button>
    <div
      :class="[
        `absolute bg-white mt-1 border-2 rounded border-gray-300 p-3 z-1000`,
        { hidden: !isOpen },
      ]"
    >
      <div class="flex gap-4 text-sm text-gray-500">
        <div class="w-36">
          <div>{{ $t("listing.min") }}</div>
          <input
            id="min-price"
            v-model="prices.min"
            type="number"
            name="min-price"
            class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full border border-gray-300 rounded"
            :placeholder="prices.min?.toString()"
          />
        </div>
        <div class="w-36">
          <div>{{ $t("listing.max") }}</div>
          <input
            id="max-price"
            v-model="prices.max"
            type="number"
            name="max-price"
            class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full border border-gray-300 rounded"
            :placeholder="prices.max?.toString()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
