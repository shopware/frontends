import { describe, expect, it } from "vitest";

import { createDefaultContext, deriveSignals } from "./context";

const zero = {
  comparedProductCount: 0,
  repeatedProductViews: 0,
  technicalFilterCount: 0,
  priceSortCount: 0,
  searchCount: 0,
  productViewCount: 0,
  cartProductCount: 0,
};

describe("deriveSignals (§15 formulas)", () => {
  it("scores comparison intent from the staged count", () => {
    expect(
      deriveSignals({ ...zero, comparedProductCount: 2 }).comparisonIntent,
    ).toBe(0.5);
  });

  it("clamps price sensitivity to 1", () => {
    expect(
      deriveSignals({ ...zero, priceSortCount: 2 }).priceSensitivity,
    ).toBeCloseTo(0.68);
    expect(deriveSignals({ ...zero, priceSortCount: 3 }).priceSensitivity).toBe(
      1,
    );
  });

  it("reads repeated searching without product views as uncertainty", () => {
    expect(deriveSignals({ ...zero, searchCount: 3 }).uncertainty).toBeCloseTo(
      0.6,
    );
    expect(
      deriveSignals({ ...zero, searchCount: 3, productViewCount: 5 })
        .uncertainty,
    ).toBeCloseTo(0.3);
  });

  it("keeps every signal within 0..1", () => {
    const s = deriveSignals({
      comparedProductCount: 9,
      repeatedProductViews: 9,
      technicalFilterCount: 9,
      priceSortCount: 9,
      searchCount: 9,
      productViewCount: 9,
      cartProductCount: 9,
    });
    for (const value of Object.values(s)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});

describe("createDefaultContext", () => {
  it("starts a session with all signals at zero", () => {
    const context = createDefaultContext("session-1", 0);
    expect(context.sessionId).toBe("session-1");
    expect(context.route.kind).toBe("home");
    expect(Object.values(context.signals).every((v) => v === 0)).toBe(true);
    expect(context.capabilities.canSwitchSalesChannelAutomatically).toBe(false);
  });
});
