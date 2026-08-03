import type { MaybeRefOrGetter } from "vue";
import type { LocationQueryRaw } from "vue-router";

export interface OffsetPaginationResult<T> {
  elements: T[];
  total: number;
}

export interface OffsetPaginationContext {
  page: number;
  limit: number;
}

export type OffsetPaginationFetcher<T> = (
  ctx: OffsetPaginationContext,
) => Promise<OffsetPaginationResult<T>>;

export interface UseOffsetPaginatedListOptions<T> {
  fetcher: OffsetPaginationFetcher<T>;
  key: string;
  defaultLimit?: number;
  defaultPage?: number;
  pageQueryKey?: string;
  limitQueryKey?: string;
  /**
   * Whitelist of accepted page sizes. A URL-supplied limit outside this list
   * falls back to `defaultLimit`. When omitted, any positive integer is
   * accepted.
   */
  allowedLimits?: number[];
  watchSources?: MaybeRefOrGetter<unknown>[];
  scrollTarget?: MaybeRefOrGetter<
    { scrollIntoView: Element["scrollIntoView"] } | null | undefined
  >;
}

export function useOffsetPaginatedList<T>(
  options: UseOffsetPaginatedListOptions<T>,
) {
  const {
    fetcher,
    key,
    defaultLimit = 15,
    defaultPage = 1,
    pageQueryKey = "p",
    limitQueryKey = "limit",
    allowedLimits,
    watchSources = [],
    scrollTarget,
  } = options;

  const route = useRoute();
  const router = useRouter();

  const requestedPage = computed(
    () =>
      toPositiveInteger(firstQueryValue(route.query[pageQueryKey])) ??
      defaultPage,
  );

  const limit = computed<number>({
    get: () => {
      const parsed = toPositiveInteger(
        firstQueryValue(route.query[limitQueryKey]),
      );
      if (parsed === undefined) return defaultLimit;
      if (allowedLimits && !allowedLimits.includes(parsed)) return defaultLimit;
      return parsed;
    },
    set: (value) => {
      void navigate({ [limitQueryKey]: value, [pageQueryKey]: defaultPage });
    },
  });

  const stateKey = computed(
    () =>
      `${key}:${JSON.stringify(route.query)}:${JSON.stringify(
        watchSources.map((source) => toValue(source)),
      )}`,
  );

  const { data, status, error, refresh } = useAsyncData(
    () => stateKey.value,
    () => fetcher({ page: requestedPage.value, limit: limit.value }),
    { lazy: true, watch: [stateKey] },
  );

  const elements = computed<T[]>(() => data.value?.elements ?? []);
  const total = computed(() => data.value?.total ?? 0);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / Math.max(1, limit.value))),
  );
  const currentPage = computed(() =>
    Math.min(requestedPage.value, totalPages.value),
  );
  const loading = computed(() => status.value === "pending");
  const isEmpty = computed(() => !loading.value && elements.value.length === 0);

  function scrollToTarget() {
    if (!scrollTarget) return;
    toValue(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
  }

  async function navigate(
    patch: LocationQueryRaw,
    { replace = false }: { replace?: boolean } = {},
  ) {
    const query = { ...route.query, ...patch };
    await (replace ? router.replace({ query }) : router.push({ query }));
    if (!replace) scrollToTarget();
  }

  function changePage(page: number) {
    return navigate({ [pageQueryKey]: page });
  }
  if (import.meta.client) {
    watch(
      [requestedPage, totalPages, total, status],
      () => {
        if (status.value !== "success" || total.value <= 0) return;
        if (requestedPage.value > totalPages.value) {
          void navigate(
            { [pageQueryKey]: totalPages.value },
            { replace: true },
          );
        }
      },
      { immediate: true },
    );
  }

  return {
    // state
    elements,
    total,
    totalPages,
    currentPage,
    limit,
    loading,
    isEmpty,
    error,
    // actions
    changePage,
    refresh,
  };
}
