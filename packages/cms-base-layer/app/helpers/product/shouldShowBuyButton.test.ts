import { describe, expect, it } from "vitest";

import { shouldShowBuyButton } from "./shouldShowBuyButton";

describe("shouldShowBuyButton", () => {
  it("shows the button for a product without variants", () => {
    expect(shouldShowBuyButton({ childCount: 0 })).toBe(true);
  });

  it("shows the button when childCount is missing", () => {
    expect(shouldShowBuyButton({})).toBe(true);
  });

  it("hides the button for a variant parent", () => {
    expect(shouldShowBuyButton({ childCount: 2 })).toBe(false);
  });

  it("hides the button when there is a from price", () => {
    expect(shouldShowBuyButton({ childCount: 0 }, 19.99)).toBe(false);
  });
});
