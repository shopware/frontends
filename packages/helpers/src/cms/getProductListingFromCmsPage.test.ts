import { describe, expect, it } from "vitest";
import { getProductListingFromCmsPage } from "./getProductListingFromCmsPage";

describe("getProductListingFromCmsPage", () => {
  it("should return null when sections array is empty", () => {
    const cmsPage = {
      sections: [],
    };
    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toBeNull();
  });

  it("should return null when no blocks exist", () => {
    const cmsPage = {
      sections: [
        {
          id: "section-1",
        },
      ],
    };
    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toBeNull();
  });

  it("should return null when no slots exist", () => {
    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [
            {
              id: "block-1",
            },
          ],
        },
      ],
    };
    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toBeNull();
  });

  it("should return null when no product-listing slot exists", () => {
    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [
            {
              id: "block-1",
              slots: [
                {
                  type: "text",
                  data: { content: "Some text" },
                },
                {
                  type: "image",
                  data: { media: {} },
                },
              ],
            },
          ],
        },
      ],
    };
    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toBeNull();
  });

  it("should return null when product-listing slot has no data", () => {
    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [
            {
              id: "block-1",
              slots: [
                {
                  type: "product-listing",
                },
              ],
            },
          ],
        },
      ],
    };
    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toBeNull();
  });

  it("should return null when product-listing slot data has no listing", () => {
    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [
            {
              id: "block-1",
              slots: [
                {
                  type: "product-listing",
                  data: {
                    someOtherField: "value",
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toBeNull();
  });

  it("should extract listing from product-listing slot", () => {
    const mockListing = {
      elements: [
        { id: "product-1", name: "Product 1" },
        { id: "product-2", name: "Product 2" },
      ],
      total: 25,
      page: 1,
      limit: 10,
    };

    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [
            {
              id: "block-1",
              slots: [
                {
                  type: "product-listing",
                  data: {
                    listing: mockListing,
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toEqual(mockListing);
  });

  it("should extract listing from deeply nested structure", () => {
    const mockListing = {
      elements: [{ id: "product-1" }],
      total: 1,
    };

    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [
            {
              id: "block-1",
              slots: [
                {
                  type: "text",
                  data: { content: "Text" },
                },
              ],
            },
            {
              id: "block-2",
              slots: [
                {
                  type: "image",
                  data: { media: {} },
                },
                {
                  type: "product-listing",
                  data: {
                    listing: mockListing,
                  },
                },
              ],
            },
          ],
        },
        {
          id: "section-2",
          blocks: [
            {
              id: "block-3",
              slots: [
                {
                  type: "text",
                  data: { content: "More text" },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toEqual(mockListing);
  });

  it("should return first product-listing when multiple exist", () => {
    const firstListing = {
      elements: [{ id: "product-1" }],
      total: 1,
    };

    const secondListing = {
      elements: [{ id: "product-2" }],
      total: 1,
    };

    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [
            {
              id: "block-1",
              slots: [
                {
                  type: "product-listing",
                  data: {
                    listing: firstListing,
                  },
                },
              ],
            },
            {
              id: "block-2",
              slots: [
                {
                  type: "product-listing",
                  data: {
                    listing: secondListing,
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toEqual(firstListing);
  });

  it("should handle multiple sections with mixed content", () => {
    const mockListing = {
      elements: [],
      total: 0,
      aggregations: [],
    };

    const cmsPage = {
      sections: [
        {
          id: "section-1",
          blocks: [],
        },
        {
          id: "section-2",
          blocks: [
            {
              id: "block-1",
              slots: [],
            },
          ],
        },
        {
          id: "section-3",
          blocks: [
            {
              id: "block-2",
              slots: [
                {
                  type: "product-listing",
                  data: {
                    listing: mockListing,
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = getProductListingFromCmsPage(cmsPage);
    expect(result).toEqual(mockListing);
  });

  it("should work with generic type parameter", () => {
    type CustomListingType = {
      products: Array<{ id: string }>;
      count: number;
    };

    const mockListing: CustomListingType = {
      products: [{ id: "p1" }],
      count: 1,
    };

    const cmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [
                {
                  type: "product-listing",
                  data: {
                    listing: mockListing,
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = getProductListingFromCmsPage<CustomListingType>(cmsPage);
    expect(result).toEqual(mockListing);
    if (result) {
      expect(result.products).toHaveLength(1);
      expect(result.count).toBe(1);
    }
  });
});
