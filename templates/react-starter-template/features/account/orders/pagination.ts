export const ELLIPSIS = "ellipsis";

export type PaginationCell = number | typeof ELLIPSIS;

const VISIBLE_PAGES = 7;

export function paginationCells(
  total: number,
  current: number,
): PaginationCell[] {
  const pages = Math.max(1, total);
  const size = Math.min(VISIBLE_PAGES, pages);
  const start = Math.min(
    Math.max(1, current - Math.floor(size / 2)),
    Math.max(1, pages - size + 1),
  );
  const end = start + size - 1;
  const cells: PaginationCell[] = Array.from(
    { length: size },
    (_, index) => start + index,
  );
  if (start > 1) {
    cells[0] = 1;
    cells[1] = ELLIPSIS;
  }
  if (end < pages) {
    cells[size - 1] = pages;
    cells[size - 2] = ELLIPSIS;
  }
  return cells;
}
