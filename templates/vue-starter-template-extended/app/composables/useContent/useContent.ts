import type { Schemas } from "#shopware";

export type UseContentOptions = {
  /**
   * Language ID for the content request
   */
  languageId?: string;
  /**
   * Request only specific element and its descendants (partial rendering)
   */
  elementId?: string;
};

export type UseContentReturn = {
  /**
   * Fetch fully hydrated content layout
   * @param path - Content path pattern (e.g., "product/{productId}", "category/{categoryId}", "landing-page/{landingPageId}")
   * @param options - Optional parameters for language and partial rendering
   * @returns Promise<Schemas['ContentPage']>
   */
  fetchFullContent: (
    path: string,
    options?: UseContentOptions,
  ) => Promise<Schemas["ContentPage"]>;

  /**
   * Fetch decomposed content (skeleton + data + assignments)
   * Optimized for bandwidth efficiency with deduplicated data
   * @param path - Content path pattern
   * @param options - Optional parameters for language and partial rendering
   * @returns Promise<Schemas['ContentDecomposedPage']>
   */
  fetchDecomposed: (
    path: string,
    options?: UseContentOptions,
  ) => Promise<Schemas["ContentDecomposedPage"]>;

  /**
   * Fetch content skeleton only (no hydrated data)
   * Useful for fast initial page load or client-side hydration
   * @param path - Content path pattern
   * @param options - Optional parameters for language and partial rendering
   * @returns Promise<Schemas['ContentSkeletonPage']>
   */
  fetchSkeleton: (
    path: string,
    options?: UseContentOptions,
  ) => Promise<Schemas["ContentSkeletonPage"]>;

  /**
   * Fetch content data only (no skeleton)
   * Useful when client already has skeleton and needs refreshed data
   * @param path - Content path pattern
   * @param options - Optional parameters for language and partial rendering
   * @returns Promise<Schemas['ContentDataPage']>
   */
  fetchData: (
    path: string,
    options?: UseContentOptions,
  ) => Promise<Schemas["ContentDataPage"]>;
};

/**
 * Composable for fetching content using the new Content API.
 *
 * This implementation uses local mock API routes for demonstration.
 * In production, you would use the Shopware API client.
 *
 * Provides access to 4 different content endpoints:
 * - fetchFullContent: Complete hydrated content (best for SSR)
 * - fetchDecomposed: Skeleton + data + assignments (bandwidth optimized)
 * - fetchSkeleton: Layout structure only (fast initial load)
 * - fetchData: Data only (for refreshing existing skeleton)
 *
 * @example
 * ```ts
 * const { fetchFullContent } = useContent();
 * const content = await fetchFullContent("product/123");
 * ```
 *
 * @example
 * ```ts
 * // Skeleton-first loading strategy
 * const { fetchSkeleton, fetchData } = useContent();
 * const skeleton = await fetchSkeleton("category/456");
 * // ... render skeleton immediately ...
 * const data = await fetchData("category/456");
 * // ... hydrate skeleton with data ...
 * ```
 *
 * @public
 * @category Content
 */
export function useContent(): UseContentReturn {
  const fetchFullContent = async (
    path: string,
    options?: UseContentOptions,
  ): Promise<Schemas["ContentPage"]> => {
    const headers: Record<string, string> = {};
    if (options?.languageId) {
      headers["sw-language-id"] = options.languageId;
    }

    const query: Record<string, string> = {};
    if (options?.elementId) {
      query.elementId = options.elementId;
    }

    return await $fetch(`/api/mock/content/${path}`, {
      headers,
      query,
    });
  };

  const fetchDecomposed = async (
    path: string,
    options?: UseContentOptions,
  ): Promise<Schemas["ContentDecomposedPage"]> => {
    const headers: Record<string, string> = {};
    if (options?.languageId) {
      headers["sw-language-id"] = options.languageId;
    }

    const query: Record<string, string> = {};
    if (options?.elementId) {
      query.elementId = options.elementId;
    }

    return await $fetch(`/api/mock/content-decomposed/${path}`, {
      headers,
      query,
    });
  };

  const fetchSkeleton = async (
    path: string,
    options?: UseContentOptions,
  ): Promise<Schemas["ContentSkeletonPage"]> => {
    const headers: Record<string, string> = {};
    if (options?.languageId) {
      headers["sw-language-id"] = options.languageId;
    }

    const query: Record<string, string> = {};
    if (options?.elementId) {
      query.elementId = options.elementId;
    }

    return await $fetch(`/api/mock/content-skeleton/${path}`, {
      headers,
      query,
    });
  };

  const fetchData = async (
    path: string,
    options?: UseContentOptions,
  ): Promise<Schemas["ContentDataPage"]> => {
    const headers: Record<string, string> = {};
    if (options?.languageId) {
      headers["sw-language-id"] = options.languageId;
    }

    const query: Record<string, string> = {};
    if (options?.elementId) {
      query.elementId = options.elementId;
    }

    return await $fetch(`/api/mock/content-data/${path}`, {
      headers,
      query,
    });
  };

  return {
    fetchFullContent,
    fetchDecomposed,
    fetchSkeleton,
    fetchData,
  };
}
