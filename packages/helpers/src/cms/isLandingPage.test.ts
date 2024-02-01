import { describe, expect, it } from "vitest";
import { isLandingPage } from "./index";

describe("isLandingPage", () => {
  it("should return true when entity is a product", () => {
    const entity = {
      apiAlias: "landing_page",
    };

    const result = isLandingPage(entity);

    expect(result).toBe(true);
  });

  it("should return false when entity is not a product", () => {
    const entity = {
      apiAlias: "category",
    };

    const result = isLandingPage(entity);

    expect(result).toBe(false);
  });
});
