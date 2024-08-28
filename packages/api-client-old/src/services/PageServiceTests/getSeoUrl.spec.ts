import { getSeoUrl } from "../pageService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("PageService - getSeoUrl", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return seo url entities for given criteria", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { elements: [{ id: "b218f861361042f3a58a2a9d1b3575b5" }] },
    });
    const result = await getSeoUrl({
      limit: 3,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/seo-url", {
      limit: 3,
    });
    expect(result).toHaveProperty("elements");
  });
});
