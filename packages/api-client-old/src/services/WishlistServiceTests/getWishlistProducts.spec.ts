import { getWishlistProducts } from "../wishlistService";
import { getGetWishlistProductsEndpoint } from "../..";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("WishlistService - getWishlistProducts", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should invoke a post method for specific endpoint", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { apiAlias: "wishlist_products" },
    });
    const result = await getWishlistProducts({
      includes: {
        product: ["name"],
      },
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getGetWishlistProductsEndpoint(), {
      includes: { product: ["name"] },
    });
    expect(result).toHaveProperty("apiAlias");
  });
});
