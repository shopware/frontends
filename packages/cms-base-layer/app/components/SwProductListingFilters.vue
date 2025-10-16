<script setup lang="ts">
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { onClickOutside } from "@vueuse/core";
import { defu } from "defu";
import { computed, reactive, ref, useTemplateRef } from "vue";
import type { ComputedRef, UnwrapNestedRefs } from "vue";
import { type LocationQueryRaw, useRoute, useRouter } from "vue-router";
import { useCategoryListing } from "#imports";
import type { Schemas, operations } from "#shopware";

const props = defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

type Translations = {
  listing: {
    filters: string;
    sort: string;
    resetFilters: string;
  };
};

type FilterState = {
  manufacturer: Set<string>;
  properties: Set<string>;
  "min-price": number | undefined;
  "max-price": number | undefined;
  rating: number | undefined;
  "shipping-free": boolean | undefined;
};

let translations: Translations = {
  listing: {
    filters: "Filters",
    sort: "Sort",
    resetFilters: "Reset filters",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const route = useRoute();
const router = useRouter();

const isSortMenuOpen = ref(false);
const {
  changeCurrentSortingOrder,
  filtersToQuery,
  getCurrentFilters,
  getCurrentSortingOrder,
  getInitialFilters,
  getSortingOrders,
  search,
} = useCategoryListing();

const sidebarSelectedFilters: UnwrapNestedRefs<FilterState> =
  reactive<FilterState>({
    manufacturer: new Set(),
    properties: new Set(),
    "min-price": undefined,
    "max-price": undefined,
    rating: undefined,
    "shipping-free": undefined,
  });

const showResetFiltersButton = computed<boolean>(() => {
  if (
    sidebarSelectedFilters.manufacturer.size !== 0 ||
    sidebarSelectedFilters.properties.size !== 0 ||
    sidebarSelectedFilters["max-price"] ||
    sidebarSelectedFilters["min-price"] ||
    sidebarSelectedFilters.rating ||
    sidebarSelectedFilters["shipping-free"]
  ) {
    return true;
  }

  return false;
});

const searchCriteriaForRequest: ComputedRef<Schemas["ProductListingCriteria"]> =
  computed(() => ({
    manufacturer: [
      ...(sidebarSelectedFilters.manufacturer as Set<string>),
    ]?.join("|"),
    properties: [...(sidebarSelectedFilters.properties as Set<string>)]?.join(
      "|",
    ),
    "min-price": sidebarSelectedFilters["min-price"] as number,
    "max-price": sidebarSelectedFilters["max-price"] as number,
    order: getCurrentSortingOrder.value as string,
    "shipping-free": sidebarSelectedFilters["shipping-free"] as boolean,
    rating: sidebarSelectedFilters.rating as number,
    search: "",
    limit: route.query.limit ? Number(route.query.limit) : 15,
  }));

for (const param in route.query) {
  if (param in sidebarSelectedFilters) {
    const queryValue = route.query[param];

    // Skip arrays
    if (Array.isArray(queryValue)) continue;

    if (["manufacturer", "properties"].includes(param)) {
      if (typeof queryValue === "string") {
        const elements = queryValue.split("|");
        const targetSet = sidebarSelectedFilters[
          param as keyof FilterState
        ] as Set<string>;
        for (const element of elements) {
          targetSet.add(element);
        }
      }
    } else if (queryValue && typeof queryValue === "string") {
      // Fix: Use specific property assignments instead of generic keyof
      if (param === "min-price") {
        const numValue = Number(queryValue);
        if (!Number.isNaN(numValue)) {
          sidebarSelectedFilters["min-price"] = numValue;
        }
      } else if (param === "max-price") {
        const numValue = Number(queryValue);
        if (!Number.isNaN(numValue)) {
          sidebarSelectedFilters["max-price"] = numValue;
        }
      } else if (param === "rating") {
        const numValue = Number(queryValue);
        if (!Number.isNaN(numValue)) {
          sidebarSelectedFilters.rating = numValue;
        }
      } else if (param === "shipping-free") {
        sidebarSelectedFilters["shipping-free"] = queryValue === "true";
      }
    }
  }
}

const handleFiltersUpdate = async (updatedFilters: FilterState) => {
  try {
    sidebarSelectedFilters.manufacturer = updatedFilters.manufacturer;
    sidebarSelectedFilters.properties = updatedFilters.properties;
    sidebarSelectedFilters["min-price"] = updatedFilters["min-price"];
    sidebarSelectedFilters["max-price"] = updatedFilters["max-price"];
    sidebarSelectedFilters.rating = updatedFilters.rating;
    sidebarSelectedFilters["shipping-free"] = updatedFilters["shipping-free"];

    await executeSearch();
  } catch (error) {
    console.error("Filter update failed:", error);
  }
};

const executeSearch = async () => {
  try {
    await search(searchCriteriaForRequest.value);
    const query = filtersToQuery(searchCriteriaForRequest.value);
    const { limit: _, ...queryWithoutLimit } = query;

    await router.push({
      query: queryWithoutLimit as LocationQueryRaw,
    });
  } catch (error) {
    console.error("Search execution failed:", error);
  }
};

const clearFilters = () => {
  (sidebarSelectedFilters.manufacturer as Set<string>).clear();
  (sidebarSelectedFilters.properties as Set<string>).clear();
  sidebarSelectedFilters["min-price"] = undefined;
  sidebarSelectedFilters["max-price"] = undefined;
  sidebarSelectedFilters.rating = undefined;
  sidebarSelectedFilters["shipping-free"] = undefined;
};

const currentSortingOrder = computed({
  get: (): string => getCurrentSortingOrder.value || "",
  set: async (order: string): Promise<void> => {
    try {
      await router.push({
        query: {
          ...route.query,
          order,
        },
      });

      await changeCurrentSortingOrder(order, {
        ...(route.query as unknown as operations["searchPage post /search"]["body"]),
        limit: route.query.limit ? Number(route.query.limit) : 15,
      });
    } catch (error) {
      console.error("Sorting order change failed:", error);
    }
  },
});

async function invokeCleanFilters() {
  try {
    clearFilters();
    await executeSearch();
  } catch (error) {
    console.error("Clear filters failed:", error);
  }
}

const isDefaultSidebarFilter =
  props.content.type === "sidebar-filter" &&
  props.content.config?.boxLayout?.value === "standard";

const dropdownElement = useTemplateRef("dropdownElement");
onClickOutside(dropdownElement, () => {
  isSortMenuOpen.value = false;
});

const handleSortingClick = (key: string) => {
  currentSortingOrder.value = key;
  isSortMenuOpen.value = false;
};

// Active filter chips logic
const activeFilterChips = computed(() => {
  const chips: Array<{ label: string; code: string; value: string | number }> =
    [];

  // Add property filters
  const properties = Array.from(sidebarSelectedFilters.properties);
  for (const propertyId of properties) {
    // Check all filters, not just the one with code "properties"
    // because properties can be in multiple filter groups
    for (const filter of getInitialFilters.value) {
      if ("options" in filter && filter.options) {
        const option = filter.options.find((o) => o.id === propertyId);
        if (option && "translated" in option) {
          const name =
            option.translated?.name || ("name" in option ? option.name : null);
          if (name) {
            chips.push({
              label: String(name),
              code: "properties",
              value: propertyId,
            });
            break;
          }
        }
      }
    }
  }

  // Add manufacturer filters
  const manufacturers = Array.from(sidebarSelectedFilters.manufacturer);
  for (const manufacturerId of manufacturers) {
    const filter = getInitialFilters.value.find(
      (f) => f.code === "manufacturer",
    );
    if (filter && "entities" in filter && filter.entities) {
      const entity = filter.entities.find((e) => e.id === manufacturerId);
      if (entity && "translated" in entity) {
        const name =
          entity.translated?.name || ("name" in entity ? entity.name : null);
        if (name) {
          chips.push({
            label: String(name),
            code: "manufacturer",
            value: manufacturerId,
          });
        }
      }
    }
  }

  // Add price filters
  if (
    sidebarSelectedFilters["min-price"] ||
    sidebarSelectedFilters["max-price"]
  ) {
    const min = sidebarSelectedFilters["min-price"] || 0;
    const max = sidebarSelectedFilters["max-price"] || "∞";
    chips.push({
      label: `Price: ${min} - ${max}`,
      code: "price",
      value: "price-range",
    });
  }

  // Add rating filter
  if (sidebarSelectedFilters.rating) {
    chips.push({
      label: `Rating: ${sidebarSelectedFilters.rating}★`,
      code: "rating",
      value: sidebarSelectedFilters.rating,
    });
  }

  // Add shipping free filter
  if (sidebarSelectedFilters["shipping-free"]) {
    chips.push({
      label: "Free Shipping",
      code: "shipping-free",
      value: "true",
    });
  }

  return chips;
});

const removeFilterChip = async (chip: {
  code: string;
  value: string | number;
}) => {
  if (chip.code === "properties" || chip.code === "manufacturer") {
    const filterSet = sidebarSelectedFilters[chip.code] as Set<string>;
    filterSet.delete(String(chip.value));
  } else if (chip.code === "price") {
    sidebarSelectedFilters["min-price"] = undefined;
    sidebarSelectedFilters["max-price"] = undefined;
  } else if (chip.code === "rating") {
    sidebarSelectedFilters.rating = undefined;
  } else if (chip.code === "shipping-free") {
    sidebarSelectedFilters["shipping-free"] = undefined;
  }

  await executeSearch();
};
</script>
<template>
  <div>
    <!-- Active Filter Chips -->
    <ClientOnly>
      <div v-if="activeFilterChips.length > 0" class="self-stretch inline-flex justify-start items-center gap-4 flex-wrap content-center mb-6">
        <button
          v-for="(chip, index) in activeFilterChips"
          :key="`${chip.code}-${chip.value}-${index}`"
          @click="removeFilterChip(chip)"
          class="px-4 py-1.5 bg-brand-tertiary rounded-full inline-flex justify-center items-center gap-1 hover:bg-brand-tertiary-hover transition-colors"
        >
          <span class="text-brand-on-tertiary text-base font-normal leading-normal">
            {{ chip.label }}
          </span>
          <span class="i-carbon-close w-5 h-5 text-brand-on-tertiary"></span>
        </button>
      </div>
    </ClientOnly>

    <div class="self-stretch flex flex-col justify-start items-start gap-4">
      <div class="flex flex-row items-center justify-between w-full py-3 border-b border-outline-outline-variant">
        <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal mb-8">
          {{ translations.listing.filters }}
        </div>
        <div ref="dropdownElement" class="flex items-center">
          <div class="relative inline-block text-left">
            <SwBaseButton
              variant="ghost"
              size="medium"
              type="button"
              @click="isSortMenuOpen = !isSortMenuOpen"
              id="menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              class="group"
            >
              {{ translations.listing.sort }}
              <span class="ml-1 inline-flex items-center">
                <SwChevronIcon :direction="isSortMenuOpen ? 'up' : 'down'" :size="24" :aria-label="isSortMenuOpen ? 'Close sort menu' : 'Open sort menu'" />
              </span>
            </SwBaseButton>
            <ClientOnly>
              <div :class="[isSortMenuOpen ? 'absolute' : 'hidden']"
                class="origin-top-left left-0 lg:origin-top-right lg:right-0 lg:left-auto mt-2 w-40 rounded-md shadow-2xl bg-surface-surface ring-1 ring-opacity-dark-low focus:outline-none z-1000"
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div class="py-1" role="none">
                  <button v-for="sorting in getSortingOrders" :key="sorting.key" @click="handleSortingClick(sorting.key)"
                    :class="[
                      sorting.key === getCurrentSortingOrder
                        ? 'font-medium text-surface-on-surface'
                        : 'text-surface-on-surface-variant',
                    ]" class="block px-4 py-2 text-sm bg-transparent hover:bg-surface-surface-container"
                    role="menuitem" tabindex="-1">
                    {{ sorting.label }}
                  </button>
                </div>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
    <!-- Filters List -->
    <ClientOnly>
      <div v-if="!getInitialFilters.length" class="self-stretch flex flex-col justify-start items-start gap-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="w-full h-12 bg-surface-surface-container rounded"></div>
      </div>
      <div class="self-stretch flex flex-col justify-start items-start gap-4" v-else>
        <div v-for="filter in getInitialFilters" :key="filter.id" class="mb-2 w-full">
          <SwProductListingFilter v-model="sidebarSelectedFilters" @update:model-value="handleFiltersUpdate"
            :filter="filter" class="relative" />
        </div>
        <div v-if="showResetFiltersButton" class="mx-auto mt-4 mb-2 w-full">
          <SwBaseButton
            variant="primary"
            size="medium"
            block
            @click="invokeCleanFilters"
            type="button">
            {{ translations.listing.resetFilters }}
            <span class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"></span>
          </SwBaseButton>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
