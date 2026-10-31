/**
 * Turn listing criteria into URL query params. Arrays are joined with `|`,
 * empty arrays and falsy values are left out.
 *
 * @example getListingFiltersQuery({ manufacturer: ["a", "b"], page: 2 }) // { manufacturer: "a|b", page: 2 }
 *
 * @public
 * @category Listing
 */
export function getListingFiltersQuery<T extends object>(
  filters: T,
): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      if (value.length) query[key] = value.join("|");
    } else if (value) {
      query[key] = value;
    }
  }

  return query;
}
