/**
 * Gather breadcrumbs from category
 *
 */
export function getCategoryBreadcrumbs<
  T extends {
    translated: {
      breadcrumb: string[];
    };
    breadcrumb: string[];
  },
>(
  category: T,
  options?: {
    /**
     * Start at specific index if your navigation
     * contains root names which should not be visible.
     */
    startIndex?: number;
  },
) {
  const breadcrumbs =
    category?.translated.breadcrumb || category?.breadcrumb || [];
  const startIndex = options?.startIndex || 0;
  if (breadcrumbs.length <= startIndex) return [];
  return breadcrumbs.slice(startIndex).map((element) => {
    return {
      name: element,
    };
  });
}
