import { defaultInstance } from "../../apiService";
import { getAvailableLanguages } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getAvailableLanguages", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return array with languages", async () => {
    mockedGet.mockResolvedValueOnce({ data: [{ id: 2, code: "en" }] });

    const result = await getAvailableLanguages();
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/language");
    expect(result).toEqual([{ id: 2, code: "en" }]);
  });
});
