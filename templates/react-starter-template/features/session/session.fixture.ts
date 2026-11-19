import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import type { Schemas } from "#shopware";

import type { RegistrationInput } from "./types";

export const ENGLISH_DOMAIN = "https://shop.test/en";

export function apiClientError(errors: ApiError[], status = 400) {
  return new ApiClientError(
    Object.assign(new Response(null, { status }), { _data: { errors } }),
  );
}

type ApiErrorResponse = ConstructorParameters<typeof ApiClientError>[0];

export function apiClientErrorWithBody(data: unknown, status: number) {
  return new ApiClientError(
    Object.assign(new Response(null, { status }), {
      _data: data,
    }) as unknown as ApiErrorResponse,
  );
}

export function customer(
  overrides: Partial<Schemas["Customer"]> = {},
): Schemas["Customer"] {
  return {
    id: "customer-1",
    active: true,
    guest: false,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    ...overrides,
  } as Schemas["Customer"];
}

export function salesChannelContext(
  currentCustomer: Schemas["Customer"] | null = null,
): Schemas["SalesChannelContext"] {
  return {
    apiAlias: "sales_channel_context",
    customer: currentCustomer,
    context: { languageIdChain: ["language-en"] },
    salesChannel: {
      languageId: "language-de",
      domains: [
        { url: "https://shop.test/de", languageId: "language-de" },
        { url: ENGLISH_DOMAIN, languageId: "language-en" },
      ],
    },
  } as unknown as Schemas["SalesChannelContext"];
}

export const registrationInput: RegistrationInput = {
  accountType: "private",
  acceptedDataProtection: true,
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  password: "password1",
  billingAddress: {
    id: "",
    customerId: "",
    firstName: "Jane",
    lastName: "Doe",
    street: "Main Street 1",
    zipcode: "12345",
    city: "Berlin",
    countryId: "country-de",
  },
};
