import { getCategory } from "../categoryService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CategoryService - getCategory", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return chosen category - without associated products by default", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        id: "3a64e872ca404522a2c5d43ebc751e6b",
        products: null,
      },
    });
    const categoryId = "3a64e872ca404522a2c5d43ebc751e6b";
    const result = await getCategory(categoryId);
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith(
      "/store-api/category/3a64e872ca404522a2c5d43ebc751e6b",
    );
    expect(result).toHaveProperty("id");
    expect(result.id).toEqual(categoryId);
    expect(result).toHaveProperty("products");
    expect(result.products).toBeNull();
  });
});
