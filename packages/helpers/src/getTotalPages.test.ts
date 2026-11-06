import { describe, expect, it } from "vitest";

import { getTotalPages } from "./getTotalPages";

describe("getTotalPages", () => {
  it("rounds up to whole pages", () => {
    expect(getTotalPages(16, 15)).toBe(2);
    expect(getTotalPages(15, 15)).toBe(1);
    expect(getTotalPages(1, 15)).toBe(1);
  });

  it("returns 0 for no items", () => {
    expect(getTotalPages(0, 15)).toBe(0);
  });

  it("returns 0 when the limit is not positive", () => {
    expect(getTotalPages(10, 0)).toBe(0);
    expect(getTotalPages(10, -1)).toBe(0);
    expect(getTotalPages(10, Number.NaN)).toBe(0);
  });
});
