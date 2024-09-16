import { describe, expect, it } from "vitest";
import { useShopwareContext } from "./useShopwareContext";

describe("useShopwareContext", () => {
  it("no context error", () => {
    expect(() => useShopwareContext()).toThrow();
  });
});
