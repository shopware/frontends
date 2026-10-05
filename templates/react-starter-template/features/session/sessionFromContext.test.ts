import { describe, expect, it } from "vitest";

import { customer, salesChannelContext } from "./session.fixture";
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
  it("names a logged-in customer and keeps the context", () => {
    const context = salesChannelContext(customer());

    expect(toStorefrontSession(context)).toEqual({
      status: "ready",
      isLoggedIn: true,
      isGuestSession: false,
      customerName: "Jane Doe",
      wishlistCount: 0,
      context,
    });
  });

  it("uses whichever name parts exist", () => {
    expect(
      toStorefrontSession(salesChannelContext(customer({ firstName: "" })))
        .customerName,
    ).toBe("Doe");
    expect(
      toStorefrontSession(
        salesChannelContext(customer({ firstName: "", lastName: "" })),
      ).customerName,
    ).toBeNull();
  });

  it("marks a guest session without logging it in", () => {
    const context = salesChannelContext(customer({ guest: true }));

    expect(toStorefrontSession(context)).toEqual({
      status: "ready",
      isLoggedIn: false,
      isGuestSession: true,
      customerName: null,
      wishlistCount: 0,
      context,
    });
  });

  it.each([
    ["no customer", null],
    ["an inactive customer", customer({ active: false })],
  ])("returns a ready, logged-out session for %s", (_, value) => {
    const context = salesChannelContext(value);

    expect(toStorefrontSession(context)).toEqual({
      status: "ready",
      isLoggedIn: false,
      isGuestSession: false,
      customerName: null,
      wishlistCount: 0,
      context,
    });
  });

  it("treats a context with an undefined customer as anonymous", () => {
    const context = { ...salesChannelContext(null), customer: undefined };

    expect(toStorefrontSession(context)).toMatchObject({
      isLoggedIn: false,
      isGuestSession: false,
      customerName: null,
    });
  });
});

describe("unavailableSession", () => {
  it("is logged out with the error status and no context", () => {
    expect(unavailableSession).toEqual({
      status: "error",
      isLoggedIn: false,
      isGuestSession: false,
      customerName: null,
      wishlistCount: 0,
      context: null,
    });
  });
});
