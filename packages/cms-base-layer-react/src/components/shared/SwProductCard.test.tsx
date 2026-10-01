import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { SwProductCard } from "./SwProductCard";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={String(href)} {...props}>
      {children as never}
    </a>
  ),
}));

function product(overrides: Record<string, unknown> = {}): Schemas["Product"] {
  return {
    id: "product-1",
    name: "Fallback name",
    available: true,
    markAsTopseller: false,
    translated: { name: "Blue Shirt" },
    manufacturer: { translated: { name: "Shopware" } },
    seoUrls: [{ seoPathInfo: "Blue-Shirt/SW10001" }],
    cover: {
      media: {
        url: "https://cdn.example.com/blue-shirt.jpg",
        alt: "",
        translated: { alt: "A blue shirt" },
        thumbnails: [
          { width: 400, url: "https://cdn.example.com/blue-shirt-400.jpg" },
          { width: 800, url: "https://cdn.example.com/blue-shirt-800.jpg" },
        ],
      },
    },
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

const ctx = createCmsContext({
  registry: createCmsRegistry(),
  urlPrefix: "de-DE",
  locale: "de-DE",
  currencyCode: "EUR",
});

describe("SwProductCard", () => {
  it("renders the image, name link, price and add-to-cart button", async () => {
    const html = await renderToHtml(
      <SwProductCard product={product()} ctx={ctx} className="w-full" />,
    );

    expect(html).toContain(
      'class="p-px flex flex-col justify-start items-start overflow-hidden w-full"',
    );
    expect(html).toContain('data-testid="product-box-img"');
    expect(html).toContain('src="https://cdn.example.com/blue-shirt.jpg"');
    expect(html).toContain("blue-shirt-400.jpg 400w");
    expect(html).toContain('alt="A blue shirt"');
    expect(html).toContain('href="/de-DE/Blue-Shirt/SW10001"');
    expect(html).toContain('data-testid="product-box-product-name-link"');
    expect(html).toContain("Blue Shirt");
    expect(html).toContain("Shopware");
    expect(html).toContain('data-testid="product-box-product-price"');
    expect(html).toContain("19,99");
    expect(html).toContain('data-testid="add-to-cart-button"');
    expect(html).toContain('data-product-id="product-1"');
    expect(html).toContain("Add to cart");
    expect(html).not.toContain("product-box-toggle-wishlist-button");
    expect(html).not.toContain("Tip");
  });

  it("shows the badge for topsellers and the details link for from prices", async () => {
    const html = await renderToHtml(
      <SwProductCard
        product={product({
          markAsTopseller: true,
          calculatedPrices: [
            { unitPrice: 15, totalPrice: 15, quantity: 1 },
            { unitPrice: 12, totalPrice: 12, quantity: 10 },
          ],
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("Tip");
    expect(html).toContain("Details");
    expect(html).not.toContain("<button");
    expect(html).not.toContain('data-testid="add-to-cart-button"');
  });

  it("renders the rating instead of the price in the minimal layout", async () => {
    const html = await renderToHtml(
      <SwProductCard
        product={product({ ratingAverage: 4, productReviews: [{}, {}] })}
        ctx={ctx}
        layoutType="minimal"
      />,
    );

    expect(html).toContain('aria-label="4 out of 5 stars"');
    expect(html).toContain("(2)");
    expect(html).not.toContain('data-testid="product-box-product-price"');
    expect(html).not.toContain('data-testid="add-to-cart-button"');
  });

  it("uses the translations from the context", async () => {
    const html = await renderToHtml(
      <SwProductCard
        product={product()}
        ctx={{
          ...ctx,
          translations: { product: { addToCart: "In den Warenkorb" } },
        }}
      />,
    );

    expect(html).toContain("In den Warenkorb");
  });
});

describe("ProductCardSkeleton", () => {
  it("renders a status placeholder", async () => {
    const html = await renderToHtml(<ProductCardSkeleton ctx={ctx} />);

    expect(html).toContain('role="status"');
    expect(html).toContain("data:image/svg+xml;base64,");
    expect(html).toContain("Loading...");
  });
});
