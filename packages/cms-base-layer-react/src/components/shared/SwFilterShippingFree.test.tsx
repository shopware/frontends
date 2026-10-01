import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import type { ListingFilter } from "./listingFilterTypes";
import { SwFilterShippingFree } from "./SwFilterShippingFree";

const shippingFreeFilter: ListingFilter = {
  id: "shipping-free",
  code: "shipping-free",
  label: "Shipping free",
  name: "Shipping free",
};

describe("SwFilterShippingFree", () => {
  it("renders the switch inside a panel with a generated id in dropdown mode", async () => {
    const html = await renderToHtml(
      <SwFilterShippingFree
        filter={shippingFreeFilter}
        selectedFilters={{ "shipping-free": true }}
        displayMode="dropdown"
        onSelectValue={() => {}}
      />,
    );
    expect(html).toMatch(/<div id="[^"]+" class="self-stretch">/);
    expect(html).toContain("Free shipping");
    expect(html).not.toContain("aria-expanded");
  });

  it("links the accordion header to the panel id", async () => {
    const html = await renderToHtml(
      <SwFilterShippingFree
        filter={shippingFreeFilter}
        selectedFilters={{}}
        onSelectValue={() => {}}
      />,
    );
    expect(html).toContain('aria-expanded="false"');
    expect(html).toMatch(/aria-controls="[^"]+"/);
    expect(html).not.toContain('aria-controls="filter-shipping-free"');
  });
});
