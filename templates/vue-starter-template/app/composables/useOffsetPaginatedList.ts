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

export interface PaginatedListInstance {
  /**
   * Refetch the currently displayed page.
   */
  refresh: () => Promise<void>;
}

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
    | {
        scrollIntoView: Element["scrollIntoView"];
        getBoundingClientRect?: Element["getBoundingClientRect"];
      }
    | null
    | undefined
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
    key,
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
  const loading = computed(
    () => status.value === "pending" || status.value === "idle",
  );
  const isInitialLoading = computed(
    () => loading.value && data.value === undefined,
  );
  const isEmpty = computed(
    () => status.value === "success" && elements.value.length === 0,
  );

  function scrollToTarget() {
    if (!scrollTarget) return;

    const target = toValue(scrollTarget);
    if (!target) return;

    // Skip the scroll when the top of the list is already on screen. Both
    // bounds are needed: today the pagination controls render inside the list
    // container, so the top can never sit below the fold when this runs - but
    // that is a layout coincidence, not a guarantee. Do not drop the upper
    // bound as dead code.
    const top = target.getBoundingClientRect?.().top;
    const viewportHeight = document.documentElement.clientHeight;
    if (top !== undefined && top >= 0 && top <= viewportHeight) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
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
    isInitialLoading,
    isEmpty,
    error,
    // actions
    changePage,
    refresh,
  };
}
