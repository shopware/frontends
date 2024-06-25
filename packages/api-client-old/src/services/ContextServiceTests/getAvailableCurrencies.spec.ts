import { defaultInstance } from "../../apiService";
import { getAvailableCurrencies } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getAvailableCurrencies", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return array with currencies", async () => {
    mockedGet.mockResolvedValueOnce({ data: [{ iso: "EUR" }] });
    const result = await getAvailableCurrencies();
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/currency");
    expect(result).toEqual([{ iso: "EUR" }]);
  });
});
