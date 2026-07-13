<script setup lang="ts" generic="T">
import type { MaybeRefOrGetter } from "vue";

import type { OffsetPaginationFetcher } from "~/composables/useOffsetPaginatedList";

const props = withDefaults(
  defineProps<{
    fetcher: OffsetPaginationFetcher<T>;
    dataKey: string;
    defaultLimit?: number;
    defaultPage?: number;
    pageQueryKey?: string;
    limitQueryKey?: string;
    showPageSizeSelector?: boolean;
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
  default: (props: {
    items: T[];
    loading: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
  }) => unknown;
  loading: (props: { limit: number }) => unknown;
  empty: () => unknown;
}>();

const listEl = ref<HTMLElement | null>(null);

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
      <div class="py-8 text-center text-sm opacity-70">
        {{ $t("listing.loading") }}
      </div>
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
      <div class="py-8 text-center text-sm opacity-70">
        {{ $t("listing.empty") }}
      </div>
    </slot>
  </div>
</template>
