import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { cartLineItem, cartResult, fakeCart } from "../checkoutTestDoubles";
import { SummaryBox } from "./SummaryBox";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("../checkoutTestDoubles")).useFakeCart,
}));

describe("SummaryBox", () => {
  it("lists the line items with the subtotal, the shipping costs and the total", async () => {
    fakeCart.set(
      cartResult({
        lineItems: [
          cartLineItem(),
          cartLineItem({ id: "line-2", referencedId: "product-2" }),
        ],
      }),
    );

    const html = await renderToHtml(<SummaryBox />);

    expect(html).toMatch(
      /^<section class="sticky top-2 border border-outline-outline" aria-labelledby="checkout-summary-heading">/,
    );
    expect(html).toMatch(
      /<h2 id="checkout-summary-heading" class="[^"]*font-serif text-\[40px\][^"]*">Summary<\/h2>/,
    );
    expect(
      html.match(/<li><div[^>]*data-testid="checkout-product-tile-item"/g),
    ).toHaveLength(2);
    expect(html).toContain('data-product-id="product-2"');
    expect(html).toMatch(
      /<dt[^>]*>Subtotal<\/dt><dd><span[^>]*data-testid="cart-subtotal">€59.98<\/span>/,
    );
    expect(html).toMatch(/<dt[^>]*>Shipping<\/dt><dd><span[^>]*>€4.99<\/span>/);
    expect(html).toMatch(
      /<dt[^>]*>Total<\/dt><dd><span[^>]*data-testid="cart-total">€64.97<\/span>/,
    );
  });

  it("renders one shipping row per delivery", async () => {
    fakeCart.set(
      cartResult({
        shippingCosts: [
          { shippingMethod: { id: "a" }, shippingCosts: { totalPrice: 1 } },
          { shippingMethod: { id: "b" }, shippingCosts: { totalPrice: 2 } },
        ] as Schemas["CartDelivery"][],
      }),
    );

    const html = await renderToHtml(<SummaryBox />);

    expect(html.match(/>Shipping<\/dt>/g)).toHaveLength(2);
  });

  it("lists the included taxes after the total without naming the shipping method", async () => {
    fakeCart.set(
      cartResult({
        cart: {
          apiAlias: "cart",
          lineItems: [cartLineItem()],
          deliveries: [],
          price: {
            taxStatus: "gross",
            calculatedTaxes: [{ tax: 10.36, taxRate: 19, price: 64.97 }],
          },
        } as unknown as Schemas["Cart"],
        shippingCosts: [
          {
            shippingMethod: { id: "standard", name: "Standard" },
            shippingCosts: { totalPrice: 4.99 },
            location: { country: { name: "Germany" } },
          },
        ] as Schemas["CartDelivery"][],
      }),
    );

    const html = await renderToHtml(<SummaryBox />);

    expect(html).toMatch(
      /data-testid="cart-total">€64.97<\/span><\/dd><\/dl><dl[^>]*><div[^>]*><dt[^>]*>incl. 19% VAT<\/dt><dd><span[^>]*data-testid="cart-tax">€10.36<\/span>/,
    );
    expect(html).not.toContain("Standard");
    expect(html).not.toContain("cart-shipping-estimate");
  });

  it("offers the promo code field below the totals", async () => {
    fakeCart.set(cartResult());

    const html = await renderToHtml(<SummaryBox />);

    expect(html).toMatch(
      /data-testid="cart-total"[\s\S]*<label for="checkout-promotion-code-input"[^>]*>Promo code<\/label>/,
    );
    expect(html).toContain('data-testid="cart-promotion-code-input"');
    expect(html).toContain('data-testid="cart-promotion-code-submit"');
  });

  it("shows an applied promotion as a promotion tile", async () => {
    fakeCart.set(
      cartResult({
        lineItems: [
          cartLineItem(),
          cartLineItem({
            id: "promotion-1",
            referencedId: "SUMMER",
            type: "promotion",
            label: "Summer sale",
            removable: true,
            good: false,
          }),
        ],
      }),
    );

    const html = await renderToHtml(<SummaryBox />);

    expect(html).toContain('data-line-item-type="promotion"');
    expect(html).toContain('data-testid="promotion-remove-button"');
  });
});

describe("SummaryBox in other locales", () => {
  it("labels the summary in German", async () => {
    fakeCart.set(
      cartResult({ lineItems: [cartLineItem({ removable: true })] }),
    );

    const html = await renderToHtml(withI18n(<SummaryBox />, "de-DE"));

    expect(html).toMatch(/<h2[^>]*>Zusammenfassung<\/h2>/);
    expect(html).toMatch(/<dt[^>]*>Zwischensumme<\/dt>/);
    expect(html).toMatch(/<dt[^>]*>Versand<\/dt>/);
    expect(html).toMatch(
      /<dt[^>]*>Gesamt<\/dt><dd><span[^>]*data-testid="cart-total">64,97\s€<\/span>/,
    );
    expect(html).toContain(">Entfernen</button>");
    expect(html).toContain(">Promo-Code</label>");
    expect(html).toContain(">Einlösen</span></button>");
  });
});
