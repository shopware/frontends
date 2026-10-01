import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import type { ListingFilter } from "./listingFilterTypes";
import { SwFilterRating } from "./SwFilterRating";

const ratingFilter: ListingFilter = {
  id: "rating",
  code: "rating",
  label: "Rating",
  name: "Rating",
};

describe("SwFilterRating", () => {
  it("renders the stars as buttons with the selected rating pressed", async () => {
    const html = await renderToHtml(
      <SwFilterRating
        filter={ratingFilter}
        selectedFilters={{ rating: 3 }}
        displayMode="dropdown"
        onSelectValue={() => {}}
      />,
    );
    expect(html.match(/<button type="button"/g)).toHaveLength(5);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(4);
    expect(html).toContain('aria-label="1 star"');
    expect(html).toContain('aria-label="5 stars"');
    expect(html.match(/data-icon="star-filled"/g)).toHaveLength(3);
    expect(html.match(/data-icon="star"/g)).toHaveLength(2);
    expect(html.match(/<svg[^>]*aria-hidden="true"/g)).toHaveLength(5);
    expect(html).toMatch(/<div id="[^"]+" class="self-stretch/);
  });

  it("links the accordion header to the panel id", async () => {
    const html = await renderToHtml(
      <SwFilterRating
        filter={ratingFilter}
        selectedFilters={{}}
        onSelectValue={() => {}}
      />,
    );
    expect(html).toContain('aria-expanded="false"');
    expect(html).toMatch(/aria-controls="[^"]+"/);
    expect(html).not.toContain('aria-controls="filter-rating"');
    expect(html).not.toContain("aria-pressed");
  });
});
