<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";

const props = defineProps<{
  filter: ListingFilter;
}>();

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const state = ref<boolean>(false);
const isOpen = ref<boolean>(false);

const onChangeOption = (): void => {
  state.value = !state.value;

  emits("select-value", {
    code: props.filter?.code,
    value: state.value,
  });
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isOpen.value = false));
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
        `absolute mt-1 bg-white border-2 border-gray-300 max-h-70 overflow-auto p-3 rounded z-1000`,
        { hidden: !isOpen },
      ]"
    >
      <div class="flex items-center">
        <input
          :id="`filter-mobile-${filter.id || filter.code}`"
          :checked="state"
          :name="filter.name"
          :value="filter.name"
          type="checkbox"
          class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
          @change="onChangeOption"
        />
        <label
          :for="`filter-mobile-${filter.id || filter.code}`"
          class="ml-3 min-w-0 flex-1 text-gray-500"
        >
          {{ filter.label }}
        </label>
      </div>
    </div>
  </div>
</template>
