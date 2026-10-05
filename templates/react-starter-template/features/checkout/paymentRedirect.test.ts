import { describe, expect, it } from "vitest";

import { parsePaymentUrl, paymentReturnUrls } from "./paymentRedirect";

describe("parsePaymentUrl", () => {
  it("accepts http and https URLs as they are", () => {
    expect(parsePaymentUrl("https://psp.test/pay?token=1")).toBe(
      "https://psp.test/pay?token=1",
    );
    expect(
      parsePaymentUrl("http://localhost:3000/checkout/success/1/paid"),
    ).toBe("http://localhost:3000/checkout/success/1/paid");
  });

  it("rejects missing, relative and non-http values", () => {
    expect(parsePaymentUrl(null)).toBeNull();
    expect(parsePaymentUrl(undefined)).toBeNull();
    expect(parsePaymentUrl("")).toBeNull();
    expect(parsePaymentUrl("/checkout/success/1/paid")).toBeNull();
    expect(parsePaymentUrl("javascript:alert(1)")).toBeNull();
    expect(parsePaymentUrl("data:text/html,hi")).toBeNull();
    expect(parsePaymentUrl(42)).toBeNull();
  });
});

describe("paymentReturnUrls", () => {
  it("points the finish and error URLs at the paid and unpaid pages of the order", () => {
    expect(paymentReturnUrls("https://shop.test", "order-1")).toEqual({
      finishUrl: "https://shop.test/checkout/success/order-1/paid",
      errorUrl: "https://shop.test/checkout/success/order-1/unpaid",
    });
  });

  it("encodes the order id", () => {
    expect(paymentReturnUrls("https://shop.test", "a/b").finishUrl).toBe(
      "https://shop.test/checkout/success/a%2Fb/paid",
    );
  });
});
