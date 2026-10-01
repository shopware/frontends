import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import type { ListingFilter } from "./listingFilterTypes";
import { SwFilterChips } from "./SwFilterChips";

const availableFilters: ListingFilter[] = [
  {
    id: "color",
    code: "color",
    label: "Color",
    name: "Color",
    options: [{ id: "red", translated: { name: "Red" } }],
  },
  {
    id: "manufacturer",
    code: "manufacturer",
    label: "Manufacturer",
    name: "Manufacturer",
    entities: [{ id: "acme", translated: { name: "Acme" } }],
  },
  {
    id: "categories",
    code: "categories",
    label: "categories",
    name: "categories",
    entities: [{ id: "shoes", translated: { name: "Shoes" } }],
  },
];

describe("SwFilterChips", () => {
  it("renders nothing without active filters", async () => {
    const html = await renderToHtml(
      <SwFilterChips
        filters={{ manufacturer: [], properties: [] }}
        availableFilters={availableFilters}
        onRemove={() => {}}
      />,
    );
    expect(html).toBe("");
  });

  it("renders a chip per active filter value", async () => {
    const html = await renderToHtml(
      <SwFilterChips
        filters={{
          manufacturer: ["acme"],
          properties: ["red", "unknown"],
          categories: ["shoes"],
          "min-price": 10,
          rating: 4,
          "shipping-free": true,
        }}
        availableFilters={availableFilters}
        onRemove={() => {}}
      />,
    );
    expect(html).toContain("Red");
    expect(html).toContain("Acme");
    expect(html).toContain("Shoes");
    expect(html).toContain("Price: 10 - ∞");
    expect(html).toContain("Rating: 4★");
    expect(html).toContain("Free Shipping");
    expect(html.match(/<button/g)).toHaveLength(6);
  });
});
