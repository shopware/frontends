<script setup lang="ts" generic="T">
import type { MaybeRefOrGetter } from "vue";

import type { OffsetPaginationFetcher } from "../../composables/useOffsetPaginatedList";

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
  error: (props: { error: unknown; retry: () => Promise<void> }) => unknown;
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
  error,
  changePage,
  refresh,
} = useOffsetPaginatedList<T>({
  fetcher: props.fetcher,
  key: props.dataKey,
  defaultLimit: props.defaultLimit,
  defaultPage: props.defaultPage,
  pageQueryKey: props.pageQueryKey,
  limitQueryKey: props.limitQueryKey,
  allowedLimits: props.showPageSizeSelector
    ? [...PAGE_SIZE_OPTIONS]
    : undefined,
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

    <slot v-else-if="error" name="error" :error="error" :retry="refresh">
      <div class="py-8 text-center text-sm" role="alert">
        <p class="opacity-70">{{ $t("listing.error") }}</p>
        <button type="button" class="mt-3 underline" @click="() => refresh()">
          {{ $t("listing.retry") }}
        </button>
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

      <SharedElementsNavigation
        v-if="totalPages > 1 || showPageSizeSelector"
        v-bind="navProps"
        class="mt-8 mb-12"
        @change-page="changePage"
        @change-size="(size: number) => (limit = size)"
      />
    </template>

    <slot v-else name="empty">
      <div class="py-8 text-center text-sm opacity-70">
        {{ $t("listing.empty") }}
      </div>
    </slot>
  </div>
</template>
