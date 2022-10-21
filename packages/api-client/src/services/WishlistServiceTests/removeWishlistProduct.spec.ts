import { removeWishlistProduct } from "../wishlistService";
import { getRemoveWishlistProductEndpoint } from "../..";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("WishlistService - removeWishlistProduct", () => {
  const mockedDelete = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      delete: mockedDelete,
    } as any;
  });
  it("should invoke a delete method for specific endpoint", async () => {
    mockedDelete.mockResolvedValueOnce({
      data: { success: true },
    });
    const result = await removeWishlistProduct("some-product-uuid");
    expect(mockedDelete).toBeCalledTimes(1);
    expect(mockedDelete).toBeCalledWith(
      getRemoveWishlistProductEndpoint("some-product-uuid")
    );
    expect(result).toHaveProperty("success");
  });
});
