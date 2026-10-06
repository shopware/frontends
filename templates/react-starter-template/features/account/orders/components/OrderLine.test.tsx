import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { ORDER_ID, accountOrder } from "../orders.fixture";
import { OrderLine, orderDetailsHref } from "./OrderLine";

describe("OrderLine", () => {
  it("links the order number to the details page and shows the status, the methods and the totals", async () => {
    const html = await renderToHtml(<OrderLine order={accountOrder()} />);

    expect(html).toContain(`href="/account/order/details/${ORDER_ID}"`);
    expect(html).toContain("Order<!-- -->: <!-- -->10042");
    expect(html).toContain('data-testid="order-status"');
    expect(html).toContain("Order number<!-- -->:</dt>");
    expect(html).toContain("Shipping Status<!-- -->:</dt>");
    expect(html).toContain("Payment method<!-- -->:</dt>");
    expect(html).toContain('<dd class="p-4 leading-6">Invoice</dd>');
    expect(html).toContain('<dd class="p-4 leading-6">Standard</dd>');
    expect(html).toContain("€59.98");
    expect(html).toContain("€4.99");
    expect(html).toContain("€64.97");
    expect(html).toContain('dateTime="2026-10-05T10:30:00.000+00:00"');
  });

  it("is labelled by its heading and keeps the products collapsed behind a disclosure", async () => {
    const html = await renderToHtml(<OrderLine order={accountOrder()} />);

    const labelledBy = html.match(
      /<article[^>]*aria-labelledby="([^"]+)"/,
    )?.[1];
    expect(labelledBy).toBeTruthy();
    expect(html).toContain(`<h2 id="${labelledBy}"`);
    const controls = html.match(/aria-controls="([^"]+)"/)?.[1];
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain(`id="${controls}"`);
    expect(html).toContain("See more");
    expect(html).not.toContain('data-testid="order-line-item"');
  });

  it("uses the delivery state as the shipping status and falls back to Unknown", async () => {
    const shipped = await renderToHtml(
      <OrderLine
        order={accountOrder({
          deliveries: [
            {
              stateMachineState: {
                technicalName: "shipped",
                name: "Shipped",
                translated: { name: "Shipped" },
              },
            },
          ] as never,
        })}
      />,
    );
    expect(shipped).toContain('<dd class="p-4 leading-6">Shipped</dd>');

    const unknown = await renderToHtml(
      <OrderLine
        order={accountOrder({
          deliveries: [],
          stateMachineState: undefined as never,
        })}
      />,
    );
    expect(unknown).toContain('<dd class="p-4 leading-6">Unknown</dd>');
  });

  it("hides the disclosure for an order without products", async () => {
    const html = await renderToHtml(
      <OrderLine order={accountOrder({ lineItems: [] })} />,
    );

    expect(html).not.toContain("See more");
  });

  it("encodes the order id in the details link", () => {
    expect(orderDetailsHref("a/b")).toBe("/account/order/details/a%2Fb");
  });
});

describe("OrderLine in Polish", () => {
  it("renders the Polish labels, a prefixed details link and Polish dates and prices", async () => {
    const html = await renderToHtml(
      withI18n(<OrderLine order={accountOrder()} />, "pl-PL"),
    );

    expect(html).toContain(`href="/pl-PL/account/order/details/${ORDER_ID}"`);
    expect(html).toContain("Zamówienie<!-- -->: <!-- -->10042");
    expect(html).toContain("Numer zamówienia<!-- -->:</dt>");
    expect(html).toContain("Data zamówienia<!-- -->:");
    expect(html).toContain("5.10.2026");
    expect(html).toContain("59,98");
    expect(html).toContain("Zobacz więcej");
  });
});
