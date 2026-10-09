import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { order, orderAddress, paymentMethod } from "./checkout.fixture";
import {
  getOrderBillingAddress,
  getOrderPaymentMethod,
  getOrderShippingAddress,
  getOrderShippingMethod,
  getOrderTotals,
} from "./orderDetails";

describe("order details", () => {
  it("reads the addresses, methods and totals of an order", () => {
    const placed = order();

    expect(getOrderShippingAddress(placed)?.id).toBe("order-address-shipping");
    expect(getOrderBillingAddress(placed)?.street).toBe("Billing Road 2");
    expect(getOrderShippingMethod(placed)?.id).toBe("shipping-standard");
    expect(getOrderPaymentMethod(placed)?.id).toBe("payment-invoice");
    expect(getOrderTotals(placed)).toEqual({
      subtotal: 59.98,
      shippingCosts: 4.99,
      total: 64.97,
    });
  });

  it("uses the latest transaction and delivery", () => {
    const placed = order({
      transactions: [
        { paymentMethod: paymentMethod({ id: "payment-first" }) },
        { paymentMethod: paymentMethod({ id: "payment-latest" }) },
      ] as Schemas["OrderTransaction"][],
    });

    expect(getOrderPaymentMethod(placed)?.id).toBe("payment-latest");
  });

  it("falls back to the billing address association and to null", () => {
    const billing = orderAddress({ id: "order-address-billing" });

    expect(
      getOrderBillingAddress(order({ addresses: [], billingAddress: billing })),
    ).toBe(billing);
    expect(getOrderBillingAddress(order({ addresses: undefined }))).toBeNull();
    expect(getOrderShippingAddress(order({ deliveries: [] }))).toBeNull();
    expect(getOrderShippingMethod(order({ deliveries: [] }))).toBeNull();
    expect(getOrderPaymentMethod(order({ transactions: [] }))).toBeNull();
  });
});
