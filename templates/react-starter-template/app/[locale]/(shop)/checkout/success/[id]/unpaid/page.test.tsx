import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import CheckoutUnpaidPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

const BROKEN_CLASSES =
  /text-white|bg-primary\b|dark:|secondary-\d|green-\d|red-\d/;

function params(id: string, locale = "en-GB") {
  return Promise.resolve({ locale, id });
}

describe("CheckoutUnpaidPage", () => {
  it("names the page after the payment result", async () => {
    expect((await generateMetadata({ params: params("order-1") })).title).toBe(
      "Your order is not paid",
    );
    expect(
      (await generateMetadata({ params: params("order-1", "pl-PL") })).title,
    ).toBe("Twoje zamówienie nie zostało opłacone");
  });

  it("tells the customer the order is not paid and links to its details", async () => {
    const html = await renderToHtml(
      <CheckoutUnpaidPage params={params("order-1")} />,
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
      <CheckoutUnpaidPage params={params("a/b")} />,
    );

    expect(html).toContain('href="/checkout/success/a%2Fb"');
  });

  it("speaks German and keeps the order link under the German prefix", async () => {
    const html = await renderToHtml(
      withI18n(
        <CheckoutUnpaidPage params={params("order-1", "de-DE")} />,
        "de-DE",
      ),
    );

    expect(html).toMatch(
      /<h1[^>]*>Ihre Bestellung<!-- --> <span[^>]*>ist nicht bezahlt<\/span><\/h1>/,
    );
    expect(html).toMatch(
      /<a [^>]*href="\/de-DE\/checkout\/success\/order-1"[^>]*>Bestelldetails überprüfen<svg/,
    );
  });
});
