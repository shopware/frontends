import type { MaybeRefOrGetter } from "vue";
import type { LocationQueryRaw } from "vue-router";

/**
 * What a fetcher must return. `total` is the total number of items across all
 * pages (not the page count) — the composable derives `totalPages` from it.
 */
export interface OffsetPaginationResult<T> {
  elements: T[];
  total: number;
}

/** Arguments handed to the fetcher on every (re)load. */
export interface OffsetPaginationContext {
  page: number;
  limit: number;
}

export type OffsetPaginationFetcher<T> = (
  ctx: OffsetPaginationContext,
) => Promise<OffsetPaginationResult<T>>;

export interface UseOffsetPaginatedListOptions<T> {
  /**
   * The api call. Receives the resolved `page`/`limit` and returns the page of
   * items plus the total item count. Read any filters you need *inside* the
   * fetcher (from the route query or your own refs) — see `watchSources`.
   */
  fetcher: OffsetPaginationFetcher<T>;
  /**
   * Stable, unique key for `useAsyncData`. Must be unique per list rendered on
   * the same page (e.g. "account-orders").
   */
  key: string;
  /** Items per page when the URL carries none. Default: 15. */
  defaultLimit?: number;
  /** Page number when the URL carries none. Default: 1. */
  defaultPage?: number;
  /** Query-param name that stores the current page. Default: "p". */
  pageQueryKey?: string;
  /** Query-param name that stores the page size. Default: "limit". */
  limitQueryKey?: string;
  /**
   * Extra reactive sources (getters/refs) that must trigger a refetch — use
   * this for filters kept in local state rather than the URL. Filters kept in
   * the route query are watched automatically and don't need to be listed.
   */
  watchSources?: MaybeRefOrGetter<unknown>[];
  /**
   * Element scrolled into view after a page change. Pass a template ref.
   */
  scrollTarget?: MaybeRefOrGetter<
    { scrollIntoView: Element["scrollIntoView"] } | null | undefined
  >;
}

/**
 * Headless, URL-driven, SSR-ready offset pagination.
 *
 * State lives in the route query (`p`, `limit`), so pages are shareable, the
 * browser back/forward buttons work, and `useAsyncData` can hydrate the first
 * page on the server. Changing the page or size navigates; the fetcher re-runs
 * whenever the query (or any `watchSources`) changes.
 *
 * Filters are intentionally *outside* this composable: keep them in the route
 * query (or your own refs passed via `watchSources`) and read them inside your
 * `fetcher`. When a filter changes, push the new query with the page reset to
 * `defaultPage` so the user doesn't land on an out-of-range page.
 *
 * Awaits `useAsyncData` so the first page is fetched during SSR — call it with
 * `await`: `const list = await useOffsetPaginatedList({ ... })`.
 */
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

  // Derive page/limit from the URL so it's the single source of truth and the
  // request can never drift from what the query says.
  const currentPage = computed(
    () => toNumber(firstQueryValue(route.query[pageQueryKey])) ?? defaultPage,
  );

  const limit = computed<number>({
    get: () =>
      toNumber(firstQueryValue(route.query[limitQueryKey])) ?? defaultLimit,
    // Changing the page size resets to the first page.
    set: (value) => {
      void navigate({ [limitQueryKey]: value, [pageQueryKey]: defaultPage });
    },
  });

  // One value that captures everything the request depends on. Used both as the
  // useAsyncData cache key and as the single watch source, so SSR payloads are
  // keyed correctly and client navigation triggers a refetch.
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

  /** Navigate to a specific page, preserving all other query params (filters). */
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
