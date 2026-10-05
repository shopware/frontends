import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { order } from "../checkout.fixture";
import { OrderConfirmation, formatOrderDate } from "./OrderConfirmation";

function render(paymentUrl: string | null = null) {
  return renderToHtml(
    <OrderConfirmation
      order={order()}
      paymentUrl={paymentUrl}
      onGoToPayment={() => {}}
    />,
  );
}

describe("OrderConfirmation", () => {
  it("renders the confirmation header with the order number, status and date", async () => {
    const html = await render();

    expect(html).toMatch(
      /^<div class="[^"]*" data-testid="checkout-success-page">/,
    );
    expect(html).toMatch(
      /<h1 class="[^"]*font-serif text-\[40px\][^"]*">Thank you for your order<\/h1>/,
    );
    expect(html).toContain(
      "We have received your order #10042 and will process it as soon as possible.",
    );
    expect(html).toContain('data-testid="order-number">10042</span>');
    expect(html).toMatch(
      /<span class="[^"]*bg-states-warning-container[^"]*" data-testid="order-status">Open<\/span>/,
    );
    expect(html).toContain(
      `<time dateTime="2026-10-05T10:30:00.000+00:00" class="text-sm text-surface-on-surface-variant">${formatOrderDate("2026-10-05T10:30:00.000+00:00")}</time>`,
    );
    expect(html).not.toContain('role="alert"');
  });

  it("lists the ordered items with quantity, total and unit price", async () => {
    const html = await render();

    expect(html).toContain('<h2 id="order-items-heading"');
    expect(html).toMatch(/<li class="[^"]*" data-testid="order-line-item">/);
    expect(html).toContain(
      '<img src="https://cdn.test/bag.jpg" alt="Aerodynamic Bag"',
    );
    expect(html).toContain("Quantity<!-- --> <!-- -->2");
    expect(html).toContain('data-testid="order-item-totalprice">€59.98</span>');
    expect(html).toContain('data-testid="order-item-unitprice">€29.99</span>');
  });

  it("shows both addresses and the payment and shipping methods", async () => {
    const html = await render();

    expect(html).toMatch(/<h3[^>]*>Shipping address<\/h3><address/);
    expect(html).toMatch(
      /<h3[^>]*>Billing address<\/h3><address[^>]*>.*Billing Road 2/,
    );
    expect(html).toContain("Germany");
    expect(html).toMatch(
      /<h3[^>]*>Payment method<\/h3><div[^>]*><div[^>]*>Invoice<\/div>/,
    );
    expect(html).toMatch(
      /<h3[^>]*>Shipping method<\/h3><div[^>]*><div[^>]*>Standard<\/div>/,
    );
    expect(html).toContain(">Takes up to 1-3 days</div>");
  });

  it("renders the summary with the e2e test ids and a way back to the shop", async () => {
    const html = await render();

    expect(html).toContain('data-testid="order-subtotal">€59.98</span>');
    expect(html).toContain('data-testid="order-shipping">€4.99</span>');
    expect(html).toContain('data-testid="order-total">€64.97</span>');
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Continue shopping<\/a>/);
  });

  it("asks the customer to finish the payment when there is a payment URL", async () => {
    const html = await render("https://psp.test/pay/1");

    expect(html).toMatch(
      /<div class="[^"]*bg-states-info-container[^"]*" role="alert"><div class="font-medium">Finish payment process.<\/div>/,
    );
    expect(html).toContain(
      "You will be redirected to the payment gateway in 5 seconds.",
    );
    expect(html).toContain(">Go to payment</span></button>");
  });
});

describe("formatOrderDate", () => {
  it("formats in en-GB with the time and ignores invalid dates", () => {
    expect(formatOrderDate("2026-10-05T10:30:00.000Z")).toMatch(
      /^05\/10\/2026, \d{2}:\d{2}$/,
    );
    expect(formatOrderDate("not a date")).toBe("");
  });
});
