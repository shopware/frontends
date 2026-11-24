import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import CheckoutPaidPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

const BROKEN_CLASSES =
  /text-white|bg-primary\b|dark:|secondary-\d|green-\d|red-\d/;

function params(locale: string) {
  return Promise.resolve({ locale, id: "order-1" });
}

describe("CheckoutPaidPage", () => {
  it("names the page after the payment result", async () => {
    expect((await generateMetadata({ params: params("en-GB") })).title).toBe(
      "Your order has been paid",
    );
    expect((await generateMetadata({ params: params("de-DE") })).title).toBe(
      "Ihre Bestellung wurde bezahlt",
    );
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

  it("speaks Polish and links to the Polish homepage", async () => {
    const html = await renderToHtml(withI18n(<CheckoutPaidPage />, "pl-PL"));

    expect(html).toMatch(
      /<h1[^>]*>Twoje zamówienie<!-- --> <span[^>]*>zostało opłacone<\/span><\/h1>/,
    );
    expect(html).toMatch(
      /<a [^>]*href="\/pl-PL"[^>]*>Wróć do strony głównej<svg/,
    );
  });
});
