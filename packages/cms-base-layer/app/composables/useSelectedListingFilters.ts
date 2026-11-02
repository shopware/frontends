import { reactive, watch } from "vue";
import type { UnwrapNestedRefs } from "vue";

// Nuxt's useRoute, never vue-router's: this layer does not depend on
// vue-router, so a bare import resolves to whichever copy the consumer's
// package manager hoisted. When that is not the copy Nuxt's router uses, its
// inject() returns undefined and every page with a listing filter 500s in SSR.
import {
  applyQueryToFilters,
  createEmptyFilterState,
  useRoute,
} from "#imports";

import type { FilterState } from "../utils/listingFilterState";

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
  // Fresh state per call, deliberately: the sidebar and the horizontal filter
  // bar each hold their own selection object, so a mutation in one is invisible
  // to the other until it reaches the route. The URL is what synchronises them.
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
