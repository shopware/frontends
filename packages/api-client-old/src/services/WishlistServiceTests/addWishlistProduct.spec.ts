import { addWishlistProduct } from "../wishlistService";
import { getAddWishlistProductEndpoint } from "../..";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("WishlistService - addWishlistProduct", () => {
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
    const result = await addWishlistProduct("some-product-uuid");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      getAddWishlistProductEndpoint("some-product-uuid"),
    );
    expect(result).toHaveProperty("apiAlias");
  });
});
