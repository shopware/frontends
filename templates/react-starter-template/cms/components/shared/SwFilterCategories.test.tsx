import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import type { ListingFilter } from "./listingFilterTypes";
import { SwFilterCategories } from "./SwFilterCategories";

const categoriesFilter: ListingFilter = {
  id: "categories",
  code: "categories",
  label: "Categories",
  name: "Categories",
  entities: [
    { id: "shoes", translated: { name: "Shoes" } },
    { id: "bags", translated: { name: "Bags" } },
  ],
};

describe("SwFilterCategories", () => {
  it("renders one label per category around a bare checkbox input", async () => {
    const html = await renderToHtml(
      <SwFilterCategories
        filter={categoriesFilter}
        selectedFilters={{ categories: ["bags"] }}
        displayMode="dropdown"
        onSelectValue={() => {}}
      />,
    );
    expect(html.match(/<label/g)).toHaveLength(2);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html.match(/checked=""/g)).toHaveLength(1);
    expect(html).toContain("Shoes");
    expect(html).toContain("Bags");
  });
});
