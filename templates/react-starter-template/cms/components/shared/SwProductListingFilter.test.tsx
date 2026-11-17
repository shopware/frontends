import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import type { ListingFilter } from "./listingFilterTypes";
import { SwProductListingFilter } from "./SwProductListingFilter";

const manufacturerFilter: ListingFilter = {
  id: "manufacturer",
  code: "manufacturer",
  label: "Manufacturer",
  name: "Manufacturer",
  entities: [
    { id: "acme", translated: { name: "Acme" } },
    { id: "globex", translated: { name: "Globex" } },
  ],
};

const selected = {
  selectedManufacturer: ["acme"],
  selectedProperties: [],
  selectedMinPrice: undefined,
  selectedMaxPrice: undefined,
  selectedRating: undefined,
  selectedShippingFree: undefined,
};

describe("SwProductListingFilter", () => {
  it("renders the listing-filter test id and a collapsed accordion header", async () => {
    const html = await renderToHtml(
      <SwProductListingFilter
        filter={manufacturerFilter}
        {...selected}
        onFilterChange={() => {}}
        className="w-full"
      />,
    );
    expect(html).toContain('data-testid="listing-filter-manufacturer"');
    expect(html).toContain('class="w-full"');
    expect(html).toContain('<button type="button"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('type="checkbox"');
  });

  it("renders the checkboxes with the selected state in dropdown mode", async () => {
    const html = await renderToHtml(
      <SwProductListingFilter
        filter={manufacturerFilter}
        {...selected}
        displayMode="dropdown"
        onFilterChange={() => {}}
      />,
    );
    expect(html).not.toContain("aria-expanded");
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html.match(/checked=""/g)).toHaveLength(1);
    expect(html).toContain("Acme");
    expect(html).toContain("Globex");
  });

  it("treats an unknown code with options as a property group", async () => {
    const html = await renderToHtml(
      <SwProductListingFilter
        filter={{
          id: "color",
          code: "color",
          label: "Color",
          name: "Color",
          options: [{ id: "red", translated: { name: "Red" } }],
        }}
        {...selected}
        displayMode="dropdown"
        onFilterChange={() => {}}
      />,
    );
    expect(html).toContain('data-testid="listing-filter-color"');
    expect(html).toContain("Red");
  });
});
