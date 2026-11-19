import { describe, expect, it } from "vitest";

import { getNextTabIndex } from "./tabsKeyboard";

describe("getNextTabIndex", () => {
  it("moves right and wraps to the first tab", () => {
    expect(getNextTabIndex("ArrowRight", 0, 3)).toBe(1);
    expect(getNextTabIndex("ArrowRight", 2, 3)).toBe(0);
  });

  it("moves left and wraps to the last tab", () => {
    expect(getNextTabIndex("ArrowLeft", 1, 3)).toBe(0);
    expect(getNextTabIndex("ArrowLeft", 0, 3)).toBe(2);
  });

  it("jumps to the first and last tab with Home and End", () => {
    expect(getNextTabIndex("Home", 2, 3)).toBe(0);
    expect(getNextTabIndex("End", 0, 3)).toBe(2);
  });

  it("ignores other keys and empty tab lists", () => {
    expect(getNextTabIndex("Enter", 0, 3)).toBeUndefined();
    expect(getNextTabIndex("ArrowRight", 0, 0)).toBeUndefined();
  });
});
