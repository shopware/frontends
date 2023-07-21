<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import { inject } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

const props = defineProps<{
  filter: ListingFilter;
}>();

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();
const selectedOptionIds = inject<string[]>("selectedOptionIds");

const filter = computed(() => props.filter);
</script>
<template>
  <div class="mb-8">
    <div class="flex flex-col my-2 max-h-[308px] overflow-y-auto -mx-2 px-2">
      <div
        v-for="option in filter.options || filter.entities"
        :key="option.id"
        class="flex items-center py-3 pr-2"
      >
        <label>
          <input 
            :id="`filter-${filter.code}-${option.id}`"
            class="hidden"
            type="checkbox"
            :checked="selectedOptionIds?.includes(option.id)"
            @change="emits('select-value', { code: filter.code, value: option.id })"
          />
          <div :class="[selectedOptionIds?.includes(option.id) ? 'ring-2 ring-gray-500' : '', 'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none']">
            <span aria-hidden="true" :class="['h-6 w-6 rounded-full border border-black border-opacity-25']" :style="{ backgroundColor: `${option.colorHexCode}` }" />
          </div>
        </label>
        <label :for="`filter-${filter.code}-${option.id}`" class="flex items-center self-stretch flex-1 cursor-pointer px-3 text-gray-700 text-sm font-medium"> {{ getTranslatedProperty(option, 'name') }} </label>
        <span class="ml-auto text-sm font-medium text-gray-500">10</span>
      </div>
    </div>
  </div>
</template>
