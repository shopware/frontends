import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import { SwProductAddToCart } from "./SwProductAddToCart";
import { SwProductUnits } from "./SwProductUnits";
import { SwStockInfo } from "./SwStockInfo";
import { SwVariantConfigurator } from "./SwVariantConfigurator";
import { getVariantOptionGroups } from "./variantOptionGroups";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const ctx = createCmsContext({
  registry: createCmsRegistry(),
  urlPrefix: "de-DE",
  locale: "de-DE",
  currencyCode: "EUR",
});

const deliveryTime = {
  id: "delivery-1",
  name: "2-3 days",
  min: 2,
  max: 3,
  unit: "day",
  translated: { name: "2-3 Tage", unit: "day" },
} as Schemas["DeliveryTime"];

function product(overrides: Record<string, unknown> = {}): Schemas["Product"] {
  return {
    id: "product-1",
    name: "Fallback name",
    productNumber: "SW10001",
    available: true,
    availableStock: 10,
    minPurchase: 1,
    maxPurchase: 50,
    purchaseSteps: 1,
    optionIds: ["option-red", "option-large"],
    translated: { name: "Blue Shirt" },
    deliveryTime,
    calculatedPrice: {
      unitPrice: 19.99,
      totalPrice: 19.99,
      quantity: 1,
      listPrice: null,
      regulationPrice: null,
      referencePrice: null,
      calculatedTaxes: [],
      taxRules: [],
    },
    calculatedPrices: [],
    ...overrides,
  } as unknown as Schemas["Product"];
}

const optionGroups = [
  {
    id: "group-color",
    name: "Color",
    translated: { name: "Farbe" },
    options: [
      { id: "option-red", name: "Red", translated: { name: "Rot" } },
      { id: "option-blue", name: "Blue", translated: { name: "Blau" } },
    ],
  },
  {
    id: "group-size",
    name: "Size",
    translated: { name: "Größe" },
    options: [
      { id: "option-small", name: "Small", translated: { name: "S" } },
      { id: "option-large", name: "Large", translated: { name: "L" } },
    ],
  },
] as unknown as Schemas["PropertyGroup"][];

describe("SwProductAddToCart", () => {
  it("renders the quantity input, the add-to-cart button and the product number", async () => {
    const html = await renderToHtml(
      <SwProductAddToCart product={product()} ctx={ctx} className="mt-2" />,
    );

    expect(html).toContain('data-testid="product-quantity"');
    expect(html).toContain('type="number"');
    expect(html).toContain('value="1"');
    expect(html).toContain('min="1"');
    expect(html).toContain('max="50"');
    expect(html).toContain('data-testid="add-to-cart-button"');
    expect(html).toContain('data-product-id="product-1"');
    expect(html).toContain("Add to cart");
    expect(html).toContain("Product number");
    expect(html).toContain("SW10001");
    expect(html).toContain('aria-label="Increase quantity"');
    expect(html).toContain('aria-label="Decrease quantity"');
    expect(html).toContain("Available, delivery time");
    expect(html).toContain("2-3 Tage");
    expect(html).toContain(
      "w-full inline-flex flex-col justify-start items-start gap-8 mt-2",
    );
  });

  it("disables the button for unavailable products", async () => {
    const html = await renderToHtml(
      <SwProductAddToCart product={product({ available: false })} ctx={ctx} />,
    );

    expect(html).toMatch(
      /<button[^>]*data-testid="add-to-cart-button"[^>]*disabled=""/,
    );
  });

  it("uses the translations of the context", async () => {
    const translated = createCmsContext({
      registry: createCmsRegistry(),
      translations: {
        product: {
          addToCart: "In den Warenkorb",
          productNumber: "Artikelnummer",
        },
        form: { quantitySelect: { label: "Menge" } },
      },
    });
    const html = await renderToHtml(
      <SwProductAddToCart product={product()} ctx={translated} />,
    );

    expect(html).toContain("In den Warenkorb");
    expect(html).toContain("Artikelnummer");
    expect(html).toContain('aria-label="Menge"');
  });
});

describe("SwStockInfo", () => {
  it("shows the delivery time when stock covers the minimum purchase", async () => {
    const html = await renderToHtml(
      <SwStockInfo
        availableStock={5}
        minPurchase={1}
        deliveryTime={deliveryTime}
        ctx={ctx}
      />,
    );

    expect(html).toContain("bg-states-success");
    expect(html).toContain("Available, delivery time");
    expect(html).toContain("2-3 Tage");
  });

  it("shows the restock time when stock is below the minimum purchase", async () => {
    const html = await renderToHtml(
      <SwStockInfo
        availableStock={0}
        minPurchase={1}
        deliveryTime={deliveryTime}
        restockTime={7}
        ctx={ctx}
      />,
    );

    expect(html).toContain("bg-states-error");
    expect(html).toContain("Available, delivery time");
    expect(html).toContain("7");
    expect(html).toContain("days");
  });

  it("falls back to the unavailable message", async () => {
    const html = await renderToHtml(
      <SwStockInfo availableStock={0} minPurchase={1} ctx={ctx} />,
    );

    expect(html).toContain("No longer available");
  });
});

describe("SwProductUnits", () => {
  it("renders nothing without a purchase unit", async () => {
    const html = await renderToHtml(
      <SwProductUnits product={product()} ctx={ctx} />,
    );

    expect(html).toBe("");
  });

  it("renders the content and the reference price", async () => {
    const html = await renderToHtml(
      <SwProductUnits
        product={product({
          purchaseUnit: 2,
          unit: { translated: { name: "kg" } },
          calculatedPrice: {
            unitPrice: 19.99,
            referencePrice: {
              price: 9.995,
              referenceUnit: 1,
              unitName: "kg",
            },
          },
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("Content");
    expect(html).toContain("2");
    expect(html).toContain("kg");
    expect(html).toContain("10,00");
    expect(html).toContain("€");
  });

  it("hides the content line when showContent is false", async () => {
    const html = await renderToHtml(
      <SwProductUnits
        product={product({
          purchaseUnit: 2,
          unit: { translated: { name: "kg" } },
        })}
        ctx={ctx}
        showContent={false}
      />,
    );

    expect(html).not.toContain("Content");
  });
});

describe("SwVariantConfigurator", () => {
  it("renders the option groups and marks the selected options", async () => {
    const html = await renderToHtml(
      <SwVariantConfigurator
        product={product()}
        optionGroups={optionGroups}
        ctx={ctx}
      />,
    );

    const variants = html.match(/data-testid="product-variant"/g) ?? [];
    expect(variants).toHaveLength(4);
    expect(html.match(/data-testid="product-variant-text"/g)).toHaveLength(4);
    expect(html.match(/border-\[3px\] border-brand-primary/g)).toHaveLength(2);
    expect(html).toContain("Farbe");
    expect(html).toContain("Choose a");
    expect(html).toContain("Rot");
    expect(html).toContain('id="option-red-choice-label"');
    expect(html).toMatch(
      /<input[^>]*type="radio"[^>]*checked=""[^>]*value="option-red"/,
    );
    expect(html).not.toMatch(
      /<input[^>]*type="radio"[^>]*checked=""[^>]*value="option-blue"/,
    );
    expect(html).not.toContain('data-testid="loading"');
  });

  it("renders the empty wrapper without configurator settings", async () => {
    const html = await renderToHtml(
      <SwVariantConfigurator
        product={product()}
        optionGroups={null}
        ctx={ctx}
      />,
    );

    expect(html).toBe('<div class="relative flex flex-col"></div>');
  });
});

describe("getVariantOptionGroups", () => {
  it("reduces property groups to ids and translated names", () => {
    expect(getVariantOptionGroups(optionGroups)).toEqual([
      {
        id: "group-color",
        name: "Farbe",
        options: [
          { id: "option-red", name: "Rot" },
          { id: "option-blue", name: "Blau" },
        ],
      },
      {
        id: "group-size",
        name: "Größe",
        options: [
          { id: "option-small", name: "S" },
          { id: "option-large", name: "L" },
        ],
      },
    ]);
    expect(getVariantOptionGroups(undefined)).toEqual([]);
  });
});
