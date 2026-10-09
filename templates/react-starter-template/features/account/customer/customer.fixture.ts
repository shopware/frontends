import type { Schemas } from "#shopware";
import {
  billingAddress,
  shippingAddress,
} from "@/features/account/address/address.fixture";

export function accountCustomer(
  overrides: Partial<Schemas["Customer"]> = {},
): Schemas["Customer"] {
  return {
    id: "customer-1",
    active: true,
    guest: false,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    defaultBillingAddressId: "address-billing",
    defaultShippingAddressId: "address-shipping",
    defaultBillingAddress: billingAddress,
    defaultShippingAddress: shippingAddress,
    ...overrides,
  } as Schemas["Customer"];
}
