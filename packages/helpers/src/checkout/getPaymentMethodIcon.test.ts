import { describe, expect, it } from "vitest";
import { getPaymentMethodIcon } from "./getPaymentMethodIcon";
import mockedPaymentMethods from "./mocks/paymentMethods";

describe("getPaymentMethodIcon", () => {
  it("should return payment method icon", () => {
    const paymentMethod = mockedPaymentMethods[0] ?? {};
    const paymentMethodIcon = mockedPaymentMethods[0]?.media?.url;

    const icon = getPaymentMethodIcon(paymentMethod);
    expect(icon).toBe(paymentMethodIcon);
  });

  it("should return empty string if payment method is not provided", () => {
    const icon = getPaymentMethodIcon({});
    expect(icon).toBe("");
  });
});
