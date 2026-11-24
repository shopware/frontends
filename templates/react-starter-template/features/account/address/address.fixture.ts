import type { Schemas } from "#shopware";
import type { Invocation } from "@/features/checkout/checkout.fixture";

export const LIST_ADDRESS = "listAddress post /account/list-address";
export const CREATE_ADDRESS = "createCustomerAddress post /account/address";
export const UPDATE_ADDRESS =
  "updateCustomerAddress patch /account/address/{addressId}";
export const DELETE_ADDRESS =
  "deleteCustomerAddress delete /account/address/{addressId}";
export const DEFAULT_BILLING =
  "defaultBillingAddress patch /account/address/default-billing/{addressId}";
export const DEFAULT_SHIPPING =
  "defaultShippingAddress patch /account/address/default-shipping/{addressId}";

export function sentBody(invocation: Invocation | undefined): object {
  if (!invocation) throw new Error("The operation was not invoked");
  return (invocation.params as { body: object }).body;
}

export function customerAddress(
  overrides: Partial<Schemas["CustomerAddress"]> = {},
): Schemas["CustomerAddress"] {
  return {
    id: "address-billing",
    customerId: "customer-1",
    salutationId: "salutation-mr",
    firstName: "Jane",
    lastName: "Doe",
    street: "Main Street 1",
    zipcode: "12345",
    city: "Berlin",
    countryId: "country-de",
    countryStateId: "state-de-be",
    country: { name: "Germany", translated: { name: "Germany" } },
    ...overrides,
  } as Schemas["CustomerAddress"];
}

export const billingAddress = customerAddress();

export const shippingAddress = customerAddress({
  id: "address-shipping",
  firstName: "John",
  lastName: "Roe",
  street: "Harbour Road 7",
  zipcode: "20095",
  city: "Hamburg",
  countryStateId: undefined,
});

export const otherAddress = customerAddress({
  id: "address-other",
  firstName: "Max",
  lastName: "Mustermann",
  company: "Acme",
  phoneNumber: "+49 30 1234",
  street: "Side Street 3",
  zipcode: "10115",
  city: "Berlin",
  countryId: "country-pl",
  countryStateId: undefined,
  country: {
    name: "Poland",
    translated: { name: "Polska" },
  } as Schemas["Country"],
});

export const salutations = [
  { label: "Mr.", value: "salutation-mr" },
  { label: "Mrs.", value: "salutation-mrs" },
];
