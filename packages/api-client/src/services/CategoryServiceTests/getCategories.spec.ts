import { getCategories } from "../categoryService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

const consoleWarnSpy = vi.spyOn(console, "warn");

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CategoryService - getCategories", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
    consoleWarnSpy.mockImplementation(() => {});
  });
  it("should return array with categories", async () => {
    mockedPost.mockResolvedValueOnce({ data: { total: 22 } });

    const result = await getCategories();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/category", undefined);
    expect(result.total).toEqual(22);
  });
});
