import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementBuyBox as CmsElementBuyBoxContent } from "../../types";
import { CmsElementBuyBox } from "./CmsElementBuyBox";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
  usePathname: () => "/Blue-Shirt/SW10001",
  useSearchParams: () => new URLSearchParams(),
}));

function product(overrides: Record<string, unknown> = {}): Schemas["Product"] {
  return {
    id: "product-1",
    name: "Fallback name",
    productNumber: "SW10001",
    available: true,
    availableStock: 10,
    minPurchase: 1,
    translated: { name: "Blue Shirt" },
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

function content(
  data: Partial<CmsElementBuyBoxContent["data"]>,
  config: Record<string, unknown> = {},
): CmsElementBuyBoxContent {
  return {
    id: "slot-buy-box",
    apiAlias: "cms_slot",
    type: "buy-box",
    slot: "content",
    blockId: "block-buy-box",
    config,
    data: {
      configuratorSettings: null,
      productId: "product-1",
      ratingSuccess: false,
      reviews: [],
      apiAlias: "cms_product_description_reviews",
      ...data,
    },
  } as unknown as CmsElementBuyBoxContent;
}

const registry = createCmsRegistry({});

describe("CmsElementBuyBox", () => {
  it("renders nothing without a product", async () => {
    const ctx = createCmsContext({ registry });
    const html = await renderToHtml(
      <CmsElementBuyBox content={content({ product: undefined })} ctx={ctx} />,
    );

    expect(html).toBe("");
  });

  it("renders price, tax notice and add to cart", async () => {
    const ctx = createCmsContext({ registry, locale: "de-DE" });
    const html = await renderToHtml(
      <CmsElementBuyBox
        content={content(
          { product: product() },
          { alignment: { source: "static", value: "center" } },
        )}
        ctx={ctx}
        className="mt-4"
      />,
    );

    expect(html).toContain("justify-center");
    expect(html).toContain("mt-4");
    expect(html).toContain("Blue Shirt");
    expect(html).toContain("19,99");
    expect(html).toContain("Prices incl. VAT plus shipping costs");
    expect(html).toContain('data-testid="add-to-cart-button"');
    expect(html).toContain("SW10001");
  });

  it("renders the net tax notice and the regulation price", async () => {
    const ctx = createCmsContext({ registry, taxState: "net" });
    const html = await renderToHtml(
      <CmsElementBuyBox
        content={content({
          product: product({
            calculatedPrice: {
              unitPrice: 19.99,
              totalPrice: 19.99,
              quantity: 1,
              listPrice: null,
              regulationPrice: { price: 24.99 },
              referencePrice: null,
              calculatedTaxes: [],
              taxRules: [],
            },
          }),
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("Prices excl. VAT plus shipping costs");
    expect(html).toContain("Previously");
    expect(html).toContain("24.99");
  });

  it("reads the regulation price from the selected calculated price", async () => {
    const ctx = createCmsContext({ registry });
    const html = await renderToHtml(
      <CmsElementBuyBox
        content={content({
          product: product({
            calculatedPrices: [
              {
                unitPrice: 17.99,
                totalPrice: 17.99,
                quantity: 1,
                listPrice: null,
                regulationPrice: { price: 21.5 },
                referencePrice: null,
                calculatedTaxes: [],
                taxRules: [],
              },
            ],
          }),
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("Previously");
    expect(html).toContain("21.50");
    expect(html).not.toContain("19.99");
  });

  it("renders a tier price table when the product has tier prices", async () => {
    const ctx = createCmsContext({ registry });
    const tier = (quantity: number, unitPrice: number) => ({
      unitPrice,
      totalPrice: unitPrice * quantity,
      quantity,
      listPrice: null,
      regulationPrice: null,
      referencePrice: null,
      calculatedTaxes: [],
      taxRules: [],
    });
    const html = await renderToHtml(
      <CmsElementBuyBox
        content={content({
          product: product({
            calculatedPrices: [tier(1, 10), tier(5, 9), tier(10, 8)],
          }),
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("<table");
    expect(html).toContain("Amount");
    expect(html).toContain("Price");
    expect(html).toContain("From");
  });

  it("renders the purchase unit with its reference price", async () => {
    const ctx = createCmsContext({ registry });
    const html = await renderToHtml(
      <CmsElementBuyBox
        content={content({
          product: product({
            purchaseUnit: 0.5,
            unit: { translated: { name: "kg" } },
            calculatedPrice: {
              unitPrice: 19.99,
              totalPrice: 19.99,
              quantity: 1,
              listPrice: null,
              regulationPrice: null,
              referencePrice: {
                price: 39.98,
                purchaseUnit: 0.5,
                referenceUnit: 1,
                unitName: "kg",
              },
              calculatedTaxes: [],
              taxRules: [],
            },
          }),
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("Content:");
    expect(html).toContain("0.5 kg");
    expect(html).toContain("39.98 / 1 kg");
  });

  it("keeps the decimals of the reference price", async () => {
    const ctx = createCmsContext({ registry, locale: "de-DE" });
    const html = await renderToHtml(
      <CmsElementBuyBox
        content={content({
          product: product({
            purchaseUnit: 250,
            unit: { translated: { name: "g" } },
            calculatedPrice: {
              unitPrice: 2.49,
              totalPrice: 2.49,
              quantity: 1,
              listPrice: null,
              regulationPrice: null,
              referencePrice: {
                price: 0.996,
                purchaseUnit: 250,
                referenceUnit: 100,
                unitName: "g",
              },
              calculatedTaxes: [],
              taxRules: [],
            },
          }),
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("0,996");
    expect(html).not.toContain("1,00");
  });
});
