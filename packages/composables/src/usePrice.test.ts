import { describe, expect, it } from "vitest";
import { createApp } from "vue";
import { usePrice } from "./usePrice";

export function withSetup(composable: any) {
  let result;
  const app = createApp({
    setup() {
      result = composable();
      // suppress missing template warning
      // eslint-disable-next-line
      return () => {};
    },
  });
  app.mount(document.createElement("div"));
  // return the result and the app instance
  // for testing provide / unmount
  return [result, app];
}

describe("usePrice", () => {
  const { init, getFormattedPrice } = usePrice();
  init({
    currencyPosition: 1,
    currencySymbol: "$",
  });

  it("should be defined", () => {
    expect(usePrice).toBeDefined();
  });

  it("should init price object", () => {
    expect(getFormattedPrice("2")).toBe("2.00 $");
  });

  it("should update config", () => {
    init({
      currencyPosition: 0,
      currencySymbol: "$",
    });
    expect(getFormattedPrice("4")).toBe("$ 4.00");
  });

  it("should return empty string", () => {
    init({
      currencyPosition: 0,
      currencySymbol: "$",
    });
    expect(getFormattedPrice(undefined)).toBe("");
  });
});
