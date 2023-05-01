import { defaultInstance } from "../../apiService";
import { getAvailableShippingMethods } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getAvailableShippingMethods", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return array with shipping methods", async () => {
    mockedPost.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });

    const result = await getAvailableShippingMethods();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/shipping-method", {});
    expect(result).toHaveLength(2);
  });
});
