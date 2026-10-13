import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import {
  buildBreadcrumbListJsonLd,
  buildProductJsonLd,
  productAvailability,
  serializeJsonLd,
} from "./jsonLd";

const NOW = Date.parse("2026-10-13T12:00:00Z");
const site = new URL("https://shop.test");

function product(overrides: Record<string, unknown> = {}): Schemas["Product"] {
  return {
    id: "p1",
    productNumber: "SW-1",
    name: "Chair",
    translated: { name: "Chair", description: "<p>Oak &amp; ash</p>" },
    stock: 5,
    minPurchase: 1,
    calculatedPrice: { unitPrice: 99.5 },
    calculatedPrices: [],
    ...overrides,
  } as unknown as Schemas["Product"];
}

describe("serializeJsonLd", () => {
  it("cannot close the script element or start an entity", () => {
    const json = serializeJsonLd({ name: "</script><b>&" });

    expect(json).not.toContain("</script>");
    expect(json).not.toContain("<");
    expect(json).not.toContain("&");
    expect(JSON.parse(json)).toEqual({ name: "</script><b>&" });
  });
});

describe("productAvailability", () => {
  it.each([
    ["in stock", {}, "InStock"],
    ["unavailable", { available: false }, "OutOfStock"],
    ["a sold out closeout", { stock: 0, isCloseout: true }, "OutOfStock"],
    [
      "sold out with a restock time",
      { stock: 0, restockTime: 3 },
      "LimitedAvailability",
    ],
    ["sold out but orderable", { stock: 0 }, "InStock"],
    ["released later", { releaseDate: "2027-01-01T00:00:00Z" }, "PreOrder"],
  ])("%s", (_, overrides, expected) => {
    expect(productAvailability(product(overrides), NOW)).toBe(
      `https://schema.org/${expected}`,
    );
  });

  it("prefers the available stock", () => {
    expect(
      productAvailability(
        product({ stock: 5, availableStock: 0, isCloseout: true }),
        NOW,
      ),
    ).toBe("https://schema.org/OutOfStock");
  });
});

describe("buildProductJsonLd", () => {
  it("describes the product with an offer, brand, images and a gtin", () => {
    const data = buildProductJsonLd({
      product: product({
        ean: "4006381333931",
        manufacturerNumber: "M-1",
        manufacturer: { name: "Kvist", translated: { name: "Kvist & Co." } },
        media: [
          { media: { url: "https://cdn.test/a.jpg", mimeType: "image/jpeg" } },
          { media: { url: "https://cdn.test/v.mp4", mimeType: "video/mp4" } },
        ],
      }),
      path: "/Chair/SW-1",
      siteUrl: site,
      currencyCode: "EUR",
      now: NOW,
    });

    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "https://shop.test/Chair/SW-1#product",
      url: "https://shop.test/Chair/SW-1",
      name: "Chair",
      productID: "p1",
      sku: "SW-1",
      description: "Oak & ash",
      image: ["https://cdn.test/a.jpg"],
      brand: { "@type": "Brand", name: "Kvist & Co." },
      mpn: "M-1",
      gtin13: "4006381333931",
      offers: {
        "@type": "Offer",
        price: 99.5,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://shop.test/Chair/SW-1",
      },
    });
  });

  it("offers a price range for tier prices and leaves out what it cannot know", () => {
    const data = buildProductJsonLd({
      product: product({
        ean: "ABC-1",
        calculatedPrices: [
          { unitPrice: 10 },
          { unitPrice: 8 },
          { unitPrice: 6 },
        ],
        cover: { media: { url: "https://cdn.test/cover.jpg" } },
      }),
      path: "/Chair/SW-1",
      siteUrl: null,
      currencyCode: "USD",
      now: NOW,
    });

    expect(data).not.toHaveProperty("url");
    expect(data).not.toHaveProperty("@id");
    expect(data).not.toHaveProperty("gtin13");
    expect(data).not.toHaveProperty("gtin");
    expect(data.image).toEqual(["https://cdn.test/cover.jpg"]);
    expect(data.offers).toEqual({
      "@type": "AggregateOffer",
      lowPrice: 6,
      highPrice: 10,
      offerCount: 3,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    });
  });
});

describe("buildBreadcrumbListJsonLd", () => {
  it("lists linked crumbs and the current one and leaves unlinked folders out", () => {
    expect(
      buildBreadcrumbListJsonLd(
        [
          { name: "Folder" },
          { name: "Chairs", href: "/pl-PL/Chairs/" },
          { name: "Current" },
        ],
        site,
      ),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Chairs",
          item: "https://shop.test/pl-PL/Chairs/",
        },
        { "@type": "ListItem", position: 2, name: "Current" },
      ],
    });
  });

  it("is left out without a site URL or a trail", () => {
    expect(
      buildBreadcrumbListJsonLd([{ name: "x", href: "/x" }], null),
    ).toBeNull();
    expect(buildBreadcrumbListJsonLd([], site)).toBeNull();
  });
});
