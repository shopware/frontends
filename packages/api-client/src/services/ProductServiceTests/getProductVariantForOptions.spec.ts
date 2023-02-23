import { getProductVariantForOptions } from "../productService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

const consoleWarnSpy = vi.spyOn(console, "warn");

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;
describe("ProductService - getProductVariantForOptions", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
    consoleWarnSpy.mockImplementation(() => {});
  });

  it("should make a request with provided arguments", async () => {
    await getProductVariantForOptions({
      productId: "product-id",
      optionIds: ["option-id-1", "option-id-2"],
      switchedGroup: "switched-group-id",
    });

    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/product/product-id/find-variant",
      {
        options: ["option-id-1", "option-id-2"],
        switchedGroup: "switched-group-id",
      }
    );
  });
  it("should return data with specific format", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { variantId: "found-variant-id", options: ["currentOption"] },
    });
    const response = await getProductVariantForOptions({
      productId: "some-id",
    } as any);

    expect(response).toStrictEqual({
      variantId: "found-variant-id",
      options: ["currentOption"],
    });
  });
});
