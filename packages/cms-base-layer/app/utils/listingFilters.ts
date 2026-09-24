import { CATEGORY_AGGREGATION_NAME } from "@shopware/helpers";

/**
 * Narrows the listing filters to the ones the current listing can act on.
 *
 * The category selection is only written to the `categories` URL param and to
 * the criteria `post-filter` on search listings. A category listing that
 * happens to request the category aggregations would otherwise render a
 * checkbox that the next query sync resets and that never changes the result
 * set, so the filter is dropped there.
 */
export const getVisibleListingFilters = <T extends { code: string }>(
  filters: T[] | undefined | null,
  { isProductSearch }: { isProductSearch: boolean },
): T[] => {
  if (!filters) return [];
  if (isProductSearch) return filters;
  return filters.filter((filter) => filter.code !== CATEGORY_AGGREGATION_NAME);
};
