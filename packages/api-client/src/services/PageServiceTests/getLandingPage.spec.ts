import { getLandingPage } from "../pageService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("PageService - getLandingPage", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return getLandingPage for given id", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { id: "b218f861361042f3a58a2a9d1b3575b5" },
    });
    const result = await getLandingPage("b218f861361042f3a58a2a9d1b3575b5");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/landing-page/b218f861361042f3a58a2a9d1b3575b5",
      undefined,
    );
    expect(result).toHaveProperty("id");
  });
  it("should return undefined in case of no data fetched from API", async () => {
    mockedPost.mockResolvedValueOnce(null as any);
    const result = await getLandingPage("b218f861361042f3a58a2a9d1b3575b5");
    expect(result).toBeUndefined();
  });
});
