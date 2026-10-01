import { describe, expect, it } from "vitest";

import {
  getSlidesToShow,
  getSsrBreakpoints,
  parseMinWidth,
} from "./sliderLayout";

describe("parseMinWidth", () => {
  it("strips the unit and falls back to 300", () => {
    expect(parseMinWidth("300px")).toBe(300);
    expect(parseMinWidth("250")).toBe(250);
    expect(parseMinWidth(180)).toBe(180);
    expect(parseMinWidth("")).toBe(300);
    expect(parseMinWidth(undefined)).toBe(300);
    expect(parseMinWidth("auto", 200)).toBe(200);
  });
});

describe("getSlidesToShow", () => {
  it("uses the 1200px estimate divided by the slot count before measuring", () => {
    expect(getSlidesToShow(0, 1, 300)).toBe(4);
    expect(getSlidesToShow(0, 2, 300)).toBe(2);
    expect(getSlidesToShow(0, 4, 300)).toBe(1);
  });

  it("derives the count from the measured width and never drops below one", () => {
    expect(getSlidesToShow(1180, 1, 300)).toBe(3);
    expect(getSlidesToShow(375, 1, 300)).toBe(1);
    expect(getSlidesToShow(100, 1, 300)).toBe(1);
  });

  it("guards against a zero slot count or min width", () => {
    expect(getSlidesToShow(0, 0, 300)).toBe(4);
    expect(getSlidesToShow(900, 1, 0)).toBe(3);
  });
});

describe("getSsrBreakpoints", () => {
  it("scales each breakpoint by the slot count", () => {
    expect(getSsrBreakpoints(3, 300, 1)).toEqual({
      "(min-width: 600px)": 2,
      "(min-width: 900px)": 3,
    });
    expect(getSsrBreakpoints(2, 300, 2)).toEqual({
      "(min-width: 1200px)": 2,
    });
  });

  it("is empty for a single slide", () => {
    expect(getSsrBreakpoints(1, 300, 1)).toEqual({});
  });
});
