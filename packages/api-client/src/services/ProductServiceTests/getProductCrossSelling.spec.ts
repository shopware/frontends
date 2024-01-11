import { getProductCrossSelling } from "../productService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ProductService - getProductCrossSelling", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return chosen product", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { crossSelling: { name: "my crossselling" } },
    });
    const productId = "044a190a54ab4f06803909c3ee8063ef";
    const result = await getProductCrossSelling(productId);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/product/044a190a54ab4f06803909c3ee8063ef/cross-selling",
      null,
    );
    expect(result.crossSelling.name).toEqual("my crossselling");
  });
});
