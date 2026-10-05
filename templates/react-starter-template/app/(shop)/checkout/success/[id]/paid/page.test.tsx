import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import CheckoutPaidPage, { metadata } from "./page";

const BROKEN_CLASSES =
  /text-white|bg-primary\b|dark:|secondary-\d|green-\d|red-\d/;

describe("CheckoutPaidPage", () => {
  it("names the page after the payment result", () => {
    expect(metadata.title).toBe("Your order has been paid");
  });

  it("confirms the payment and links back to the homepage", async () => {
    const html = await renderToHtml(<CheckoutPaidPage />);

    expect(html).toContain('data-testid="checkout-payment-paid"');
    expect(html).toMatch(
      /<h1[^>]*>Your order<!-- --> <span[^>]*>has been paid<\/span><\/h1>/,
    );
    expect(html).toContain("decoration-states-success");
    expect(html).toContain(
      "You can now check the status of the order in your account. Thank you!",
    );
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Back to homepage<svg/);
    expect(html).not.toMatch(BROKEN_CLASSES);
  });
});
