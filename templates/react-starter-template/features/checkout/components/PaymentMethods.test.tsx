import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { renderToHtml } from "@/test/render";

import { paymentMethod, paymentMethods } from "../checkout.fixture";
import { PaymentMethods } from "./PaymentMethods";

function radio(html: string, value: string): string {
  const match = html.match(new RegExp(`<input[^>]*value="${value}"[^>]*/>`));
  expect(match, value).not.toBeNull();
  return match?.[0] ?? "";
}

describe("PaymentMethods", () => {
  it("renders labelled native radios with the description of each method", async () => {
    const html = await renderToHtml(
      <PaymentMethods
        legend="Payment information"
        paymentMethods={paymentMethods}
        selectedPaymentMethod="payment-invoice"
        onChange={() => {}}
      />,
    );

    expect(html).toContain(
      '<legend class="sr-only">Payment information</legend>',
    );
    expect(html.match(/name="payment-method"/g)).toHaveLength(2);
    expect(html).toContain('<label for="payment-method-payment-cash"');
    expect(radio(html, "payment-invoice")).toContain('checked=""');
    expect(radio(html, "payment-cash")).not.toContain("checked");
    expect(radio(html, "payment-cash")).toContain('type="radio"');
    expect(html).toContain(">Pay within 14 days</span>");
    expect(html).toContain(">Cash on delivery</span>");
  });

  it("shows the payment method icon", async () => {
    const html = await renderToHtml(
      <PaymentMethods
        legend="Payment information"
        paymentMethods={[
          paymentMethod({
            media: { url: "https://cdn.test/paypal.svg" },
          } as Partial<Schemas["PaymentMethod"]>),
        ]}
        selectedPaymentMethod={null}
        onChange={() => {}}
      />,
    );

    expect(html).toMatch(
      /<img src="https:\/\/cdn.test\/paypal.svg" alt="Invoice"/,
    );
  });
});
