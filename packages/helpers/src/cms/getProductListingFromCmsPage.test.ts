import { describe, expect, it } from "vitest";
import { getProductListingFromCmsPage } from "./getProductListingFromCmsPage";

describe("getProductListingFromCmsPage", () => {
  it("should return null for null input", () => {
    expect(getProductListingFromCmsPage(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(getProductListingFromCmsPage(undefined)).toBeNull();
  });

  it("should return null for non-object input", () => {
    expect(getProductListingFromCmsPage("string")).toBeNull();
    expect(getProductListingFromCmsPage(123)).toBeNull();
  });

  it("should return null when sections is missing", () => {
    expect(getProductListingFromCmsPage({})).toBeNull();
  });

  it("should return null when sections is not an array", () => {
    expect(getProductListingFromCmsPage({ sections: "not-array" })).toBeNull();
  });

  it("should return null when sections array is empty", () => {
    expect(getProductListingFromCmsPage({ sections: [] })).toBeNull();
  });

  it("should return null when section has no blocks", () => {
    const cmsPage = {
      sections: [{ blocks: undefined }],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return null when section blocks array is empty", () => {
    const cmsPage = {
      sections: [{ blocks: [] }],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return null when block has no slots", () => {
    const cmsPage = {
      sections: [
        {
          blocks: [{ slots: undefined }],
        },
      ],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return null when block slots array is empty", () => {
    const cmsPage = {
      sections: [
        {
          blocks: [{ slots: [] }],
        },
      ],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return null when no product-listing slot type found", () => {
    const cmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [
                { type: "image", data: { listing: { test: "data" } } },
                { type: "text", data: { listing: { test: "data" } } },
              ],
            },
          ],
        },
      ],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return null when product-listing slot has no data", () => {
    const cmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [{ type: "product-listing", data: null }],
            },
          ],
        },
      ],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return null when product-listing slot data has no listing", () => {
    const cmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [{ type: "product-listing", data: { other: "data" } }],
            },
          ],
        },
      ],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return listing data when found in first section", () => {
    const expectedListing = { elements: [], total: 0 };
    const cmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [
                {
                  type: "product-listing",
                  data: { listing: expectedListing },
                },
              ],
            },
          ],
        },
      ],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toEqual(expectedListing);
  });

  it("should return listing data when found in nested structure", () => {
    const expectedListing = { elements: [{ id: "1" }], total: 1 };
    const cmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [{ type: "image", data: null }],
            },
          ],
        },
        {
          blocks: [
            {
              slots: [
                { type: "text", data: null },
                {
                  type: "product-listing",
                  data: { listing: expectedListing },
                },
              ],
            },
          ],
        },
      ],
    };
    expect(getProductListingFromCmsPage(cmsPage)).toEqual(expectedListing);
  });

  it("should handle generic type parameter", () => {
    type CustomListing = { customField: string };
    const expectedListing: CustomListing = { customField: "test" };
    const cmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [
                {
                  type: "product-listing",
                  data: { listing: expectedListing },
                },
              ],
            },
          ],
        },
      ],
    };
    const result = getProductListingFromCmsPage<CustomListing>(cmsPage);
    expect(result).toEqual(expectedListing);
  });
});
