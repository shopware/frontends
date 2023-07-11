import { searchSuggestedProducts } from "../searchService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("SearchService - searchSuggestedProducts", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return ProductListingResult", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { apiAlias: "product_listing" },
    });
    const result = await searchSuggestedProducts({
      query: "searchTerm",
      limit: 10,
      p: 1,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/search-suggest?search=searchTerm",
      {
        query: "searchTerm",
        limit: 10,
        p: 1,
      },
    );
    expect(result).toHaveProperty("apiAlias");
  });

  it("should call for empty queery", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { apiAlias: "product_listing" },
    });
    const result = await searchSuggestedProducts(undefined);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/search-suggest?search=",
      undefined,
    );
    expect(result).toHaveProperty("apiAlias");
  });
});
