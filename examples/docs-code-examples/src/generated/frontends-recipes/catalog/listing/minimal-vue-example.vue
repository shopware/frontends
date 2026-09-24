<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";
import type { LocationQuery } from "vue-router";

import type { Schemas } from "#shopware";

const props = defineProps<{
  // the listing the category page was rendered with
  initialListing: Schemas["ProductListingResult"];
}>();

const LIMIT = 24;

const {
  getElements,
  getTotal,
  getCurrentPage,
  getTotalPagesCount,
  getSortingOrders,
  getCurrentSortingOrder,
  getInitialFilters,
  loading,
  loadingMore,
  search,
  loadMore,
  setInitialListing,
} = useListing({ listingType: "categoryListing" });

const route = useRoute();
const router = useRouter();
const listingError = ref("");

// Renders before any request is sent: the CMS payload already carries a page.
setInitialListing(props.initialListing);

// getInitialFilters returns one entry per aggregation, except `properties`,
// which yields one entry per property group. Only these two are option lists;
// price, rating and shipping-free need their own controls, and categories is a
// search-listing filter a category listing cannot apply.
const optionFilters = computed(() =>
  getInitialFilters.value.filter(
    (filter) => filter.code === "manufacturer" || filter.code === "properties",
  ),
);

// The composable types availableSortings as a union that includes a plain
// { key, label }[], so narrowing it locally is what makes `translated` readable.
type SortOption = {
  key: string;
  label: string | null;
  translated?: { label: string };
};
const sortOptions = computed<SortOption[]>(() => getSortingOrders.value ?? []);

// getListingFilters types its options far more loosely than the payload is:
// a property group carries PropertyGroupOption[] under `options`, a manufacturer
// aggregation carries ProductManufacturer[] under `entities`. Both have a name.
type PropertyOption = Schemas["PropertyGroupOption"];
type ManufacturerOption = Schemas["ProductManufacturer"];
type FilterOption = PropertyOption | ManufacturerOption;

const optionsOf = (filter: { options?: unknown; entities?: unknown }) =>
  (filter.options ?? filter.entities ?? []) as FilterOption[];

// A repeated param (?manufacturer=a&manufacturer=b) arrives as an array.
// String() would join it with a comma and the API would read one unknown id.
const firstValue = (value: LocationQuery[string] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

// The criteria expects pipe-joined ids, which is exactly what the URL holds.
const selectedIds = (code: string) =>
  new Set(firstValue(route.query[code]).split("|").filter(Boolean));

const isSelected = (code: string, id: string) => selectedIds(code).has(id);

const toggleOption = (code: string, id: string) => {
  const selected = selectedIds(code);
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }

  const query = { ...route.query, [code]: [...selected].join("|") };
  // An empty value would be sent as "" and come back as [""].
  if (!query[code]) delete query[code];

  return router.push({ query });
};

const changeSorting = (order: string) =>
  router.push({ query: { ...route.query, order } });

// Filters only. The sorting is not a filter, so it survives the reset — the
// same distinction resetFilters() draws when it keeps the search term.
const clearFilters = () =>
  router.push({ query: route.query.order ? { order: route.query.order } : {} });

function buildCriteria(query: LocationQuery) {
  const criteria: Schemas["ProductListingCriteria"] = { limit: LIMIT };
  const manufacturer = firstValue(query.manufacturer);
  if (manufacturer) criteria.manufacturer = manufacturer;
  const properties = firstValue(query.properties);
  if (properties) criteria.properties = properties;
  const order = firstValue(query.order);
  if (order) criteria.order = order;
  return criteria;
}

// useListing stores whatever response lands last, so back/forward or a quick
// second toggle can leave a stale listing on screen. The token cannot unsend the
// request or reorder the writes — it only keeps a stale failure from replacing
// the error state of the request that superseded it.
let requestId = 0;

const searchFromQuery = async (query: LocationQuery) => {
  const id = ++requestId;
  listingError.value = "";
  try {
    await search(buildCriteria(query));
  } catch (error) {
    // The raw ApiClientError carries status and details.errors — log it rather
    // than rendering it, and show the customer one sentence.
    console.error(error);
    if (id === requestId)
      listingError.value = "The products could not be loaded.";
  }
};

const loadNext = async () => {
  if (loadingMore.value || !hasMore.value) return;
  listingError.value = "";
  try {
    // loadMore() does not reuse the criteria of the last search, so the filters,
    // the sorting and the limit have to be passed again or the page ignores them.
    await loadMore({
      ...buildCriteria(route.query),
      p: getCurrentPage.value + 1,
    });
  } catch (error) {
    console.error(error);
    listingError.value = "More products could not be loaded.";
  }
};

// The only place that fetches, so back, forward and a refresh all agree.
watch(() => route.query, searchFromQuery, { deep: true });

// A deep link arrives with filters the seeded listing does not reflect.
// Client-only on purpose: useListing keeps its listings in plain refs rather
// than useState, so a server-side search is never serialized into the payload.
// Running it during SSR would spend a request whose result is discarded and
// render the loading state into the cached HTML.
onMounted(() => {
  if (Object.keys(route.query).length) searchFromQuery(route.query);
});

const hasMore = computed(() => getCurrentPage.value < getTotalPagesCount.value);

// Announces the count after a filter change and the new total after an
// append, so "Show more" is not silent for a screen reader.
const statusMessage = computed(() =>
  loading.value
    ? "Loading products…"
    : `${getElements.value.length} of ${getTotal.value} products`,
);
</script>

<template>
  <!-- Rendered unconditionally so the text is announced when it is written. -->
  <p role="alert">{{ listingError }}</p>

  <aside aria-labelledby="filters-heading">
    <h2 id="filters-heading">Filters</h2>

    <!-- every property group shares code "properties", so key on the id -->
    <fieldset v-for="filter in optionFilters" :key="filter.id ?? filter.code">
      <legend>{{ filter.label }}</legend>

      <!-- Not disabled while loading: disabling the control being operated
           blurs it, and focus drops to the document body. -->
      <label v-for="option in optionsOf(filter)" :key="option.id">
        <input
          type="checkbox"
          :checked="isSelected(filter.code, option.id)"
          @change="toggleOption(filter.code, option.id)"
        />
        {{ getTranslatedProperty(option, "name") }}
      </label>
    </fieldset>

    <button type="button" @click="clearFilters()">Clear all filters</button>
  </aside>

  <section aria-labelledby="results-heading" :aria-busy="loading">
    <h2 id="results-heading">Products</h2>

    <label>
      Sort by
      <select
        :value="getCurrentSortingOrder"
        @change="changeSorting(($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="sorting in sortOptions"
          :key="sorting.key"
          :value="sorting.key"
        >
          {{ sorting.translated?.label ?? sorting.label }}
        </option>
      </select>
    </label>

    <!-- One live region for the count and the loading state, so a filter
         change is announced instead of silently swapping the list. -->
    <p role="status">{{ statusMessage }}</p>

    <p v-if="!loading && !getElements.length">
      No products match these filters.
    </p>

    <!-- The previous page stays on screen while the next one loads;
         aria-busy is what tells assistive tech to hold off. -->
    <ul v-else>
      <li v-for="product in getElements" :key="product.id">
        {{ getTranslatedProperty(product, "name") }}
      </li>
    </ul>

    <!-- Always mounted and aria-disabled rather than disabled: removing or
         disabling the focused button drops focus to the document body.
         loadNext() guards the click. -->
    <button
      type="button"
      :aria-disabled="loadingMore || !hasMore"
      @click="loadNext()"
    >
      {{
        loadingMore ? "Loading…" : hasMore ? "Show more" : "All products loaded"
      }}
    </button>
  </section>
</template>
