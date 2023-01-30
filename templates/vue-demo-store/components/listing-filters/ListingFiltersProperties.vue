<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

const { getCurrentFilters } = useListing({
  listingType: "productSearchListing",
});

defineProps<{
  filter: ListingFilter;
}>();

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const selectedOptionIds = computed(() => [
  ...getCurrentFilters.value.properties,
]);

const isOpen = ref<boolean>(false);

const onToggleOption = (entity: { code: string; id: string }) => {
  let options = [];
  if (selectedOptionIds.value.includes(entity.id)) {
    options = selectedOptionIds.value.filter((entry) => entry != entity.id);
  } else {
    options = [...selectedOptionIds.value, entity.id];
  }

  emits("select-value", {
    code: entity.code,
    value: options,
  });
};

const dropdownElement = ref(null);

onClickOutside(dropdownElement, () => (isOpen.value = false));
</script>

<template>
  <div ref="dropdownElement" class="relative">
    <button
      type="button"
      class="border-1 border-gray-500 px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500 rounded"
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
            @click="onToggleOption({ code: filter.code, id: option.id })"
          />
          <label
            :for="`filter-mobile-${filter.code}-${option.id}`"
            class="ml-3 min-w-0 flex-1 text-gray-500"
          >
            {{ getTranslatedProperty(option, "name") }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
