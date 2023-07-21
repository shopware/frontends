<script setup lang="ts">
import { AggregationFilterEntityOption, ListingFilter } from "@shopware-pwa/types";
import { inject, ref } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import {
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';

const LIMIT = 1;
const props = defineProps<{
  filter: ListingFilter;
}>();
const isShowAll = ref<boolean>();
const searchText = ref<string>('');
const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();
const selectedOptionIds = inject<string[]>("selectedOptionIds");
const filter = computed(() => props.filter);

const elements = computed<AggregationFilterEntityOption[]>(
  () => {
    const temp = (filter.value?.options || filter.value?.entities || []) as AggregationFilterEntityOption[];
    return !searchText.value ? 
              temp : 
              temp.filter(x => getTranslatedProperty(x, 'name').toLowerCase().includes(searchText.value.toLowerCase()));
  });

const showElements = computed(() => {
  if (!isShowAll.value) {
    return elements.value.slice(0, LIMIT);
  } else {
    return elements.value;
  }
});

const toggleViewAll = () => {
  isShowAll.value = !isShowAll.value;
}

const searchBrand = (e: any) => {
  isShowAll.value = false;
  searchText.value = e.target.value;
}
</script>

<template>
  <div class="mb-8">
    <label
      for="search-box"
      class="block cursor-pointer w-full border border-gray-300 py-2 px-3"
    >
      <div class="flex items-center">
        <MagnifyingGlassIcon
          class="flex-none h-5 w-5 cursor-pointer text-gray-700"
        />

        <input
          id="search-box"
          @input="searchBrand"
          data-testid="layout-search-input"
          type="text"
          class="text-base text-gray-500 bg-transparent outline-none ml-2"
          :placeholder="$t('search_brands')"
        >
      </div>
    </label>
    <div class="flex flex-col my-2 max-h-[308px] overflow-y-auto">
      <div
        v-for="option in showElements"
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
    <button v-if="elements.length > LIMIT" class="text-gray-900 font-medium text-base underline" @click="toggleViewAll">
      {{ !isShowAll ? 'View all brands' : 'View less brands' }}
    </button>
  </div>
</template>
