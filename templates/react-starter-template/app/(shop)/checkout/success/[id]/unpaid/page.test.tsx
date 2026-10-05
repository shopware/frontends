import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import CheckoutUnpaidPage, { metadata } from "./page";

const BROKEN_CLASSES =
  /text-white|bg-primary\b|dark:|secondary-\d|green-\d|red-\d/;

describe("CheckoutUnpaidPage", () => {
  it("names the page after the payment result", () => {
    expect(metadata.title).toBe("Your order is not paid");
  });

  it("tells the customer the order is not paid and links to its details", async () => {
    const html = await renderToHtml(
      <CheckoutUnpaidPage params={Promise.resolve({ id: "order-1" })} />,
    );

    expect(html).toContain('data-testid="checkout-payment-unpaid"');
    expect(html).toMatch(
      /<h1[^>]*>Your order<!-- --> <span[^>]*>is not paid<\/span><\/h1>/,
    );
    expect(html).toContain("decoration-states-error");
    expect(html).toContain(
      "Unfortunately, your order couldn&#x27;t be paid. You can try to pay it again or contact us.",
    );
    expect(html).toMatch(
      /<a [^>]*href="\/checkout\/success\/order-1"[^>]*>Check the order details<svg/,
    );
    expect(html).not.toMatch(BROKEN_CLASSES);
  });

  it("encodes the order id in the link", async () => {
    const html = await renderToHtml(
      <CheckoutUnpaidPage params={Promise.resolve({ id: "a/b" })} />,
    );

    expect(html).toContain('href="/checkout/success/a%2Fb"');
  });
});
