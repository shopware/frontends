import { ApiClientError, isTimeoutError } from "@shopware/api-client";
import { encodeForQuery } from "@shopware/api-client/helpers";

import type { ApiClient, Schemas, operations } from "#shopware";
import {
  addressListCriteria,
  createCustomerAddress,
  setDefaultShippingAddress,
  updateCustomerAddress,
  updatedAddressBody,
} from "@/features/account/address/addressApi";
import {
  ORDER_TIMEOUT_MS,
  READ_TIMEOUT_MS,
} from "@/features/session/readTimeout";

import type { AddressKind } from "./checkoutAddresses";

export type CheckoutClient = Pick<ApiClient, "invoke">;

export type CheckoutAddressFields = {
  firstName: string;
  lastName: string;
  street: string;
  zipcode: string;
  city: string;
  countryId: string;
  countryStateId?: string;
};

export type CheckoutCustomer = Pick<
  Schemas["Customer"],
  "salutationId" | "defaultBillingAddress"
> &
  Partial<Pick<Schemas["Customer"], "defaultShippingAddress">>;

export type CreateOrderBody =
  operations["createOrder post /checkout/order"]["body"];

type OnlyAvailableQuery = { onlyAvailable?: boolean };

type ShippingMethodQuery = NonNullable<
  operations["readShippingMethodGet get /shipping-method"]["query"]
> &
  OnlyAvailableQuery;

type PaymentMethodQuery = NonNullable<
  operations["readPaymentMethodGet get /payment-method"]["query"]
> &
  OnlyAvailableQuery;

type AddressBody =
  operations["updateCustomerAddress patch /account/address/{addressId}"]["body"];

export const shippingMethodCriteria: Schemas["Criteria"] = {
  associations: {
    prices: {},
  },
};

export const orderAssociations: NonNullable<
  Schemas["Criteria"]["associations"]
> = {
  stateMachineState: {},
  currency: {},
  lineItems: {
    associations: {
      cover: {},
      downloads: {
        associations: {
          media: {},
        },
      },
    },
  },
  addresses: {
    associations: {
      country: {},
    },
  },
  deliveries: {
    associations: {
      shippingMethod: {},
      shippingOrderAddress: {
        associations: {
          country: {},
        },
      },
      stateMachineState: {},
    },
  },
  transactions: {
    associations: {
      paymentMethod: {},
      stateMachineState: {},
    },
  },
};

export function sortByPosition<T extends { position?: number }>(
  methods: T[],
): T[] {
  return [...methods].sort(
    (first, second) => (first.position ?? 0) - (second.position ?? 0),
  );
}

export async function getShippingMethods(
  client: CheckoutClient,
): Promise<Schemas["ShippingMethod"][]> {
  const { data } = await client.invoke(
    "readShippingMethodGet get /shipping-method",
    {
      query: {
        onlyAvailable: true,
        _criteria: encodeForQuery(shippingMethodCriteria),
      } as ShippingMethodQuery,
    },
  );
  return sortByPosition(data.elements ?? []);
}

export async function getPaymentMethods(
  client: CheckoutClient,
): Promise<Schemas["PaymentMethod"][]> {
  const { data } = await client.invoke(
    "readPaymentMethodGet get /payment-method",
    {
      query: { onlyAvailable: true } as PaymentMethodQuery,
    },
  );
  return data.elements ?? [];
}

export async function setShippingMethod(
  client: CheckoutClient,
  shippingMethodId: string,
): Promise<void> {
  await client.invoke("updateContext patch /context", {
    body: { shippingMethodId },
  });
}

export async function setPaymentMethod(
  client: CheckoutClient,
  paymentMethodId: string,
): Promise<void> {
  await client.invoke("updateContext patch /context", {
    body: { paymentMethodId },
  });
}

export async function setContextAddress(
  client: CheckoutClient,
  kind: AddressKind,
  addressId: string,
): Promise<void> {
  await client.invoke("updateContext patch /context", {
    body:
      kind === "shipping"
        ? { shippingAddressId: addressId }
        : { billingAddressId: addressId },
  });
}

export async function listCheckoutAddresses(
  client: CheckoutClient,
): Promise<Schemas["CustomerAddress"][]> {
  const { data } = await client.invoke(
    "listAddress post /account/list-address",
    {
      body: addressListCriteria(),
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    },
  );
  return data.elements ?? [];
}

export function toOrderBody(customerComment: string): CreateOrderBody {
  const comment = customerComment.trim();
  return comment ? { customerComment: comment } : {};
}

export async function createOrder(
  client: CheckoutClient,
  body: CreateOrderBody = {},
): Promise<Schemas["Order"]> {
  const { data } = await client.invoke("createOrder post /checkout/order", {
    body,
    fetchOptions: { timeout: ORDER_TIMEOUT_MS },
  });
  return data;
}

const GATEWAY_STATUSES = new Set([502, 503, 504]);

export function isAmbiguousOrderFailure(error: unknown): boolean {
  if (isTimeoutError(error)) return true;
  if (!(error instanceof ApiClientError)) return true;
  return GATEWAY_STATUSES.has(error.status);
}

function existingAddressBody(address: Schemas["CustomerAddress"]): AddressBody {
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

type ShippingAddressSync = {
  shippingAddress: CheckoutAddressFields | null;
  createdShippingAddress: Schemas["CustomerAddress"] | null;
  onShippingAddressCreated?: (address: Schemas["CustomerAddress"]) => void;
};

async function syncShippingAddress(
  client: CheckoutClient,
  customer: CheckoutCustomer,
  {
    shippingAddress,
    createdShippingAddress,
    onShippingAddressCreated,
  }: ShippingAddressSync,
): Promise<void> {
  const billing = customer.defaultBillingAddress;
  const current = customer.defaultShippingAddress;
  const separate = current && current.id !== billing?.id ? current : null;
  const own = createdShippingAddress ?? separate;
  if (shippingAddress && own) {
    await updateCustomerAddress(
      client,
      own.id,
      updatedAddressBody(own, shippingAddress),
    );
    if (own.id !== current?.id) {
      await setDefaultShippingAddress(client, own.id);
    }
    return;
  }
  if (shippingAddress) {
    const created = await createCustomerAddress(client, shippingAddress);
    onShippingAddressCreated?.(created);
    await setDefaultShippingAddress(client, created.id);
    return;
  }
  if (own && billing) {
    await setDefaultShippingAddress(client, billing.id);
  }
}

export async function updateCustomerDetails(
  client: CheckoutClient,
  {
    customer,
    address,
    shippingAddress = null,
    createdShippingAddress = null,
    onShippingAddressCreated,
  }: {
    customer: CheckoutCustomer | null;
    address: CheckoutAddressFields;
    shippingAddress?: CheckoutAddressFields | null;
    createdShippingAddress?: Schemas["CustomerAddress"] | null;
    onShippingAddressCreated?: (address: Schemas["CustomerAddress"]) => void;
  },
): Promise<void> {
  const existingAddress = customer?.defaultBillingAddress;
  if (existingAddress) {
    await client.invoke(
      "updateCustomerAddress patch /account/address/{addressId}",
      {
        pathParams: { addressId: existingAddress.id },
        body: { ...existingAddressBody(existingAddress), ...address },
      },
    );
  }

  if (customer) {
    await syncShippingAddress(client, customer, {
      shippingAddress,
      createdShippingAddress,
      onShippingAddressCreated,
    });
  }

  await client.invoke("changeProfile post /account/change-profile", {
    body: {
      firstName: address.firstName,
      lastName: address.lastName,
      ...(customer?.salutationId
        ? { salutationId: customer.salutationId }
        : {}),
    },
  });
}

export async function readOrder(
  client: CheckoutClient,
  orderId: string,
): Promise<Schemas["Order"] | null> {
  const { data } = await client.invoke("readOrder post /order", {
    body: {
      ids: [orderId],
      associations: orderAssociations,
      checkPromotion: true,
    },
  });
  return data.orders?.elements?.[0] ?? null;
}

export async function handlePayment(
  client: CheckoutClient,
  {
    orderId,
    finishUrl,
    errorUrl,
  }: { orderId: string; finishUrl: string; errorUrl: string },
): Promise<{ redirectUrl: string | null }> {
  const { data } = await client.invoke(
    "handlePaymentMethod post /handle-payment",
    {
      body: { orderId, finishUrl, errorUrl },
    },
  );
  return { redirectUrl: data?.redirectUrl ?? null };
}
