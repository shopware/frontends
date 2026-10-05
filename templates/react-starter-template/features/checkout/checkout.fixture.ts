import type { ApiClient, Schemas } from "#shopware";
import type { StorefrontSession } from "@/features/session/types";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import type { CheckoutClient } from "./checkoutApi";

export type Invocation = { operation: string; params: unknown };

export type FakeAnswer = (operation: string, params: unknown) => unknown;

export function fakeClient(answer: FakeAnswer = () => ({})) {
  const invocations: Invocation[] = [];
  const invoke = (async (operation: string, params?: unknown) => {
    invocations.push({ operation, params });
    return { data: await answer(operation, params), status: 200 };
  }) as ApiClient["invoke"];
  const client: CheckoutClient = { invoke };
  return {
    client,
    invocations,
    operations: () => invocations.map(({ operation }) => operation),
    calls: (operation: string) =>
      invocations.filter((invocation) => invocation.operation === operation),
  };
}

export function shippingMethod(
  overrides: Partial<Schemas["ShippingMethod"]> = {},
): Schemas["ShippingMethod"] {
  return {
    id: "shipping-standard",
    name: "Standard",
    translated: { name: "Standard" },
    position: 1,
    ...overrides,
  } as Schemas["ShippingMethod"];
}

export function paymentMethod(
  overrides: Partial<Schemas["PaymentMethod"]> = {},
): Schemas["PaymentMethod"] {
  return {
    id: "payment-invoice",
    name: "Invoice",
    translated: { name: "Invoice", description: "Pay within 14 days" },
    position: 1,
    ...overrides,
  } as Schemas["PaymentMethod"];
}

export const shippingMethods = [
  shippingMethod(),
  shippingMethod({
    id: "shipping-express",
    name: "Express",
    translated: { name: "Express" } as Schemas["ShippingMethod"]["translated"],
    position: 2,
  }),
];

export const paymentMethods = [
  paymentMethod(),
  paymentMethod({
    id: "payment-cash",
    name: "Cash on delivery",
    translated: {
      name: "Cash on delivery",
    } as Schemas["PaymentMethod"]["translated"],
    position: 2,
  }),
];

export const countries: CountryOption[] = [
  {
    id: "country-de",
    name: "Germany",
    iso: "DE",
    states: [
      { id: "state-by", name: "Bavaria" },
      { id: "state-be", name: "Berlin" },
    ],
  },
  { id: "country-pl", name: "Poland", iso: "PL", states: [] },
];

export function billingAddress(
  overrides: Partial<Schemas["CustomerAddress"]> = {},
): Schemas["CustomerAddress"] {
  return {
    id: "address-1",
    customerId: "customer-1",
    salutationId: "salutation-1",
    firstName: "Jane",
    lastName: "Doe",
    street: "Main Street 1",
    zipcode: "12345",
    city: "Berlin",
    countryId: "country-de",
    country: {
      id: "country-de",
      name: "Germany",
      translated: { name: "Germany" },
    },
    ...overrides,
  } as Schemas["CustomerAddress"];
}

export function checkoutCustomer(
  overrides: Partial<Schemas["Customer"]> = {},
): Schemas["Customer"] {
  return {
    id: "customer-1",
    active: true,
    guest: false,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    salutationId: "salutation-1",
    defaultBillingAddress: billingAddress(),
    ...overrides,
  } as Schemas["Customer"];
}

export function checkoutSession({
  customer = null,
  shippingMethodId = "shipping-standard",
  paymentMethodId = "payment-invoice",
  status = "ready",
}: {
  customer?: Schemas["Customer"] | null;
  shippingMethodId?: string | null;
  paymentMethodId?: string | null;
  status?: StorefrontSession["status"];
} = {}): StorefrontSession {
  const isLoggedIn = Boolean(customer?.active && !customer.guest);
  return {
    status,
    isLoggedIn,
    isGuestSession: Boolean(customer?.guest),
    customerName: isLoggedIn
      ? `${customer?.firstName} ${customer?.lastName}`
      : null,
    wishlistCount: 0,
    context: {
      customer,
      currency: { isoCode: "EUR" },
      shippingMethod: shippingMethodId ? { id: shippingMethodId } : undefined,
      paymentMethod: paymentMethodId ? { id: paymentMethodId } : undefined,
    } as unknown as Schemas["SalesChannelContext"],
  };
}

export function orderAddress(
  overrides: Partial<Schemas["OrderAddress"]> = {},
): Schemas["OrderAddress"] {
  return {
    id: "order-address-1",
    firstName: "Jane",
    lastName: "Doe",
    street: "Main Street 1",
    zipcode: "12345",
    city: "Berlin",
    countryId: "country-de",
    country: { name: "Germany", translated: { name: "Germany" } },
    ...overrides,
  } as Schemas["OrderAddress"];
}

export function order(
  overrides: Partial<Schemas["Order"]> = {},
): Schemas["Order"] {
  return {
    id: "order-1",
    orderNumber: "10042",
    orderDate: "2026-10-05T10:30:00.000+00:00",
    billingAddressId: "order-address-billing",
    shippingTotal: 4.99,
    price: {
      positionPrice: 59.98,
      totalPrice: 64.97,
    },
    stateMachineState: {
      name: "Open",
      technicalName: "open",
      translated: { name: "Open" },
    },
    addresses: [
      orderAddress({ id: "order-address-billing", street: "Billing Road 2" }),
    ],
    deliveries: [
      {
        shippingOrderAddress: orderAddress({ id: "order-address-shipping" }),
        shippingMethod: shippingMethod({
          deliveryTime: { translated: { name: "1-3 days" } },
        } as Partial<Schemas["ShippingMethod"]>),
      },
    ],
    transactions: [{ paymentMethod: paymentMethod() }],
    lineItems: [
      {
        id: "line-1",
        identifier: "line-1",
        label: "Aerodynamic Bag",
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
        type: "product",
        states: ["is-physical"],
        cover: { url: "https://cdn.test/bag.jpg", thumbnails: [] },
      },
    ],
    ...overrides,
  } as unknown as Schemas["Order"];
}
