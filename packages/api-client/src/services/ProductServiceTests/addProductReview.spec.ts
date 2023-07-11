import { addProductReview } from "../productService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ProductService - addProductReview", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should invoke a specific POST call in order to add a review", async () => {
    const productId = "044a190a54ab4f06803909c3ee8063ef";
    const reviewData = {
      title: "Some title",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      points: 5,
    };

    const result = await addProductReview(
      productId,
      reviewData,
      mockedApiInstance,
    );
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/product/044a190a54ab4f06803909c3ee8063ef/review",
      reviewData,
    );
    expect(result).toBeUndefined();
  });
  it("should invoke a specific POST call using default API instance", async () => {
    const productId = "044a190a54ab4f06803909c3ee8063ef";
    const reviewData = {
      title: "Some title",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      points: 5,
    };

    await addProductReview(productId, reviewData);
  });
});
