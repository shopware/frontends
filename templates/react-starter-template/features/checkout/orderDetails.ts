import type { Schemas } from "#shopware";

function last<T>(items: T[] | undefined): T | undefined {
  return items?.length ? items[items.length - 1] : undefined;
}

export function getOrderShippingAddress(
  order: Schemas["Order"],
): Schemas["OrderAddress"] | null {
  return order.deliveries?.[0]?.shippingOrderAddress ?? null;
}

export function getOrderBillingAddress(
  order: Schemas["Order"],
): Schemas["OrderAddress"] | null {
  return (
    order.addresses?.find(({ id }) => id === order.billingAddressId) ??
    order.billingAddress ??
    null
  );
}

export function getOrderShippingMethod(
  order: Schemas["Order"],
): Schemas["ShippingMethod"] | null {
  return last(order.deliveries)?.shippingMethod ?? null;
}

export function getOrderPaymentMethod(
  order: Schemas["Order"],
): Schemas["PaymentMethod"] | null {
  return last(order.transactions)?.paymentMethod ?? null;
}

export function getOrderTotals(order: Schemas["Order"]): {
  subtotal: number | undefined;
  shippingCosts: number | undefined;
  total: number | undefined;
} {
  return {
    subtotal: order.price?.positionPrice,
    shippingCosts: order.shippingTotal,
    total: order.price?.totalPrice,
  };
}
