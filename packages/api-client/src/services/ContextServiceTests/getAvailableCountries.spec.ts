import { defaultInstance } from "../../apiService";
import { getAvailableCountries } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getAvailableCountries", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return array with countries", async () => {
    mockedPost.mockResolvedValueOnce({ data: { total: 2 } });

    const result = await getAvailableCountries();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/country", {
      associations: {
        states: {},
      },
    });
    expect(result.total).toEqual(2);
  });
});
