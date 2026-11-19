import { describe, expect, it } from "vitest";

import { customer } from "./session.fixture";
import {
  isLoggedInCustomer,
  toStorefrontSession,
  unavailableSession,
} from "./sessionFromContext";

describe("isLoggedInCustomer", () => {
  it("accepts an active customer that is not a guest", () => {
    expect(isLoggedInCustomer(customer())).toBe(true);
  });

  it.each([
    ["no customer", null],
    ["a customer without id", customer({ id: "" })],
    ["an inactive customer", customer({ active: false })],
    ["a guest", customer({ guest: true })],
  ])("rejects %s", (_, value) => {
    expect(isLoggedInCustomer(value)).toBe(false);
  });
});

describe("toStorefrontSession", () => {
  it("names a logged-in customer", () => {
    expect(toStorefrontSession({ customer: customer() })).toEqual({
      status: "ready",
      isLoggedIn: true,
      customerName: "Jane Doe",
      cartCount: 0,
      wishlistCount: 0,
    });
  });

  it("uses whichever name parts exist", () => {
    expect(
      toStorefrontSession({ customer: customer({ firstName: "" }) })
        .customerName,
    ).toBe("Doe");
    expect(
      toStorefrontSession({
        customer: customer({ firstName: "", lastName: "" }),
      }).customerName,
    ).toBeNull();
  });

  it.each([
    ["no customer", undefined],
    ["a guest", customer({ guest: true })],
    ["an inactive customer", customer({ active: false })],
  ])("returns a ready, logged-out session for %s", (_, value) => {
    expect(toStorefrontSession({ customer: value })).toEqual({
      status: "ready",
      isLoggedIn: false,
      customerName: null,
      cartCount: 0,
      wishlistCount: 0,
    });
  });
});

describe("unavailableSession", () => {
  it("is logged out with the error status", () => {
    expect(unavailableSession).toEqual({
      status: "error",
      isLoggedIn: false,
      customerName: null,
      cartCount: 0,
      wishlistCount: 0,
    });
  });
});
