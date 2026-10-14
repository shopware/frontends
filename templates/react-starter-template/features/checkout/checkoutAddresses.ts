import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type AddressKind = "shipping" | "billing";

export type ActiveCheckoutAddresses = {
  shipping: Schemas["CustomerAddress"] | null;
  billing: Schemas["CustomerAddress"] | null;
  sameAddress: boolean;
};

export function activeCheckoutAddresses(
  customer: Partial<
    Pick<
      Schemas["Customer"],
      | "activeBillingAddress"
      | "activeShippingAddress"
      | "defaultBillingAddress"
      | "defaultShippingAddress"
    >
  >,
): ActiveCheckoutAddresses {
  const billing =
    customer.activeBillingAddress ?? customer.defaultBillingAddress ?? null;
  const shipping =
    customer.activeShippingAddress ??
    customer.defaultShippingAddress ??
    billing;
  return {
    shipping,
    billing,
    sameAddress: Boolean(shipping && billing && shipping.id === billing.id),
  };
}

export function addressSummary(
  address: Pick<
    Schemas["CustomerAddress"],
    "firstName" | "lastName" | "street" | "zipcode" | "city" | "country"
  >,
): string {
  const country = address.country
    ? getTranslatedProperty(address.country, "name")
    : "";
  return [
    `${address.firstName} ${address.lastName}`,
    address.street,
    `${address.zipcode ?? ""} ${address.city}`,
    country,
  ]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}
