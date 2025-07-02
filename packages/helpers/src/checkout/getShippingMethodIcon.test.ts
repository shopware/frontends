import { describe, expect, it } from "vitest";
import { getShippingMethodIcon } from "./getShippingMethodIcon";
import mockedShippingMethods from "./mocks/shippingMethods";

describe("getShippingMethodIcon", () => {
  it("should return shipping delivery icon", () => {
    const shippingMethod = mockedShippingMethods[0] ?? {};
    const shippingMethodIcon = mockedShippingMethods[0]?.media?.url;

    const icon = getShippingMethodIcon(shippingMethod);
    expect(icon).toBe(shippingMethodIcon);
  });

  it("should return empty string if shipping method is not provided", () => {
    const icon = getShippingMethodIcon({});
    expect(icon).toBe("");
  });
});
