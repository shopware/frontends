import { ApiClientError } from "@shopware/api-client";

import type { ApiClient, Schemas, operations } from "#shopware";

export type AddressClient = Pick<ApiClient, "invoke">;

export type AddressBody =
  operations["createCustomerAddress post /account/address"]["body"];

const INVALID_UUID = "FRAMEWORK__INVALID_UUID";

export const addressAssociations: NonNullable<
  Schemas["Criteria"]["associations"]
> = {
  country: {},
  countryState: {},
  salutation: {},
};

export function addressListCriteria(): Schemas["Criteria"] {
  return { associations: addressAssociations };
}

export function addressByIdCriteria(addressId: string): Schemas["Criteria"] {
  return {
    ...addressListCriteria(),
    filter: [{ type: "equals", field: "id", value: addressId }],
  };
}

export async function listCustomerAddresses(
  client: AddressClient,
): Promise<Schemas["CustomerAddress"][]> {
  const { data } = await client.invoke(
    "listAddress post /account/list-address",
    { body: addressListCriteria() },
  );
  return data.elements ?? [];
}

export function isInvalidUuidError(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) return false;
  const errors: { code?: string }[] | undefined = error.details?.errors;
  return Array.isArray(errors) && errors.some((e) => e?.code === INVALID_UUID);
}

export async function readCustomerAddress(
  client: AddressClient,
  addressId: string,
): Promise<Schemas["CustomerAddress"] | null> {
  try {
    const { data } = await client.invoke(
      "listAddress post /account/list-address",
      { body: addressByIdCriteria(addressId) },
    );
    return (
      (data.elements ?? []).find((address) => address.id === addressId) ?? null
    );
  } catch (error) {
    if (isInvalidUuidError(error)) return null;
    throw error;
  }
}

export async function createCustomerAddress(
  client: AddressClient,
  body: AddressBody,
): Promise<Schemas["CustomerAddress"]> {
  const { data } = await client.invoke(
    "createCustomerAddress post /account/address",
    { body },
  );
  return data;
}

export async function updateCustomerAddress(
  client: AddressClient,
  addressId: string,
  body: AddressBody,
): Promise<Schemas["CustomerAddress"]> {
  const { data } = await client.invoke(
    "updateCustomerAddress patch /account/address/{addressId}",
    { pathParams: { addressId }, body },
  );
  return data;
}

export async function deleteCustomerAddress(
  client: AddressClient,
  addressId: string,
): Promise<void> {
  await client.invoke(
    "deleteCustomerAddress delete /account/address/{addressId}",
    { pathParams: { addressId } },
  );
}

export async function setDefaultBillingAddress(
  client: AddressClient,
  addressId: string,
): Promise<void> {
  await client.invoke(
    "defaultBillingAddress patch /account/address/default-billing/{addressId}",
    { pathParams: { addressId } },
  );
}

export async function setDefaultShippingAddress(
  client: AddressClient,
  addressId: string,
): Promise<void> {
  await client.invoke(
    "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
    { pathParams: { addressId } },
  );
}

export function existingAddressBody(
  address: Schemas["CustomerAddress"],
): AddressBody {
  return {
    salutationId: address.salutationId,
    title: address.title,
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company,
    department: address.department,
    street: address.street,
    additionalAddressLine1: address.additionalAddressLine1,
    additionalAddressLine2: address.additionalAddressLine2,
    zipcode: address.zipcode,
    city: address.city,
    countryId: address.countryId,
    countryStateId: address.countryStateId,
    phoneNumber: address.phoneNumber,
  };
}

export function updatedAddressBody(
  address: Schemas["CustomerAddress"],
  changes: AddressBody,
): AddressBody {
  const body: AddressBody = { ...existingAddressBody(address), ...changes };
  if (!changes.countryStateId) delete body.countryStateId;
  return body;
}
