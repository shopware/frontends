import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import {
  categoryMetadata,
  homeMetadata,
  landingPageMetadata,
  productMetadata,
} from "./metadata";

const site = new URL("https://shop.test");

function context(canonicalPath: string, siteUrl: URL | null = site) {
  return { canonicalPath, siteUrl, siteName: "Demo Store" };
}

const media = {
  url: "https://cdn.test/og.jpg",
  metaData: { width: 1200, height: 630 },
  translated: { alt: "Chair" },
} as unknown as Schemas["Media"];

describe("categoryMetadata", () => {
  it("prefers the meta fields and builds an absolute canonical with the page", () => {
    const category = {
      name: "Clothing",
      translated: {
        name: "Odzież",
        metaTitle: "Odzież damska",
        metaDescription: "Opis",
        keywords: "odzież, moda",
      },
      media,
    } as unknown as Schemas["Category"];

    expect(categoryMetadata(category, context("/pl-PL/Clothing/?p=2"))).toEqual(
      {
        title: "Odzież damska",
        description: "Opis",
        keywords: "odzież, moda",
        alternates: { canonical: "https://shop.test/pl-PL/Clothing/?p=2" },
        openGraph: {
          type: "website",
          siteName: "Demo Store",
          title: "Odzież damska",
          description: "Opis",
          url: "https://shop.test/pl-PL/Clothing/?p=2",
          images: [
            {
              url: "https://cdn.test/og.jpg",
              width: 1200,
              height: 630,
              alt: "Chair",
            },
          ],
        },
      },
    );
  });

  it("falls back to the name and a plain description and stays relative without a site URL", () => {
    const category = {
      name: "Clothing",
      translated: { name: "Clothing", description: "<p>Soft &amp; warm</p>" },
    } as unknown as Schemas["Category"];

    const metadata = categoryMetadata(category, context("/Clothing/", null));

    expect(metadata.title).toBe("Clothing");
    expect(metadata.description).toBe("Soft & warm");
    expect(metadata.alternates).toEqual({ canonical: "/Clothing/" });
    expect(metadata.openGraph).not.toHaveProperty("url");
    expect(metadata).not.toHaveProperty("keywords");
  });
});

describe("productMetadata", () => {
  it("uses the Open Graph fields and media of the product first", () => {
    const product = {
      name: "Chair",
      translated: {
        name: "Chair",
        ogTitle: "The chair",
        ogDescription: "Sit well",
        metaDescription: "Meta",
      },
      openGraphMedia: media,
      cover: { media: { url: "https://cdn.test/cover.jpg" } },
    } as unknown as Schemas["Product"];

    const metadata = productMetadata(product, context("/Chair/SW-1"));

    expect(metadata.title).toBe("Chair");
    expect(metadata.description).toBe("Meta");
    expect(metadata.openGraph).toMatchObject({
      title: "The chair",
      description: "Sit well",
      images: [{ url: "https://cdn.test/og.jpg" }],
    });
  });

  it("uses the cover when there is no Open Graph media", () => {
    const product = {
      name: "Chair",
      translated: { name: "Chair" },
      cover: { media: { url: "https://cdn.test/cover.jpg" } },
    } as unknown as Schemas["Product"];

    expect(productMetadata(product, context("/x")).openGraph).toMatchObject({
      title: "Chair",
      images: [{ url: "https://cdn.test/cover.jpg" }],
    });
  });
});

describe("landingPageMetadata and homeMetadata", () => {
  it("gives a landing page no image", () => {
    const landingPage = {
      name: "Summer",
      translated: { name: "Summer", metaDescription: "Hot" },
    } as unknown as Schemas["LandingPage"];

    const metadata = landingPageMetadata(landingPage, context("/summer"));

    expect(metadata).toMatchObject({ title: "Summer", description: "Hot" });
    expect(metadata.openGraph).not.toHaveProperty("images");
  });

  it("keeps the brand title on the home page unless the root category has a meta title", () => {
    const plain = { name: "Home", translated: { name: "Home" } };
    const titled = {
      name: "Home",
      translated: { name: "Home", metaTitle: "Welcome" },
    };

    const untitled = homeMetadata(
      plain as unknown as Schemas["Category"],
      context("/"),
    );
    expect(untitled).not.toHaveProperty("title");
    expect(untitled.openGraph).toMatchObject({ title: "Demo Store" });
    expect(
      homeMetadata(titled as unknown as Schemas["Category"], context("/"))
        .title,
    ).toEqual({ absolute: "Welcome | Demo Store" });
  });
});
