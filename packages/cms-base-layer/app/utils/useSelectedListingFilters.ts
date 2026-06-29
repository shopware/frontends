import { reactive, watch } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { useRoute } from "vue-router";
import type { LocationQuery } from "vue-router";

import { firstQueryValue, toNumber } from "./routeQuery";

export type FilterState = {
  manufacturer: Set<string>;
  properties: Set<string>;
  "min-price": number | undefined;
  "max-price": number | undefined;
  rating: number | undefined;
  "shipping-free": boolean | undefined;
};

/** Fresh, fully-empty filter state. The single source of "no selection". */
export const createEmptyFilterState = (): FilterState => ({
  manufacturer: new Set<string>(),
  properties: new Set<string>(),
  "min-price": undefined,
  "max-price": undefined,
  rating: undefined,
  "shipping-free": undefined,
});

/**
 * Resets `state` to empty, then repopulates it from `query`. Pure with respect
 * to the router: it only mutates `state`, never navigates or fetches.
 *
 * Reset-first is what clears filters whose query param vanished (e.g. browser
 * Back/Forward), which the old add-only loop left lingering. Idempotent:
 * applying the same query twice yields identical contents, so it is safe to
 * call from a route.query watcher that also fires on the user's own
 * executeSearch() push.
 *
 * Array-valued params (e.g. ?manufacturer=a&manufacturer=b) collapse to the
 * first value via firstQueryValue; numeric params are NaN-safe via toNumber -
 * consistent with the rest of the listing parsing.
 */
export const applyQueryToFilters = (
  state: FilterState,
  query: LocationQuery,
): void => {
  // 1) Reset every field. Clear the Sets in place so their identity is kept
  //    (props bound to them stay reactive); replace scalars with undefined.
  state.manufacturer.clear();
  state.properties.clear();
  state["min-price"] = undefined;
  state["max-price"] = undefined;
  state.rating = undefined;
  state["shipping-free"] = undefined;

  // 2) Repopulate from the current query.
  for (const code of ["manufacturer", "properties"] as const) {
    const value = firstQueryValue(query[code]);
    if (!value) continue;
    for (const element of value.split("|")) {
      if (element) state[code].add(element);
    }
  }

  const minPrice = toNumber(firstQueryValue(query["min-price"]));
  if (minPrice !== undefined) state["min-price"] = minPrice;

  const maxPrice = toNumber(firstQueryValue(query["max-price"]));
  if (maxPrice !== undefined) state["max-price"] = maxPrice;

  const rating = toNumber(firstQueryValue(query.rating));
  if (rating !== undefined) state.rating = rating;

  const shippingFree = firstQueryValue(query["shipping-free"]);
  if (shippingFree !== undefined) {
    state["shipping-free"] = shippingFree === "true";
  }
};

/**
 * Returns the reactive filter state, populated from the current route.query at
 * setup (runs on server AND client -> identical first render, no hydration
 * mismatch) and kept in sync on every subsequent query-only navigation
 * (Back/Forward, manual URL edits, the component's own executeSearch push).
 *
 * The watcher is intentionally NOT immediate: the setup-time apply already
 * covers the first render, and an immediate watcher would re-run during
 * hydration. It only resyncs UI state - it never navigates or fetches - so it
 * cannot loop with executeSearch() nor cause an extra listing request.
 */
export const useSelectedListingFilters = (): UnwrapNestedRefs<FilterState> => {
  const route = useRoute();
  const state = reactive<FilterState>(createEmptyFilterState());

  // Initial parse (SSR + first client render).
  applyQueryToFilters(state as FilterState, route.query);

  // Resync on query-only route changes while the component stays mounted.
  watch(
    () => route.query,
    (query) => {
      applyQueryToFilters(state as FilterState, query);
    },
  );

  return state;
};
