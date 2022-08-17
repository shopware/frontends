<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import { inject, ref } from "vue";

defineProps<{
  filter: ListingFilter;
}>();

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();
const selectedOptionIds = inject<string[]>("selectedOptionIds");
const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isFilterVisible.value = false));
</script>

<template>
  <div class="filter-content" ref="dropdownElement">
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
    <div
      :class="[
        `absolute bg-white border-2 border-gray-300 max-h-70 overflow-auto p-3 rounded z-1000`,
        { hidden: !isFilterVisible },
      ]"
    >
      <div class="space-y-6">
        <div
          v-for="option in filter.options || filter.entities"
          :key="`${option.id}-${selectedOptionIds?.includes(option.id)}`"
          class="flex items-center"
        >
          <input
            :id="`filter-mobile-${filter.code}-${option.id}`"
            :checked="selectedOptionIds?.includes(option.id)"
            :name="filter.name"
            :value="option.name"
            type="checkbox"
            class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
            @click="
              emits('select-value', { code: filter.code, value: option.id })
            "
          />
          <label
            :for="`filter-mobile-${filter.code}-${option.id}`"
            class="ml-3 min-w-0 flex-1 text-gray-500"
          >
            {{ option.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
