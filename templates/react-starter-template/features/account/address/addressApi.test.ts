import { ApiClientError } from "@shopware/api-client";
import { describe, expect, it } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";

import {
  CREATE_ADDRESS,
  DEFAULT_BILLING,
  DEFAULT_SHIPPING,
  DELETE_ADDRESS,
  LIST_ADDRESS,
  UPDATE_ADDRESS,
  customerAddress,
  otherAddress,
} from "./address.fixture";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  existingAddressBody,
  isInvalidUuidError,
  listCustomerAddresses,
  readCustomerAddress,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
  updateCustomerAddress,
  updatedAddressBody,
} from "./addressApi";

const ASSOCIATIONS = { country: {}, countryState: {}, salutation: {} };

function apiError(code: string, status = 400) {
  return new ApiClientError(
    Object.assign(new Response(null, { status }), {
      _data: { errors: [{ code, status: String(status), detail: code }] },
    }),
  );
}

const body = {
  salutationId: "salutation-mr",
  firstName: "Jane",
  lastName: "Doe",
  street: "Main Street 1",
  zipcode: "12345",
  city: "Berlin",
  countryId: "country-de",
};

describe("listCustomerAddresses", () => {
  it("posts list-address with the country, state and salutation associations", async () => {
    const elements = [customerAddress(), otherAddress];
    const { client, invocations } = fakeClient(() => ({ elements }));

    await expect(listCustomerAddresses(client)).resolves.toEqual(elements);
    expect(invocations).toEqual([
      {
        operation: LIST_ADDRESS,
        params: { body: { associations: ASSOCIATIONS } },
      },
    ]);
  });

  it("returns an empty list when the response has no elements", async () => {
    const { client } = fakeClient(() => ({}));

    await expect(listCustomerAddresses(client)).resolves.toEqual([]);
  });
});

describe("readCustomerAddress", () => {
  it("filters list-address by id and returns the matching address", async () => {
    const { client, invocations } = fakeClient(() => ({
      elements: [otherAddress],
    }));

    await expect(readCustomerAddress(client, "address-other")).resolves.toBe(
      otherAddress,
    );
    expect(invocations).toEqual([
      {
        operation: LIST_ADDRESS,
        params: {
          body: {
            associations: ASSOCIATIONS,
            filter: [{ type: "equals", field: "id", value: "address-other" }],
          },
        },
      },
    ]);
  });

  it("returns null when no address of the customer has the id", async () => {
    const { client } = fakeClient(() => ({
      elements: [customerAddress()],
    }));

    await expect(readCustomerAddress(client, "address-x")).resolves.toBeNull();
  });

  it("returns null for an id the backend rejects as an invalid uuid", async () => {
    const { client } = fakeClient(() => {
      throw apiError("FRAMEWORK__INVALID_UUID");
    });

    await expect(readCustomerAddress(client, "not-a-uuid")).resolves.toBeNull();
  });

  it("rethrows every other failure", async () => {
    const failure = apiError("FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN", 403);
    const { client } = fakeClient(() => {
      throw failure;
    });

    await expect(readCustomerAddress(client, "address-1")).rejects.toBe(
      failure,
    );
  });
});

describe("isInvalidUuidError", () => {
  it("recognises only an ApiClientError carrying FRAMEWORK__INVALID_UUID", () => {
    expect(isInvalidUuidError(apiError("FRAMEWORK__INVALID_UUID"))).toBe(true);
    expect(isInvalidUuidError(apiError("VIOLATION::IS_BLANK_ERROR"))).toBe(
      false,
    );
    expect(isInvalidUuidError(new Error("FRAMEWORK__INVALID_UUID"))).toBe(
      false,
    );
  });
});

describe("address mutations", () => {
  it("creates an address with a POST to /account/address", async () => {
    const created = customerAddress({ id: "address-new" });
    const { client, invocations } = fakeClient(() => created);

    await expect(createCustomerAddress(client, body)).resolves.toBe(created);
    expect(invocations).toEqual([
      { operation: CREATE_ADDRESS, params: { body } },
    ]);
  });

  it("patches the address under its id", async () => {
    const updated = customerAddress({ city: "Munich" });
    const { client, invocations } = fakeClient(() => updated);

    await expect(
      updateCustomerAddress(client, "address-billing", body),
    ).resolves.toBe(updated);
    expect(invocations).toEqual([
      {
        operation: UPDATE_ADDRESS,
        params: { pathParams: { addressId: "address-billing" }, body },
      },
    ]);
  });

  it("deletes the address under its id", async () => {
    const { client, invocations } = fakeClient();

    await expect(
      deleteCustomerAddress(client, "address-other"),
    ).resolves.toBeUndefined();
    expect(invocations).toEqual([
      {
        operation: DELETE_ADDRESS,
        params: { pathParams: { addressId: "address-other" } },
      },
    ]);
  });

  it("sets the default billing and shipping address with their own patches", async () => {
    const { client, invocations } = fakeClient();

    await setDefaultBillingAddress(client, "address-other");
    await setDefaultShippingAddress(client, "address-other");

    expect(invocations).toEqual([
      {
        operation: DEFAULT_BILLING,
        params: { pathParams: { addressId: "address-other" } },
      },
      {
        operation: DEFAULT_SHIPPING,
        params: { pathParams: { addressId: "address-other" } },
      },
    ]);
  });
});

describe("update bodies", () => {
  const stored = customerAddress({
    title: "Dr.",
    company: "Acme",
    department: "Sales",
    additionalAddressLine1: "Building B",
    additionalAddressLine2: "Floor 3",
    phoneNumber: "+49 30 1234",
  });

  it("carries every writable field of the stored address", () => {
    expect(existingAddressBody(stored)).toEqual({
      salutationId: "salutation-mr",
      title: "Dr.",
      firstName: "Jane",
      lastName: "Doe",
      company: "Acme",
      department: "Sales",
      street: "Main Street 1",
      additionalAddressLine1: "Building B",
      additionalAddressLine2: "Floor 3",
      zipcode: "12345",
      city: "Berlin",
      countryId: "country-de",
      countryStateId: "state-de-be",
      phoneNumber: "+49 30 1234",
    });
  });

  it("keeps the fields the form does not edit and applies the form values", () => {
    const changes = {
      ...body,
      city: "Munich",
      countryStateId: "state-de-by",
    };

    expect(updatedAddressBody(stored, changes)).toEqual({
      ...existingAddressBody(stored),
      ...changes,
    });
  });

  it("drops the stored state when the form sends none", () => {
    const changes = { ...body, countryId: "country-pl" };

    const result = updatedAddressBody(stored, changes);

    expect(result).not.toHaveProperty("countryStateId");
    expect(result).toMatchObject({ countryId: "country-pl", company: "Acme" });
  });
});
