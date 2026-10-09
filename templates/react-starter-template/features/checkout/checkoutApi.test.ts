import { gunzipSync } from "node:zlib";

import { ApiClientError } from "@shopware/api-client";
import { describe, expect, it } from "vitest";

import { ORDER_TIMEOUT_MS } from "@/features/session/readTimeout";

import {
  billingAddress,
  checkoutCustomer,
  fakeClient,
  order,
  paymentMethods,
  shippingMethod,
} from "./checkout.fixture";
import {
  createOrder,
  getPaymentMethods,
  getShippingMethods,
  handlePayment,
  isAmbiguousOrderFailure,
  readOrder,
  setPaymentMethod,
  setShippingMethod,
  sortByPosition,
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
