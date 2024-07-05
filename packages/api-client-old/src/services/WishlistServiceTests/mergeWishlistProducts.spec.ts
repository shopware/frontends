import { mergeWishlistProducts } from "../wishlistService";
import { getMergeWishlistProductsEndpoint } from "../..";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("WishlistService - mergeWishlistProducts", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should invoke a post method for specific endpoint", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { success: true },
    });
    const result = await mergeWishlistProducts([
      "some-product-uuid-1",
      "some-product-uuid-2",
    ]);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getMergeWishlistProductsEndpoint(), {
      productIds: ["some-product-uuid-1", "some-product-uuid-2"],
    });
    expect(result).toHaveProperty("success");
  });
});
