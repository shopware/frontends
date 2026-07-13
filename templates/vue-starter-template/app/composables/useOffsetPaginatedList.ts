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
  watchSources?: MaybeRefOrGetter<unknown>[];
  scrollTarget?: MaybeRefOrGetter<
    { scrollIntoView: Element["scrollIntoView"] } | null | undefined
  >;
}

export async function useOffsetPaginatedList<T>(
  options: UseOffsetPaginatedListOptions<T>,
) {
  const {
    fetcher,
    key,
    defaultLimit = 15,
    defaultPage = 1,
    pageQueryKey = "p",
    limitQueryKey = "limit",
    watchSources = [],
    scrollTarget,
  } = options;

  const route = useRoute();
  const router = useRouter();

  const currentPage = computed(
    () => toNumber(firstQueryValue(route.query[pageQueryKey])) ?? defaultPage,
  );

  const limit = computed<number>({
    get: () =>
      toNumber(firstQueryValue(route.query[limitQueryKey])) ?? defaultLimit,
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

  const { data, status, error, refresh } = await useAsyncData(
    () => stateKey.value,
    () => fetcher({ page: currentPage.value, limit: limit.value }),
    { watch: [stateKey] },
  );

  const elements = computed<T[]>(() => data.value?.elements ?? []);
  const total = computed(() => data.value?.total ?? 0);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / Math.max(1, limit.value))),
  );
  const loading = computed(() => status.value === "pending");
  const isEmpty = computed(() => !loading.value && elements.value.length === 0);

  function scrollToTarget() {
    if (!scrollTarget) return;
    toValue(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
  }

  async function navigate(patch: LocationQueryRaw) {
    await router.push({ query: { ...route.query, ...patch } });
    scrollToTarget();
  }

  function changePage(page: number) {
    return navigate({ [pageQueryKey]: page });
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
