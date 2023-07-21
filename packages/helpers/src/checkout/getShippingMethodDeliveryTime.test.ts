import { describe, expect, it } from "vitest";
import { getShippingMethodDeliveryTime } from "./getShippingMethodDeliveryTime";
import mockedShippingMethods from "./mocks/shippingMethods";

describe("getShippingMethodDeliveryTime", () => {
  it("should return shipping delivery time", () => {
    const deliveryTimeMocked =
      mockedShippingMethods[0].deliveryTime?.translated.name;
    const deliveryTime = getShippingMethodDeliveryTime(
      mockedShippingMethods[0],
    );
    expect(deliveryTime).toBe(deliveryTimeMocked);
  });
});
