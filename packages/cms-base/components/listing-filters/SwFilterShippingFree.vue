<script setup lang="ts">
const $props = defineProps(["filter", "selectedFilters"])
const $emits = defineEmits(["select-value"])
const isFilterVisible = ref(false);
const currentFilterData = computed(() => !!$props.selectedFilters[$props.filter?.code])
const onChangeOption = () => {
  $emits('select-value', {code: $props.filter?.code, value: !currentFilterData.value})
}
</script>

<template>
<div class="filter-content">
  <h3 class="-mx-2 -my-3 flow-root">
    <!-- Expand/collapse section button -->
    <button type="button" class="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-0" aria-expanded="false" @click="isFilterVisible = !isFilterVisible">
      <span class="font-medium text-gray-900">{{ filter.label }}</span>
      <span class="ml-6 flex items-center">
        <!--
          Expand icon, show/hide based on section open state.

          Heroicon name: solid/plus-sm
        -->
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <!--
          Collapse icon, show/hide based on section open state.

          Heroicon name: solid/minus-sm
        -->
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>
  </h3>
  <!-- Filter section, show/hide based on section state. -->
  <div class="pt-6" id="filter-section-mobile-0" v-show="isFilterVisible">
    <div class="space-y-6">
      <input :id="`filter-mobile-${filter.id}-${filter.code}`" :checked="currentFilterData" :name="filter.name" :value="filter.name" @change="onChangeOption()" type="checkbox" class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500">
      <label :for="`filter-mobile-${filter.id}-${filter.code}`" class="ml-3 min-w-0 flex-1 text-gray-500"> {{ filter.label }} </label>
    </div>
  </div>
</div>
</template>