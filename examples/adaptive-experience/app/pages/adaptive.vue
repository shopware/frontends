<script setup lang="ts">
import type { Schemas, operations } from "#shopware";

/**
 * The adaptive listing.
 *
 * A separate route rather than an override of the template's `/search`, so the
 * standard listing stays untouched and the two can be compared side by side:
 *   /search?search=shirt    - standard
 *   /adaptive?search=shirt  - adaptive
 *
 * The page owns data loading only. What gets rendered is entirely the plan's
 * decision, which is why there is no markup here beyond the workspace.
 */
const route = useRoute();
const router = useRouter();
const { getCurrentListing, search, setInitialListing } =
  useProductSearchListing();
const { track, evaluateRules, signals } = useExperienceEngine();

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

// Page chrome rather than a module: sorting drives the listing query, which is
// the page's job. It navigates client-side, which is what lets the order watcher
// below see the change.
const currentOrder = computed(
  () => firstQueryValue(route.query.order) ?? "name-asc",
);

function changeOrder(event: Event) {
  router.push({
    query: { ...route.query, order: (event.target as HTMLSelectElement).value },
  });
}

const { t } = useI18n();
useBreadcrumbs([{ name: t("breadcrumbs.search"), path: "/adaptive" }]);

const buildSearchCriteria =
  (): operations["searchPage post /search"]["body"] => ({
    search: firstQueryValue(route.query.search) ?? "",
    order: firstQueryValue(route.query.order) ?? "name-asc",
    limit: toNumber(firstQueryValue(route.query.limit)) ?? 15,
    p: toNumber(firstQueryValue(route.query.p)) ?? 1,
  });

const { data: listing } = await useAsyncData(
  () => `adaptiveSearch-${JSON.stringify(route.query)}`,
  async () => {
    await search(buildSearchCriteria());
    return getCurrentListing.value;
  },
  { watch: [() => route.query] },
);

// Mirror the payload into the shared listing on both server and client. The
// composable's refs are request-scoped and don't transfer, so without this the
// client hydrates an empty listing.
watch(
  listing,
  (value) => {
    if (value) setInitialListing(value as Schemas["ProductListingResult"]);
  },
  { immediate: true },
);

// Sorting by price is the semantic signal, not the click that caused it, so it
// is derived from the URL that already drives the listing.
watch(
  () => firstQueryValue(route.query.order),
  (order, previous) => {
    if (order !== previous && order?.startsWith("price-")) {
      track({ type: "price-sort-used" });
    }
  },
);

// Rules re-run whenever the signals move. They are pure and the merger is
// idempotent, so a redundant pass is a no-op rather than version churn.
watch(signals, () => evaluateRules(), { deep: true });
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="mb-8 mx-4 md:mx-auto" data-testid="adaptive-listing">
    <div class="flex justify-end">
      <select
        class="border rounded px-2 py-1 text-sm"
        data-testid="adaptive-sort"
        :value="currentOrder"
        aria-label="Sort products"
        @change="changeOrder"
      >
        <option
          v-for="option in SORT_OPTIONS"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <ExperienceWorkspace />
  </div>
</template>
