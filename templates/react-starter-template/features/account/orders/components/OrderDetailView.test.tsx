import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { checkoutSession } from "@/features/checkout/checkout.fixture";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import {
  ORDER_ID,
  digitalLineItem,
  orderDetails,
  orderDocument,
} from "../orders.fixture";
import { OrderDetailView } from "./OrderDetailView";

async function render(details = orderDetails(), orderRefundsEnabled?: boolean) {
  return renderToHtml(
    <OrderDetailView
      details={details}
      onReload={async () => {}}
      orderRefundsEnabled={orderRefundsEnabled}
    />,
  );
}

function inState(technicalName: string) {
  return orderDetails({
    stateMachineState: {
      technicalName,
      name: technicalName,
      translated: { name: technicalName },
    },
  } as never);
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

  it("formats the items and the summary in the currency of the order, not the one of the session", async () => {
    const html = await renderToHtml(
      <SessionProvider session={checkoutSession()}>
        <OrderDetailView
          details={orderDetails({
            currency: { isoCode: "USD" } as Schemas["Currency"],
          })}
          onReload={async () => {}}
        />
      </SessionProvider>,
    );

    expect(html).toContain(
      'data-testid="order-item-unitprice">US$29.99</span>',
    );
    expect(html).toContain(
      'data-testid="order-item-totalprice">US$59.98</span>',
    );
    expect(html).toContain('data-testid="order-subtotal">US$59.98</span>');
    expect(html).toContain('data-testid="order-shipping">US$4.99</span>');
    expect(html).toContain('data-testid="order-total">US$64.97</span>');
    expect(html).not.toContain("€");
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

  it("offers cancellation only for an open order when the shop allows refunds", async () => {
    expect(await render(inState("open"))).not.toContain(
      'data-testid="order-cancel-button"',
    );
    expect(await render(inState("open"), false)).not.toContain(
      'data-testid="order-cancel-button"',
    );
    for (const state of ["in_progress", "cancelled", "completed"]) {
      expect(await render(inState(state), true)).not.toContain(
        'data-testid="order-cancel-button"',
      );
    }

    const html = await render(inState("open"), true);
    expect(html).toMatch(
      /<button[^>]*aria-haspopup="dialog"[^>]*data-testid="order-cancel-button"[^>]*><span>Cancel order<\/span><\/button>/,
    );
    expect(html).not.toContain("<dialog");
  });

  it("keeps the status focusable for the focus move after a cancellation", async () => {
    const html = await render(inState("open"), true);

    expect(html).toMatch(
      /<div tabindex="-1" class="mt-4 focus:outline-hidden sm:mt-0"><span[^>]*data-testid="order-status"/i,
    );
  });

  it("shows the customer comment with its line breaks, like the Storefront", async () => {
    const html = await render(
      orderDetails({ customerComment: "Ring twice\n<b>not bold</b>" }),
    );

    expect(html).toContain('data-testid="order-customer-comment"');
    expect(html).toContain("Your comment</h3>");
    expect(html).toMatch(
      /<p class="[^"]*whitespace-pre-line[^"]*">Ring twice\n&lt;b&gt;not bold&lt;\/b&gt;<\/p>/,
    );
    expect(html).not.toMatch(/data-testid="order-customer-comment"[^>]*lang=/);
    expect(await render()).not.toContain("order-customer-comment");
    expect(
      await render(orderDetails({ customerComment: " \n " })),
    ).not.toContain("order-customer-comment");
  });

  it("names the comment and the cancellation in Polish", async () => {
    const html = await renderToHtml(
      withI18n(
        <OrderDetailView
          details={orderDetails({ customerComment: "Proszę dzwonić" })}
          onReload={async () => {}}
          orderRefundsEnabled
        />,
        "pl-PL",
      ),
    );

    expect(html).toContain("Twój komentarz</h3>");
    expect(html).toContain("<span>Anuluj zamówienie</span>");
  });
});
