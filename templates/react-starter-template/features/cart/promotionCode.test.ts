import { describe, expect, it } from "vitest";

import { lineItem } from "./cart.fixture";
import {
  isPromotionCodeApplied,
  normalizePromotionCode,
  promotionLineItems,
} from "./promotionCode";

const summer = lineItem({
  id: "promotion-1",
  referencedId: "SUMMER",
  type: "promotion",
  good: false,
});
const product = lineItem({ id: "product-1", referencedId: "summer" });

describe("normalizePromotionCode", () => {
  it("trims the code like the backend", () => {
    expect(normalizePromotionCode("  SUMMER \n")).toBe("SUMMER");
    expect(normalizePromotionCode("   ")).toBe("");
  });
});

describe("promotionLineItems", () => {
  it("keeps the promotion line items only", () => {
    expect(promotionLineItems([product, summer])).toEqual([summer]);
  });
});

describe("isPromotionCodeApplied", () => {
  it("matches the code of a promotion line item regardless of case and spacing", () => {
    expect(isPromotionCodeApplied([summer], "summer")).toBe(true);
    expect(isPromotionCodeApplied([summer], " Summer ")).toBe(true);
  });

  it("ignores other codes and line items that are not promotions", () => {
    expect(isPromotionCodeApplied([summer], "WINTER")).toBe(false);
    expect(isPromotionCodeApplied([product], "summer")).toBe(false);
  });

  it("never matches an empty code", () => {
    expect(isPromotionCodeApplied([lineItem({ type: "promotion" })], " ")).toBe(
      false,
    );
    expect(
      isPromotionCodeApplied(
        [lineItem({ type: "promotion", referencedId: "" })],
        "",
      ),
    ).toBe(false);
  });
});
