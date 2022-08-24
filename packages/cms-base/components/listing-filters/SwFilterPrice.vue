<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import { debounce } from "@shopware-pwa/helpers-next";
import { reactive, ref, watch } from "vue";
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

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isFilterVisible.value = false));

watch(
  () => prices.min,
  debounce((newPrice: number, oldPrice: number) => {
    if (newPrice == oldPrice) return;
    emits("select-value", {
      code: "min-price",
      value: newPrice,
    });
  }, 1000)
);

watch(
  () => prices.max,
  debounce((newPrice: number, oldPrice: number) => {
    if (newPrice == oldPrice) return;
    emits("select-value", {
      code: "max-price",
      value: newPrice,
    });
  }, 1000)
);
</script>

<template>
  <div ref="dropdownElement" class="filter-content">
    <h3 class="-mx-2 -my-3 flow-root">
      <button
        type="button"
        class="border-1 border-gray-500 px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500 rounded"
        @click="toggle"
      >
        <span class="font-medium text-gray-900">{{ filter.label }}</span>
        <span class="ml-6 flex items-center">
          <svg
            :class="['h-5 w-5', { hidden: isFilterVisible }]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            :class="['h-5 w-5', { hidden: !isFilterVisible }]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
    </h3>
    <div :class="[`absolute pt-6 z-1000`, { hidden: !isFilterVisible }]">
      <div class="space-y-6">
        <div class="mt-2 flex">
          <div class="w-1/2 flex rounded-md mr-4">
            <span
              class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
            >
              min
            </span>
            <input
              id="min-price"
              v-model="prices.min"
              type="number"
              name="min-price"
              class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
              :placeholder="prices.min?.toString()"
            />
          </div>
          <div class="w-1/2 flex rounded-md">
            <span
              class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
            >
              max
            </span>
            <input
              id="max-price"
              v-model="prices.max"
              type="number"
              name="max-price"
              class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
              :placeholder="prices.max?.toString()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
