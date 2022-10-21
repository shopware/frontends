import { defaultInstance } from "../../apiService";
import { getUserCountry } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getUserCountry", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return user salutation object", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { elements: [{ name: "Poland" }] },
    });

    const countryId = "123123123";
    const result = await getUserCountry(countryId);
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/country", {
      params: { "filter[id]": countryId },
    });
    expect(result.name).toEqual("Poland");
  });
  it("should not return user salutation object if response does not contain any data", async () => {
    mockedGet.mockResolvedValueOnce({
      data: undefined,
    });

    const result = await getUserCountry("12345");

    expect(result).toBeUndefined();
  });
});
