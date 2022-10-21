import { defaultInstance } from "../../apiService";
import { getCategoryProducts } from "../productService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ProductService - getCategoryProducts", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return listing data with no searchCriteria", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { elements: [{ id: "044a190a54ab4f06803909c3ee8063ef" }] },
    });
    const categoryId = "044a190a54ab4f06803909c3ee8063ef";
    const result = await getCategoryProducts(categoryId);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/product-listing/044a190a54ab4f06803909c3ee8063ef",
      undefined
    );
    expect(result).toHaveProperty("elements");
  });
  it("should return listing data with searchCriteria provided", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { elements: [{ id: "044a190a54ab4f06803909c3ee8063ef" }] },
    });
    const categoryId = "044a190a54ab4f06803909c3ee8063ef";
    const result = await getCategoryProducts(categoryId, {
      limit: 10,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/product-listing/044a190a54ab4f06803909c3ee8063ef",
      { limit: 10 }
    );
    expect(result).toHaveProperty("elements");
  });
});
