import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import type { ListingFilter } from "./listingFilterTypes";
import { SwFilterProperties } from "./SwFilterProperties";

const colorFilter: ListingFilter = {
  id: "color",
  code: "color",
  label: "Color",
  name: "Color",
  options: [
    { id: "red", translated: { name: "Red" } },
    { id: "blue", translated: { name: "Blue" } },
  ],
};

describe("SwFilterProperties", () => {
  it("renders one label per option around a bare checkbox input", async () => {
    const html = await renderToHtml(
      <SwFilterProperties
        filter={colorFilter}
        selectedFilters={{ properties: ["red"] }}
        displayMode="dropdown"
        onSelectValue={() => {}}
      />,
    );
    expect(html.match(/<label/g)).toHaveLength(2);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html.match(/checked=""/g)).toHaveLength(1);
    expect(html).toContain("Red");
    expect(html).toContain("Blue");
  });
});
