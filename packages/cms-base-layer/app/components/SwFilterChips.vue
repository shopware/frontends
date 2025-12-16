<script setup lang="ts">
import { computed } from "vue";
import type { Schemas } from "#shopware";

type FilterState = {
  manufacturer: Set<string>;
  properties: Set<string>;
  "min-price": number | undefined;
  "max-price": number | undefined;
  rating: number | undefined;
  "shipping-free": boolean | undefined;
};

type Filter = {
  id: string;
  code: string;
  options?: Array<
    | Schemas["PropertyGroupOption"]
    | { id: string; translated?: { name?: string } }
  >;
  entities?: Array<
    | Schemas["ProductManufacturer"]
    | { id: string; translated?: { name?: string } }
  >;
};

const props = defineProps<{
  filters: FilterState;
  availableFilters: Filter[];
}>();

const emit = defineEmits<{
  remove: [{ code: string; value: string | number }];
}>();

const getTranslatedName = (
  item: { translated?: { name?: string }; name?: string } | undefined,
): string | null => {
  if (!item) return null;
  if ("translated" in item) {
    return item.translated?.name || ("name" in item ? item.name : null) || null;
  }
  return null;
};

const activeChips = computed(() => {
  const chips: Array<{ label: string; code: string; value: string | number }> =
    [];

  // Add property filters
  const properties = Array.from(props.filters.properties);
  for (const propertyId of properties) {
    // Check all filters, not just the one with code "properties"
    // because properties can be in multiple filter groups
    for (const filter of props.availableFilters) {
      if ("options" in filter && filter.options) {
        const option = filter.options.find((o) => o.id === propertyId);
        const name = getTranslatedName(option);
        if (name) {
          chips.push({
            label: name,
            code: "properties",
            value: propertyId,
          });
          break;
        }
      }
    }
  }

  // Add manufacturer filters
  const manufacturers = Array.from(props.filters.manufacturer);
  for (const manufacturerId of manufacturers) {
    const filter = props.availableFilters.find(
      (f) => f.code === "manufacturer",
    );
    if (filter && "entities" in filter && filter.entities) {
      const entity = filter.entities.find((e) => e.id === manufacturerId);
      const name = getTranslatedName(entity);
      if (name) {
        chips.push({
          label: name,
          code: "manufacturer",
          value: manufacturerId,
        });
      }
    }
  }

  // Add price filters
  if (props.filters["min-price"] || props.filters["max-price"]) {
    const min = props.filters["min-price"] || 0;
    const max = props.filters["max-price"] || "∞";
    chips.push({
      label: `Price: ${min} - ${max}`,
      code: "price",
      value: "price-range",
    });
  }

  // Add rating filter
  if (props.filters.rating) {
    chips.push({
      label: `Rating: ${props.filters.rating}★`,
      code: "rating",
      value: props.filters.rating,
    });
  }

  // Add shipping free filter
  if (props.filters["shipping-free"]) {
    chips.push({
      label: "Free Shipping",
      code: "shipping-free",
      value: "true",
    });
  }

  return chips;
});

const handleRemoveChip = (chip: { code: string; value: string | number }) => {
  emit("remove", chip);
};
</script>

<template>
  <div
    v-if="activeChips.length > 0"
    class="self-stretch inline-flex justify-start items-center gap-4 flex-wrap content-center mb-6"
  >
    <button
      v-for="(chip, index) in activeChips"
      :key="`${chip.code}-${chip.value}-${index}`"
      @click="handleRemoveChip(chip)"
      class="px-4 py-1.5 bg-brand-tertiary rounded-full inline-flex justify-center items-center gap-1 hover:bg-brand-tertiary-hover transition-colors"
    >
      <span class="text-brand-on-tertiary text-base font-normal leading-normal">
        {{ chip.label }}
      </span>
      <span class="i-carbon-close w-5 h-5 text-brand-on-tertiary"></span>
    </button>
  </div>
</template>
