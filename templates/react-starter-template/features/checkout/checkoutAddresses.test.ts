import { describe, expect, it } from "vitest";

import { billingAddress, shippingAddress } from "./checkout.fixture";
import { activeCheckoutAddresses, addressSummary } from "./checkoutAddresses";

const billing = billingAddress();
const separate = shippingAddress();
const other = billingAddress({ id: "address-3", street: "Other Road 3" });

describe("activeCheckoutAddresses", () => {
  it("uses the billing address for shipping when the customer has only that", () => {
    expect(activeCheckoutAddresses({ defaultBillingAddress: billing })).toEqual(
      { shipping: billing, billing, sameAddress: true },
    );
  });

  it("shows the default shipping address when it differs", () => {
    expect(
      activeCheckoutAddresses({
        defaultBillingAddress: billing,
        defaultShippingAddress: separate,
      }),
    ).toEqual({ shipping: separate, billing, sameAddress: false });
  });

  it("prefers the active addresses of the context, which the order uses", () => {
    expect(
      activeCheckoutAddresses({
        defaultBillingAddress: billing,
        defaultShippingAddress: billing,
        activeBillingAddress: other,
        activeShippingAddress: separate,
      }),
    ).toEqual({ shipping: separate, billing: other, sameAddress: false });
  });

  it("has no address without any", () => {
    expect(activeCheckoutAddresses({})).toEqual({
      shipping: null,
      billing: null,
      sameAddress: false,
    });
  });
});

describe("addressSummary", () => {
  it("joins the name, street, town and country into one line", () => {
    expect(addressSummary(separate)).toBe(
      "John Smith, Harbour Road 7, 20095 Hamburg, Germany",
    );
  });

  it("leaves out the parts an address does not have", () => {
    expect(
      addressSummary(
        billingAddress({ zipcode: undefined, country: undefined }),
      ),
    ).toBe("Jane Doe, Main Street 1, Berlin");
  });
});
