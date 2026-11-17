/**
 * Get the number of pages needed to show `total` items, `limit` per page.
 * Returns `0` when `limit` is not a positive number.
 *
 * @public
 */
export function getTotalPages(total: number, limit: number): number {
  if (!(limit > 0)) return 0;
  return Math.ceil(total / limit);
}
