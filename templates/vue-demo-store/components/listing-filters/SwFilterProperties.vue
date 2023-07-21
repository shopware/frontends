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
</script>

<template>
  <div class="mb-8">
    <div class="flex flex-col my-2 max-h-[308px] overflow-y-auto">
      <div
        v-for="option in filter.options || filter.entities"
        :key="option.id"
        class="flex items-center py-3 pr-2"
      >
        <SharedCheckbox 
          :id="`filter-${filter.code}-${option.id}`"
          :modelValue="selectedOptionIds?.includes(option.id)"
          @update:modelValue="emits('select-value', { code: filter.code, value: option.id })"
          :name="filter.name"
        />
        <label :for="`filter-${filter.code}-${option.id}`" class="flex-1 cursor-pointer px-3 text-sm font-medium text-gray-700">
          {{ getTranslatedProperty(option, "name") }}
        </label>
        <span class="ml-auto text-sm font-medium text-gray-500">10</span>
      </div>
    </div>
  </div>
</template>
