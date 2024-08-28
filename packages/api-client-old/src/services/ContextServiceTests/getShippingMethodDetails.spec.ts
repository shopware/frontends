import { defaultInstance } from "../../apiService";
import { getShippingMethodDetails } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getShippingMethodDetails", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return an object of specific shipping method details", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        elements: [
          {
            id: "dhl",
          },
        ],
      },
    });

    const result = await getShippingMethodDetails("dhl");
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/shipping-method", {
      params: { "filter[id]": "dhl" },
    });
    expect(result).toHaveProperty("id");
    expect(result.id).toBe("dhl");
  });
  it("should return undefined if the response does not contain specific data", async () => {
    mockedGet.mockResolvedValueOnce({
      data: undefined,
    });

    const result = await getShippingMethodDetails("dhl");
    expect(result).toBeUndefined();
  });
});
