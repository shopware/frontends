import { defaultInstance } from "../../apiService";
import { getAvailablePaymentMethods } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getAvailablePaymentMethods", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return array with payment methods", async () => {
    mockedGet.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });

    const result = await getAvailablePaymentMethods();
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/payment-method", {
      params: {},
    });
    expect(result).toHaveLength(2);
  });
});
