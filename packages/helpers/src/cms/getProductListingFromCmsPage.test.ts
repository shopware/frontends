import { describe, expect, it } from "vitest";
import { getProductListingFromCmsPage } from "./getProductListingFromCmsPage";

type ProductListingResult = {
  total: number;
  page: number;
  limit?: number;
  elements: unknown[];
};

type CmsPage = {
  sections?: Array<{
    blocks?: Array<{
      slots?: Array<{
        type: string;
        data?: {
          listing?: ProductListingResult;
          [key: string]: unknown;
        };
      }>;
    }>;
  }>;
};

describe("getProductListingFromCmsPage", () => {
  it("should return null for null input", () => {
    expect(getProductListingFromCmsPage(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(getProductListingFromCmsPage(undefined)).toBeNull();
  });

  it("should return null for cms page without sections", () => {
    const cmsPage: CmsPage = {};
    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should return null when no product-listing slot exists", () => {
    const cmsPage: CmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [
                {
                  type: "image",
                  data: {},
                },
              ],
            },
          ],
        },
      ],
    };

    expect(getProductListingFromCmsPage(cmsPage)).toBeNull();
  });

  it("should extract product listing from cms page", () => {
    const mockListing: ProductListingResult = {
      total: 100,
      page: 1,
      limit: 24,
      elements: [],
    };

    const cmsPage: CmsPage = {
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

    const result = getProductListingFromCmsPage<ProductListingResult>(cmsPage);
    expect(result).toEqual(mockListing);
    expect(result?.total).toBe(100);
  });

  it("should find product listing in nested structure", () => {
    const mockListing: ProductListingResult = {
      total: 50,
      page: 2,
      limit: 12,
      elements: [],
    };

    const cmsPage: CmsPage = {
      sections: [
        {
          blocks: [
            {
              slots: [
                {
                  type: "image",
                  data: {},
                },
              ],
            },
          ],
        },
        {
          blocks: [
            {
              slots: [
                {
                  type: "text",
                  data: {},
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
      ],
    };

    const result = getProductListingFromCmsPage<ProductListingResult>(cmsPage);
    expect(result).toEqual(mockListing);
  });

  it("should return first product listing if multiple exist", () => {
    const firstListing: ProductListingResult = {
      total: 100,
      page: 1,
      elements: [],
    };

    const secondListing: ProductListingResult = {
      total: 200,
      page: 2,
      elements: [],
    };

    const cmsPage: CmsPage = {
      sections: [
        {
          blocks: [
            {
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

    const result = getProductListingFromCmsPage<ProductListingResult>(cmsPage);
    expect(result).toEqual(firstListing);
    expect(result?.total).toBe(100);
  });
});
