import { defaultInstance } from "../../apiService";
import { getAvailableCountries } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getAvailableCountries", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return array with countries", async () => {
    mockedGet.mockResolvedValueOnce({ data: { total: 2 } });

    const result = await getAvailableCountries();
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/country");
    expect(result.total).toEqual(2);
  });
});
