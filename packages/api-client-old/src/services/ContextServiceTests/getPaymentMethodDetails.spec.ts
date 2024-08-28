import { defaultInstance } from "../../apiService";
import { getPaymentMethodDetails } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getPaymentMethodDetails", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return an object of specific payment method details", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        elements: [
          {
            id: "paypal",
          },
        ],
      },
    });

    const result = await getPaymentMethodDetails("paypal");
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/payment-method", {
      params: { "filter[id]": "paypal" },
    });
    expect(result).toHaveProperty("id");
  });
  it("should return undefined if the response does not contain specific data", async () => {
    mockedGet.mockResolvedValueOnce({
      data: undefined,
    });

    const result = await getPaymentMethodDetails("paypal");

    expect(result).toBeUndefined();
  });
});
