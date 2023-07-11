import { getProduct } from "../productService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ProductService - getProduct", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return chosen product", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { product: { id: "044a190a54ab4f06803909c3ee8063ef" } },
    });
    const productId = "044a190a54ab4f06803909c3ee8063ef";
    const result = await getProduct(productId);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/product/044a190a54ab4f06803909c3ee8063ef",
      null,
    );
    expect(result.product?.id).toEqual(productId);
  });
});
