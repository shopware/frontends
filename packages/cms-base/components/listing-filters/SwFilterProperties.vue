<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import { inject, ref } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

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
  <div ref="dropdownElement" class="filter-content">
    <h3 class="-mx-2 -my-3 flow-root">
      <button
        type="button"
        class="border-1 border-gray-500 px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500 rounded"
        @click="toggle"
      >
        <span class="font-medium text-gray-900">{{ filter.label }}</span>
        <span class="ml-6 flex items-center">
          <div
            class="h-5 w-5"
            :class="[
              !isFilterVisible
                ? 'i-carbon-chevron-down'
                : 'i-carbon-chevron-up',
            ]"
          ></div>
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
          <label
            :for="`filter-mobile-${filter.code}-${option.id}`"
            class="min-w-0 flex-1 text-gray-500 flex items-center gap-2 relative"
            @click="
              emits('select-value', { code: filter.code, value: option.id })
            "
          >
            <div v-if="option.media?.url">
              <!-- "Active status" will be changed with the redesign task  -->
              <img
                class="h-6 w-6"
                :src="option.media.url"
                :alt="option.media.translated?.alt"
                :class="{
                  'border-blue border-2': selectedOptionIds?.includes(
                    option.id
                  ),
                }"
              />
            </div>
            <!-- "Active status" will be changed with the redesign task  -->
            <div
              v-else-if="option.colorHexCode"
              class="h-6 w-6"
              :style="`background-color: ${option.colorHexCode}`"
              :class="{
                'border-blue border-2': selectedOptionIds?.includes(option.id),
              }"
            />
            <input
              v-else
              :id="`filter-mobile-${filter.code}-${option.id}`"
              :checked="selectedOptionIds?.includes(option.id)"
              :name="filter.name"
              :value="option.name"
              type="checkbox"
              class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              {{ getTranslatedProperty(option, 'name') }}
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
