import { getProductReviews } from "../productService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ProductService - getProductReviews", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return reviews of chosen product", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { elements: [{ productId: "044a190a54ab4f06803909c3ee8063ef" }] },
    });
    const productId = "044a190a54ab4f06803909c3ee8063ef";
    const result = await getProductReviews(productId);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/product/044a190a54ab4f06803909c3ee8063ef/reviews",
      {}
    );
    expect(result).toHaveProperty("elements");
  });
});
