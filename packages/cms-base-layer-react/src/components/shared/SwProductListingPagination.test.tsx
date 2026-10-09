import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import {
  SwProductListingPagination,
  limitOptions,
} from "./SwProductListingPagination";

describe("limitOptions", () => {
  it("keeps the standard page sizes when the listing uses one of them", () => {
    expect(limitOptions(15)).toEqual([1, 15, 30, 45]);
  });

  it("adds the listing's own page size in order when it is not a standard one", () => {
    expect(limitOptions(24)).toEqual([1, 15, 24, 30, 45]);
    expect(limitOptions(100)).toEqual([1, 15, 30, 45, 100]);
  });

  it("ignores an empty page size", () => {
    expect(limitOptions(0)).toEqual([1, 15, 30, 45]);
  });
});

describe("SwProductListingPagination", () => {
  it("selects the listing's page size even when it is not a standard one", async () => {
    const html = await renderToHtml(
      <SwProductListingPagination
        total={29}
        current={1}
        limit={24}
        onChangePage={() => {}}
        onChangeLimit={() => {}}
      />,
    );

    expect(html).toContain(
      '<option value="24" selected="">24 Products</option>',
    );
    expect(html).toContain('<option value="1">1 Product</option>');
  });
});
