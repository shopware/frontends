import { describe, expect, it } from "vitest";

import { ELLIPSIS, paginationCells } from "./pagination";

describe("paginationCells", () => {
  it("shows every page when there are seven or fewer", () => {
    expect(paginationCells(0, 1)).toEqual([1]);
    expect(paginationCells(3, 2)).toEqual([1, 2, 3]);
    expect(paginationCells(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the end near the first page", () => {
    expect(paginationCells(20, 1)).toEqual([1, 2, 3, 4, 5, ELLIPSIS, 20]);
  });

  it("collapses both sides in the middle", () => {
    expect(paginationCells(20, 10)).toEqual([
      1,
      ELLIPSIS,
      9,
      10,
      11,
      ELLIPSIS,
      20,
    ]);
  });

  it("collapses the start near the last page", () => {
    expect(paginationCells(20, 20)).toEqual([1, ELLIPSIS, 16, 17, 18, 19, 20]);
  });
});
