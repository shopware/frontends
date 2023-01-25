<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";

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
  ...getCurrentFilters.value.manufacturer,
]);

const isOpen = ref<boolean>(false);

const onToggleOption = (entity: { code: string; id: string }) => {
  let manufacturerIds = [];
  if (selectedOptionIds.value.includes(entity.id)) {
    manufacturerIds = selectedOptionIds.value.filter(
      (entry) => entry != entity.id
    );
  } else {
    manufacturerIds = [...selectedOptionIds.value, entity.id];
  }

  emits("select-value", {
    code: entity.code,
    value: manufacturerIds,
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
      <div class="space-y-6">
        <div
          v-for="entity in filter.entities"
          :key="`${entity.id}-${selectedOptionIds?.includes(entity.id)}`"
          class="flex items-center"
        >
          <input
            :id="`filter-mobile-${filter.code}-${entity.id}`"
            :checked="selectedOptionIds?.includes(entity.id)"
            :name="filter.name"
            :value="entity.name"
            type="checkbox"
            class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
            @click="onToggleOption({ code: filter.code, id: entity.id })"
          />
          <label
            :for="`filter-mobile-${filter.code}-${entity.id}`"
            class="ml-3 min-w-0 flex-1 text-gray-500"
          >
            {{ entity.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
