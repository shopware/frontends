import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import type { Locale } from "@/i18n/config";
import { ContentLanguageProvider } from "@/i18n/ContentLanguageProvider";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { cart, cartPrice } from "../cart.fixture";
import { CartTotals } from "./CartTotals";
import type { CartTotalsProps } from "./CartTotals";
import { cartView, fakeCart } from "./cartView.fixture";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("./cartView.fixture")).useFakeCart,
}));

function delivery(
  id: string,
  price: number,
  name = "Standard",
  country?: Partial<Schemas["Country"]>,
): Schemas["CartDelivery"] {
  return {
    shippingMethod: { id, name, translated: { name } },
    shippingCosts: { totalPrice: price },
    location: country ? { country } : undefined,
  } as Schemas["CartDelivery"];
}

function withCart(
  price: Partial<Schemas["CartPrice"]>,
  deliveries: Schemas["CartDelivery"][] = [delivery("standard", 4.99)],
) {
  const current = cart({
    deliveries,
    price: { ...cartPrice(16.8, 21.79), ...price },
  });
  fakeCart.set(
    cartView({
      cart: current,
      subtotal: 16.8,
      totalPrice: 21.79,
      shippingCosts: deliveries,
    }),
  );
}

function render(props: CartTotalsProps = {}, locale?: Locale) {
  const node = <CartTotals {...props} />;
  return renderToHtml(locale ? withI18n(node, locale) : node);
}

function texts(html: string): string[] {
  return [...html.matchAll(/<(dt|dd)[^>]*>(.*?)<\/\1>/g)].map(([, , inner]) =>
    (inner ?? "").replace(/<[^>]+>/g, "").replace(/\s/g, " "),
  );
}

const GROSS_TAX = {
  apiAlias: "cart_tax_calculated",
  tax: 3.19,
  taxRate: 19,
  price: 16.8,
} as const;

describe("CartTotals", () => {
  it("lists subtotal, shipping and total, then the included taxes for a gross cart", async () => {
    withCart({ taxStatus: "gross", calculatedTaxes: [GROSS_TAX] });

    const html = await render();

    expect(texts(html)).toEqual([
      "Subtotal",
      "€16.80",
      "Shipping",
      "€4.99",
      "Total",
      "€21.79",
      "incl. 19% VAT",
      "€3.19",
    ]);
    expect(html).toMatch(
      /<dt[^>]*>Subtotal<\/dt><dd><span[^>]*data-testid="cart-subtotal">€16.80<\/span>/,
    );
    expect(html).toMatch(
      /<dt[^>]*>Total<\/dt><dd><span[^>]*data-testid="cart-total">€21.79<\/span>/,
    );
    expect(html).toContain('data-testid="cart-shipping-cost">€4.99');
    expect(html).toContain('data-testid="cart-tax">€3.19');
  });

  it("adds the taxes before the total for a net cart", async () => {
    withCart({
      taxStatus: "net",
      calculatedTaxes: [
        { ...GROSS_TAX, taxRate: 19, tax: 3.19 },
        { ...GROSS_TAX, taxRate: 7.5, tax: 0.5 },
      ],
    });

    const html = await render();

    expect(texts(html)).toEqual([
      "Subtotal",
      "€16.80",
      "Shipping",
      "€4.99",
      "plus 19% VAT",
      "€3.19",
      "plus 7.5% VAT",
      "€0.50",
      "Total",
      "€21.79",
    ]);
  });

  it("lists no taxes for a tax-free cart or a cart without a price", async () => {
    withCart({ taxStatus: "tax-free", calculatedTaxes: [GROSS_TAX] });
    expect(await render()).not.toContain("cart-tax");

    fakeCart.set(cartView({ cart: null, subtotal: 0, totalPrice: 0 }));
    expect(await render()).not.toContain("cart-tax");
  });

  it("renders one shipping row per delivery", async () => {
    withCart({ taxStatus: "gross" }, [
      delivery("standard", 4.99),
      delivery("express", 9.99, "Express"),
    ]);

    const html = await render();

    expect(html.match(/data-testid="cart-shipping-cost"/g)).toHaveLength(2);
  });

  it("names the shipping method in the content language only when asked to", async () => {
    withCart({ taxStatus: "gross" }, [delivery("express", 9.99, "Express")]);

    const plain = await render();
    expect(plain).not.toContain("Express");

    const named = await renderToHtml(
      <ContentLanguageProvider lang="en-US">
        <CartTotals withShippingMethod />
      </ContentLanguageProvider>,
    );
    expect(named).toMatch(
      /<dt[^>]*>Shipping<span class="block text-xs" lang="en-US">Express<\/span><\/dt>/,
    );
  });

  it("explains the shipping estimate with the delivery country when asked to", async () => {
    withCart({ taxStatus: "gross" }, [
      delivery("standard", 4.99, "Standard", {
        name: "Germany",
        translated: { name: "Deutschland" },
      } as Partial<Schemas["Country"]>),
    ]);

    expect(await render()).not.toContain("cart-shipping-estimate");

    const html = await render({ withShippingEstimate: true });
    expect(html).toMatch(
      /<p data-testid="cart-shipping-estimate"[^>]*>Shipping costs are calculated for delivery to Deutschland\. The final costs are confirmed at checkout\.<\/p>/,
    );
    expect(html).not.toContain("lang=");
  });

  it("leaves out the estimate without a delivery country", async () => {
    withCart({ taxStatus: "gross" });

    expect(await render({ withShippingEstimate: true })).not.toContain(
      "cart-shipping-estimate",
    );
  });
});

describe("CartTotals in other locales", () => {
  it("formats the tax rate the German way", async () => {
    withCart({
      taxStatus: "gross",
      calculatedTaxes: [GROSS_TAX, { ...GROSS_TAX, taxRate: 7.5, tax: 0.5 }],
    });

    const html = await render({}, "de-DE");

    expect(texts(html)).toEqual([
      "Zwischensumme",
      "16,80 €",
      "Versand",
      "4,99 €",
      "Gesamt",
      "21,79 €",
      "inkl. 19 % MwSt.",
      "3,19 €",
      "inkl. 7,5 % MwSt.",
      "0,50 €",
    ]);
  });

  it("speaks Polish", async () => {
    withCart({ taxStatus: "net", calculatedTaxes: [GROSS_TAX] });

    const html = await render({}, "pl-PL");

    expect(texts(html)).toContain("plus 19% VAT");
    expect(texts(html)).toContain("Suma częściowa");
  });
});
