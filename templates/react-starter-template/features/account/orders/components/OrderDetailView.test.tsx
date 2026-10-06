import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import {
  ORDER_ID,
  digitalLineItem,
  orderDetails,
  orderDocument,
} from "../orders.fixture";
import { OrderDetailView } from "./OrderDetailView";

async function render(details = orderDetails()) {
  return renderToHtml(
    <OrderDetailView details={details} onReload={async () => {}} />,
  );
}

describe("OrderDetailView", () => {
  it("renders the items table, the addresses, the methods and one order total", async () => {
    const html = await render();

    expect(html).toContain('data-testid="account-order-details"');
    for (const header of ["Item", "Quantity", "Price", "Total"]) {
      expect(html).toContain(`scope="col"`);
      expect(html).toContain(`>${header}</th>`);
    }
    expect(html).toContain('data-testid="order-item-unitprice"');
    expect(html).toContain('data-testid="order-item-totalprice"');
    expect(html).toContain("Shipping address</h3>");
    expect(html).toContain("Billing address</h3>");
    expect(html).toContain("Billing Road 2");
    expect(html).toContain("Order Summary</h3>");
    expect(html).toContain('data-testid="order-subtotal">€59.98</span>');
    expect(html).toContain('data-testid="order-shipping">€4.99</span>');
    expect(html.match(/data-testid="order-total"/g)).toHaveLength(1);
    expect(html).toContain('data-testid="order-total">€64.97</span>');
    expect(html).toContain("Shipping method</h3>");
    expect(html).toContain("Takes up to 1-3 days");
    expect(html).toContain("Payment method</h3>");
    expect(html).toContain("Invoice");
    expect(html).toContain("Placed on ");
    expect(html).toContain('data-testid="order-status"');
  });

  it("offers the payment change only when the backend allows it for an open order", async () => {
    expect(await render(orderDetails({}, false))).not.toContain(
      'data-testid="order-change-payment-button"',
    );

    const changeable = await render(orderDetails({}, true));
    expect(changeable).toContain('data-testid="order-change-payment-button"');
    expect(changeable).toContain('aria-haspopup="dialog"');
    expect(changeable).toContain('aria-label="Change payment method"');
    expect(changeable).not.toContain("<dialog");
  });

  it("offers Repeat order only when the order has products", async () => {
    expect(await render()).toContain('data-testid="order-repeat-button"');
    expect(
      await render(
        orderDetails({
          lineItems: [
            {
              id: "promo",
              identifier: "promo",
              label: "10% off",
              quantity: 1,
              type: "promotion",
            },
          ] as never,
        }),
      ),
    ).not.toContain('data-testid="order-repeat-button"');
  });

  it("lists the accessible downloads of digital items and the order documents", async () => {
    const html = await render(
      orderDetails({
        lineItems: [digitalLineItem()],
        documents: [orderDocument()],
      }),
    );

    expect(html.match(/data-testid="order-item-download"/g)).toHaveLength(1);
    expect(html).toContain("ebook.pdf");
    expect(html).not.toContain("locked.zip");
    expect(html).toContain("Documents</h3>");
    expect(html).toContain('data-testid="order-document-download"');
    expect(html).toContain("Invoice 10042");
    expect(html).toContain("(<!-- -->05/10/2026<!-- -->)");
  });

  it("does not render a documents section without documents", async () => {
    const html = await render(orderDetails({ id: ORDER_ID, documents: [] }));

    expect(html).not.toContain("Documents</h3>");
  });
});
