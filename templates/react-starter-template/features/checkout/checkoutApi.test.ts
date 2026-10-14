import { gunzipSync } from "node:zlib";

import { ApiClientError } from "@shopware/api-client";
import { describe, expect, it, vi } from "vitest";

import { addressListCriteria } from "@/features/account/address/addressApi";
import {
  ORDER_TIMEOUT_MS,
  READ_TIMEOUT_MS,
} from "@/features/session/readTimeout";

import {
  billingAddress,
  checkoutCustomer,
  fakeClient,
  order,
  paymentMethods,
  shippingAddress,
  shippingMethod,
} from "./checkout.fixture";
import {
  createOrder,
  getPaymentMethods,
  getShippingMethods,
  handlePayment,
  isAmbiguousOrderFailure,
  listCheckoutAddresses,
  readOrder,
  setContextAddress,
  setPaymentMethod,
  setShippingMethod,
  sortByPosition,
  toOrderBody,
  updateCustomerDetails,
} from "./checkoutApi";

function decodeCriteria(encoded: unknown): unknown {
  if (typeof encoded !== "string") throw new Error("criteria is not a string");
  return JSON.parse(gunzipSync(Buffer.from(encoded, "base64url")).toString());
}

function queryOf(params: unknown): Record<string, unknown> {
  return (params as { query: Record<string, unknown> }).query;
}

const address = {
  firstName: "John",
  lastName: "Smith",
  street: "New Street 5",
  zipcode: "54321",
  city: "Hamburg",
  countryId: "country-pl",
  countryStateId: undefined,
};

const shipping = {
  firstName: "Max",
  lastName: "Mustermann",
  street: "Harbour Road 7",
  zipcode: "10115",
  city: "Berlin",
  countryId: "country-de",
  countryStateId: undefined,
};

describe("getShippingMethods", () => {
  it("reads the available methods over GET with the prices association and sorts them by position", async () => {
    const { client, invocations } = fakeClient(() => ({
      elements: [
        shippingMethod({ id: "third", position: 3 }),
        shippingMethod({ id: "first", position: 1 }),
        shippingMethod({ id: "second", position: 2 }),
      ],
    }));

    const methods = await getShippingMethods(client);

    expect(methods.map(({ id }) => id)).toEqual(["first", "second", "third"]);
    expect(invocations).toHaveLength(1);
    expect(invocations[0]?.operation).toBe(
      "readShippingMethodGet get /shipping-method",
    );
    const query = queryOf(invocations[0]?.params);
    expect(Object.keys(query).sort()).toEqual(["_criteria", "onlyAvailable"]);
    expect(query.onlyAvailable).toBe(true);
    expect(decodeCriteria(query._criteria)).toEqual({
      associations: { prices: {} },
    });
  });

  it("resolves an empty list when the response has no elements", async () => {
    const { client } = fakeClient(() => ({}));

    await expect(getShippingMethods(client)).resolves.toEqual([]);
  });
});

describe("sortByPosition", () => {
  it("keeps the order of methods without a position and does not mutate the input", () => {
    const input = [
      { id: "b", position: 2 },
      { id: "none" },
      { id: "a", position: 1 },
    ];

    expect(sortByPosition(input).map(({ id }) => id)).toEqual([
      "none",
      "a",
      "b",
    ]);
    expect(input.map(({ id }) => id)).toEqual(["b", "none", "a"]);
  });
});

describe("getPaymentMethods", () => {
  it("reads the available methods over GET and keeps the backend order", async () => {
    const reversed = [...paymentMethods].reverse();
    const { client, invocations } = fakeClient(() => ({ elements: reversed }));

    await expect(getPaymentMethods(client)).resolves.toEqual(reversed);
    expect(invocations).toEqual([
      {
        operation: "readPaymentMethodGet get /payment-method",
        params: { query: { onlyAvailable: true } },
      },
    ]);
  });
});

describe("setShippingMethod and setPaymentMethod", () => {
  it("patches the context with the chosen shipping method", async () => {
    const { client, invocations } = fakeClient();

    await setShippingMethod(client, "shipping-express");

    expect(invocations).toEqual([
      {
        operation: "updateContext patch /context",
        params: { body: { shippingMethodId: "shipping-express" } },
      },
    ]);
  });

  it("patches the context with the chosen payment method", async () => {
    const { client, invocations } = fakeClient();

    await setPaymentMethod(client, "payment-cash");

    expect(invocations).toEqual([
      {
        operation: "updateContext patch /context",
        params: { body: { paymentMethodId: "payment-cash" } },
      },
    ]);
  });
});

describe("setContextAddress", () => {
  it("switches only the active shipping or billing address of the context", async () => {
    const { client, invocations } = fakeClient();

    await setContextAddress(client, "shipping", "address-2");
    await setContextAddress(client, "billing", "address-3");

    expect(invocations).toEqual([
      {
        operation: "updateContext patch /context",
        params: { body: { shippingAddressId: "address-2" } },
      },
      {
        operation: "updateContext patch /context",
        params: { body: { billingAddressId: "address-3" } },
      },
    ]);
  });
});

describe("listCheckoutAddresses", () => {
  it("reads the customer addresses with their associations and gives up after the read timeout", async () => {
    const addresses = [billingAddress(), shippingAddress()];
    const { client, invocations } = fakeClient(() => ({
      elements: addresses,
    }));

    await expect(listCheckoutAddresses(client)).resolves.toEqual(addresses);
    expect(invocations).toEqual([
      {
        operation: "listAddress post /account/list-address",
        params: {
          body: addressListCriteria(),
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        },
      },
    ]);
  });

  it("resolves an empty list when the response has no elements", async () => {
    const { client } = fakeClient(() => ({}));

    await expect(listCheckoutAddresses(client)).resolves.toEqual([]);
  });
});

describe("toOrderBody", () => {
  it("sends the trimmed comment and nothing for a blank one", () => {
    expect(toOrderBody("  Ring twice\n")).toEqual({
      customerComment: "Ring twice",
    });
    expect(toOrderBody("Line one\nLine two")).toEqual({
      customerComment: "Line one\nLine two",
    });
    expect(toOrderBody(" \n\t ")).toEqual({});
    expect(toOrderBody("")).toEqual({});
  });
});

describe("createOrder", () => {
  it("posts an empty body with the order timeout and resolves the created order", async () => {
    const created = order();
    const { client, invocations } = fakeClient(() => created);

    await expect(createOrder(client)).resolves.toBe(created);
    expect(invocations).toEqual([
      {
        operation: "createOrder post /checkout/order",
        params: { body: {}, fetchOptions: { timeout: ORDER_TIMEOUT_MS } },
      },
    ]);
    expect(ORDER_TIMEOUT_MS).toBe(60_000);
  });

  it("forwards a customer comment", async () => {
    const { client, invocations } = fakeClient(() => order());

    await createOrder(client, { customerComment: "Ring twice" });

    expect(invocations[0]?.params).toEqual({
      body: { customerComment: "Ring twice" },
      fetchOptions: { timeout: ORDER_TIMEOUT_MS },
    });
  });

  it("rejects with the API error", async () => {
    const failure = new Error("order failed");
    const { client } = fakeClient(() => {
      throw failure;
    });

    await expect(createOrder(client)).rejects.toBe(failure);
  });
});

function statusError(status: number) {
  return new ApiClientError(
    Object.assign(new Response(null, { status }), {
      _data: { errors: [{ code: "SOME_CODE" }] },
    }),
  );
}

describe("isAmbiguousOrderFailure", () => {
  it("treats a timeout as ambiguous, named itself or in its cause", () => {
    expect(
      isAmbiguousOrderFailure(
        new DOMException("The operation timed out.", "TimeoutError"),
      ),
    ).toBe(true);
    expect(
      isAmbiguousOrderFailure(
        Object.assign(new Error("fetch failed"), {
          cause: { name: "TimeoutError" },
        }),
      ),
    ).toBe(true);
  });

  it("treats an error without an HTTP status as ambiguous", () => {
    expect(isAmbiguousOrderFailure(new TypeError("Failed to fetch"))).toBe(
      true,
    );
  });

  it("treats the gateway statuses as ambiguous", () => {
    expect(
      [502, 503, 504].map((status) =>
        isAmbiguousOrderFailure(statusError(status)),
      ),
    ).toEqual([true, true, true]);
  });

  it("treats any other API error as a definite failure", () => {
    expect(
      [400, 403, 404, 500].map((status) =>
        isAmbiguousOrderFailure(statusError(status)),
      ),
    ).toEqual([false, false, false, false]);
  });
});

describe("updateCustomerDetails", () => {
  it("patches the default billing address keeping its other fields, then changes the profile", async () => {
    const existing = billingAddress({
      company: "ACME",
      department: "Sales",
      title: "Dr.",
      phoneNumber: "+49 30 1234",
      additionalAddressLine1: "Floor 3",
      countryStateId: "state-be",
    });
    const { client, invocations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer({ defaultBillingAddress: existing }),
      address,
    });

    expect(invocations).toEqual([
      {
        operation: "updateCustomerAddress patch /account/address/{addressId}",
        params: {
          pathParams: { addressId: "address-1" },
          body: {
            salutationId: "salutation-1",
            title: "Dr.",
            firstName: "John",
            lastName: "Smith",
            company: "ACME",
            department: "Sales",
            street: "New Street 5",
            additionalAddressLine1: "Floor 3",
            additionalAddressLine2: undefined,
            zipcode: "54321",
            city: "Hamburg",
            countryId: "country-pl",
            countryStateId: undefined,
            phoneNumber: "+49 30 1234",
          },
        },
      },
      {
        operation: "changeProfile post /account/change-profile",
        params: {
          body: {
            firstName: "John",
            lastName: "Smith",
            salutationId: "salutation-1",
          },
        },
      },
    ]);
    const [addressPatch] = invocations;
    expect(JSON.parse(JSON.stringify(addressPatch?.params))).not.toHaveProperty(
      "body.countryStateId",
    );
    expect(JSON.parse(JSON.stringify(addressPatch?.params))).toHaveProperty(
      "body.countryId",
      "country-pl",
    );
  });

  it("only changes the profile when the customer has no default billing address", async () => {
    const { client, invocations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer({
        defaultBillingAddress: undefined,
        salutationId: undefined,
      }),
      address,
    });

    expect(invocations).toEqual([
      {
        operation: "changeProfile post /account/change-profile",
        params: { body: { firstName: "John", lastName: "Smith" } },
      },
    ]);
  });

  it("creates the shipping address and makes it the default when the customer has none of its own", async () => {
    const { client, invocations } = fakeClient((operation) =>
      operation === "createCustomerAddress post /account/address"
        ? shippingAddress({ id: "address-new" })
        : {},
    );

    await updateCustomerDetails(client, {
      customer: checkoutCustomer({
        defaultShippingAddress: billingAddress(),
      }),
      address,
      shippingAddress: shipping,
    });

    expect(invocations.map(({ operation }) => operation)).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "createCustomerAddress post /account/address",
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
      "changeProfile post /account/change-profile",
    ]);
    expect(invocations[1]?.params).toEqual({ body: shipping });
    expect(invocations[2]?.params).toEqual({
      pathParams: { addressId: "address-new" },
    });
  });

  it("updates the separate default shipping address with the stored fields kept", async () => {
    const separate = shippingAddress({
      company: "ACME",
      countryStateId: "state-hh",
    });
    const { client, invocations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer({ defaultShippingAddress: separate }),
      address,
      shippingAddress: { ...shipping, street: "Dock Lane 1" },
    });

    expect(invocations.map(({ operation }) => operation)).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "updateCustomerAddress patch /account/address/{addressId}",
      "changeProfile post /account/change-profile",
    ]);
    expect(invocations[1]?.params).toEqual({
      pathParams: { addressId: "address-2" },
      body: {
        salutationId: "salutation-1",
        title: undefined,
        firstName: "Max",
        lastName: "Mustermann",
        company: "ACME",
        department: undefined,
        street: "Dock Lane 1",
        additionalAddressLine1: undefined,
        additionalAddressLine2: undefined,
        zipcode: "10115",
        city: "Berlin",
        countryId: "country-de",
        phoneNumber: undefined,
      },
    });
  });

  it("points the default shipping address back at the billing address when no separate one is wanted", async () => {
    const { client, invocations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer({ defaultShippingAddress: shippingAddress() }),
      address,
      shippingAddress: null,
    });

    expect(invocations.map(({ operation }) => operation)).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
      "changeProfile post /account/change-profile",
    ]);
    expect(invocations[1]?.params).toEqual({
      pathParams: { addressId: "address-1" },
    });
  });

  it("leaves the shipping address alone when it is the billing address and no other is wanted", async () => {
    const { client, operations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer({ defaultShippingAddress: billingAddress() }),
      address,
    });

    expect(operations()).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "changeProfile post /account/change-profile",
    ]);
  });

  it("stops before the profile change when the shipping address cannot be saved", async () => {
    const failure = new Error("shipping address rejected");
    const { client, operations } = fakeClient((operation) => {
      if (operation.startsWith("createCustomerAddress")) throw failure;
      return {};
    });

    await expect(
      updateCustomerDetails(client, {
        customer: checkoutCustomer(),
        address,
        shippingAddress: shipping,
      }),
    ).rejects.toBe(failure);
    expect(operations()).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "createCustomerAddress post /account/address",
    ]);
  });

  it("hands over the shipping address it created before a later step fails", async () => {
    const created = shippingAddress({ id: "address-new" });
    const failure = new Error("default shipping address rejected");
    const onShippingAddressCreated = vi.fn();
    const { client } = fakeClient((operation) => {
      if (operation.startsWith("createCustomerAddress")) return created;
      if (operation.startsWith("defaultShippingAddress")) throw failure;
      return {};
    });

    await expect(
      updateCustomerDetails(client, {
        customer: checkoutCustomer(),
        address,
        shippingAddress: shipping,
        onShippingAddressCreated,
      }),
    ).rejects.toBe(failure);
    expect(onShippingAddressCreated).toHaveBeenCalledExactlyOnceWith(created);
  });

  it("updates the shipping address an earlier attempt created and makes it the default instead of creating another", async () => {
    const created = shippingAddress({ id: "address-new" });
    const onShippingAddressCreated = vi.fn();
    const { client, invocations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer(),
      address,
      shippingAddress: { ...shipping, street: "Pier 4" },
      createdShippingAddress: created,
      onShippingAddressCreated,
    });

    expect(invocations.map(({ operation }) => operation)).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "updateCustomerAddress patch /account/address/{addressId}",
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
      "changeProfile post /account/change-profile",
    ]);
    expect(invocations[1]?.params).toMatchObject({
      pathParams: { addressId: "address-new" },
      body: { street: "Pier 4", firstName: "Max" },
    });
    expect(invocations[2]?.params).toEqual({
      pathParams: { addressId: "address-new" },
    });
    expect(onShippingAddressCreated).not.toHaveBeenCalled();
  });

  it("skips the default switch when the created address already is the default shipping address", async () => {
    const created = shippingAddress({ id: "address-new" });
    const { client, operations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer({ defaultShippingAddress: created }),
      address,
      shippingAddress: shipping,
      createdShippingAddress: created,
    });

    expect(operations()).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "updateCustomerAddress patch /account/address/{addressId}",
      "changeProfile post /account/change-profile",
    ]);
  });

  it("points the default shipping address back at the billing address when an earlier attempt created one and none is wanted now", async () => {
    const { client, invocations } = fakeClient();

    await updateCustomerDetails(client, {
      customer: checkoutCustomer(),
      address,
      shippingAddress: null,
      createdShippingAddress: shippingAddress({ id: "address-new" }),
    });

    expect(invocations.map(({ operation }) => operation)).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
      "changeProfile post /account/change-profile",
    ]);
    expect(invocations[1]?.params).toEqual({
      pathParams: { addressId: "address-1" },
    });
  });

  it("stops before the profile change when the address patch fails", async () => {
    const failure = new Error("address rejected");
    const { client, operations } = fakeClient((operation) => {
      if (operation.startsWith("updateCustomerAddress")) throw failure;
      return {};
    });

    await expect(
      updateCustomerDetails(client, {
        customer: checkoutCustomer(),
        address,
      }),
    ).rejects.toBe(failure);
    expect(operations()).toEqual([
      "updateCustomerAddress patch /account/address/{addressId}",
    ]);
  });
});

describe("readOrder", () => {
  it("reads one order with the default associations plus the address countries", async () => {
    const found = order();
    const { client, invocations } = fakeClient(() => ({
      orders: { elements: [found] },
    }));

    await expect(readOrder(client, "order-1")).resolves.toBe(found);
    expect(invocations).toEqual([
      {
        operation: "readOrder post /order",
        params: {
          body: {
            ids: ["order-1"],
            checkPromotion: true,
            associations: {
              stateMachineState: {},
              currency: {},
              lineItems: {
                associations: {
                  cover: {},
                  downloads: { associations: { media: {} } },
                },
              },
              addresses: { associations: { country: {} } },
              deliveries: {
                associations: {
                  shippingMethod: {},
                  shippingOrderAddress: { associations: { country: {} } },
                  stateMachineState: {},
                },
              },
              transactions: {
                associations: { paymentMethod: {}, stateMachineState: {} },
              },
            },
          },
        },
      },
    ]);
  });

  it("resolves null when no order matches", async () => {
    const { client } = fakeClient(() => ({ orders: { elements: [] } }));

    await expect(readOrder(client, "missing")).resolves.toBeNull();
  });
});

describe("handlePayment", () => {
  it("posts the order id with the finish and error URLs and resolves the redirect URL", async () => {
    const { client, invocations } = fakeClient(() => ({
      redirectUrl: "https://psp.test/pay",
    }));

    await expect(
      handlePayment(client, {
        orderId: "order-1",
        finishUrl: "https://shop.test/checkout/success/order-1/paid",
        errorUrl: "https://shop.test/checkout/success/order-1/unpaid",
      }),
    ).resolves.toEqual({ redirectUrl: "https://psp.test/pay" });
    expect(invocations).toEqual([
      {
        operation: "handlePaymentMethod post /handle-payment",
        params: {
          body: {
            orderId: "order-1",
            finishUrl: "https://shop.test/checkout/success/order-1/paid",
            errorUrl: "https://shop.test/checkout/success/order-1/unpaid",
          },
        },
      },
    ]);
  });

  it("resolves a null redirect URL for a synchronous payment", async () => {
    const { client } = fakeClient(() => ({ redirectUrl: null }));

    await expect(
      handlePayment(client, {
        orderId: "order-1",
        finishUrl: "https://shop.test/paid",
        errorUrl: "https://shop.test/unpaid",
      }),
    ).resolves.toEqual({ redirectUrl: null });
  });
});
