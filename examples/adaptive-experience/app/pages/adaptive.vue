<script setup lang="ts">
import type { Schemas, operations } from "#shopware";

/**
 * The adaptive listing.
 *
 * A separate route from the template's `/search`, so the two can be compared:
 *   /search?search=chair    - standard
 *   /adaptive?search=chair  - adaptive
 *
 * The page owns data loading and a route-level layout baseline. What renders is
 * otherwise the plan's decision, so there is no markup here beyond the workspace.
 */
const route = useRoute();
const router = useRouter();
const { getCurrentListing, search, setInitialListing } =
  useProductSearchListing();
const { context, track, propose, evaluateRules, theme, setVibe } =
  useExperienceEngine();
const { requestPlan, proposals } = useExperiencePlanner();

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

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

watch(
  listing,
  (value) => {
    if (value) setInitialListing(value as Schemas["ProductListingResult"]);
  },
  { immediate: true },
);

/**
 * The route baseline: a listing wants its filters in the aside. Applied as the
 * `route` source (§7/§16), which outranks a local rule but yields to the user.
 * Idempotent, so it is safe to re-apply after client-side navigation.
 */
function applyRouteLayout() {
  propose(
    {
      operations: [
        { type: "set-workspace", target: "sidebar", value: "left" },
        {
          type: "ensure-module",
          module: {
            id: "listing-filters",
            type: "contextual-filters",
            region: "aside",
            priority: 10,
            props: { collapsed: false },
          },
        },
      ],
    },
    "route",
  );
}

// Sorting by price is the semantic signal, not the click, so it is derived from
// the URL that already drives the listing.
watch(
  () => firstQueryValue(route.query.order),
  (order, previous) => {
    if (order !== previous && order?.startsWith("price-")) {
      track({ type: "price-sort-used" });
    }
  },
);

// The rules run to a fixed point whenever the context moves (pure and
// idempotent, so a redundant pass is a no-op). The planner is asked on a trailing
// debounce, so it sees the *settled* state after a burst of actions rather than
// every intermediate one - and shadow mode records what a model would propose.
const askPlanner = useDebounceFn(() => void requestPlan(), 700);
watch(
  context,
  () => {
    evaluateRules();
    void askPlanner();
  },
  { deep: true },
);

onMounted(applyRouteLayout);
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="mb-8 mx-4 md:mx-auto" data-testid="adaptive-listing">
    <div class="flex items-center justify-end gap-3">
      <span
        class="text-xs font-semibold uppercase tracking-wide text-surface-on-surface-variant"
      >
        Vibe
      </span>
      <div
        class="inline-flex rounded-full border border-brand-primary overflow-hidden text-sm"
        data-testid="vibe-toggle"
        role="group"
        aria-label="Storefront vibe"
      >
        <button
          type="button"
          class="px-4 py-1.5 font-medium transition-colors"
          :class="
            theme === 'classic'
              ? 'bg-brand-primary text-brand-on-primary'
              : 'bg-surface-surface text-surface-on-surface-variant hover:bg-brand-tertiary'
          "
          :aria-pressed="theme === 'classic'"
          data-testid="vibe-classic"
          @click="setVibe('classic')"
        >
          Classic
        </button>
        <button
          type="button"
          class="px-4 py-1.5 font-semibold transition-colors"
          :class="
            theme === 'genz'
              ? 'bg-brand-primary text-brand-on-primary'
              : 'bg-surface-surface text-brand-primary hover:bg-brand-secondary'
          "
          :aria-pressed="theme === 'genz'"
          data-testid="vibe-genz"
          @click="setVibe('genz')"
        >
          Gen Z ✨
        </button>
      </div>
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
    <ExperienceShadowProposals :proposals="proposals" />
  </div>
</template>
