<script setup lang="ts" generic="T">
import type { MaybeRefOrGetter } from "vue";

import type { OffsetPaginationFetcher } from "~/composables/useOffsetPaginatedList";

/**
 * Thin wrapper around `useOffsetPaginatedList`. Owns nothing but the wiring:
 * it runs the fetcher, keeps page/size state in the URL, and renders the
 * existing `SharedElementsNavigation` (pagination + optional size selector).
 *
 * Bring your own list markup via the default slot, and your own filters via
 * the route query (read them inside `fetcher`). See useOffsetPaginatedList.ts.
 */
const props = withDefaults(
  defineProps<{
    /** The api call: `({ page, limit }) => ({ elements, total })`. */
    fetcher: OffsetPaginationFetcher<T>;
    /** Unique useAsyncData key for this list on the page. */
    dataKey: string;
    defaultLimit?: number;
    defaultPage?: number;
    pageQueryKey?: string;
    limitQueryKey?: string;
    /** Show the per-page size selector next to the pager. Default: true. */
    showPageSizeSelector?: boolean;
    /** Extra reactive sources (non-URL filters) that should trigger a refetch. */
    watchSources?: MaybeRefOrGetter<unknown>[];
  }>(),
  {
    defaultLimit: 15,
    defaultPage: 1,
    pageQueryKey: "p",
    limitQueryKey: "limit",
    showPageSizeSelector: true,
    watchSources: () => [],
  },
);

defineSlots<{
  /** Your list markup. Receives the current page of items and metadata. */
  default: (props: {
    items: T[];
    loading: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
  }) => unknown;
  /** Shown while a page is loading. `limit` is the current page size. */
  loading: (props: { limit: number }) => unknown;
  /** Shown when the list is empty. */
  empty: () => unknown;
}>();

// Root element scrolled into view after each page change.
const listEl = ref<HTMLElement | null>(null);

// defineExpose must run synchronously before the first `await`, so expose a
// stable proxy that delegates to the composable's `refresh` once it resolves.
let refreshList: (() => Promise<void>) | undefined;
defineExpose({ refresh: () => refreshList?.() });

const {
  elements,
  total,
  totalPages,
  currentPage,
  limit,
  loading,
  isEmpty,
  changePage,
  refresh,
} = await useOffsetPaginatedList<T>({
  fetcher: props.fetcher,
  key: props.dataKey,
  defaultLimit: props.defaultLimit,
  defaultPage: props.defaultPage,
  pageQueryKey: props.pageQueryKey,
  limitQueryKey: props.limitQueryKey,
  watchSources: props.watchSources,
  scrollTarget: listEl,
});

refreshList = refresh;

// Build a properly-typed props object for SharedElementsNavigation's
// discriminated union (a dynamic boolean can't narrow it on its own).
const navProps = computed(() =>
  props.showPageSizeSelector
    ? {
        pages: totalPages.value,
        currentPage: currentPage.value,
        showPageSizeSelector: true as const,
        pageSize: limit.value,
      }
    : {
        pages: totalPages.value,
        currentPage: currentPage.value,
        showPageSizeSelector: false as const,
      },
);
</script>

<template>
  <div ref="listEl">
    <slot v-if="loading" name="loading" :limit="limit">
      <div class="py-8 text-center text-sm opacity-70">Loading…</div>
    </slot>

    <template v-else-if="!isEmpty">
      <slot
        :items="elements"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :total-pages="totalPages"
      />

      <div
        v-if="totalPages > 1 || showPageSizeSelector"
        class="mt-8 mb-12 flex justify-center"
      >
        <SharedElementsNavigation
          v-bind="navProps"
          @change-page="changePage"
          @change-size="(size: number) => (limit = size)"
        />
      </div>
    </template>

    <slot v-else name="empty">
      <div class="py-8 text-center text-sm opacity-70">No results.</div>
    </slot>
  </div>
</template>
