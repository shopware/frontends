import { getCmsPage } from "../pageService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("PageService - getCmsPage", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return cmsPage for given path", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { cmsPage: { id: "b218f861361042f3a58a2a9d1b3575b5" } },
    });
    const result = await getCmsPage("Sports/Grocery-Garden");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/pwa/page", {
      path: "Sports/Grocery-Garden",
    });
    expect(result).toHaveProperty("cmsPage");
    expect(result.cmsPage.id).toEqual("b218f861361042f3a58a2a9d1b3575b5");
  });

  it("should invoke search with criteria", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { cmsPage: { id: "b218f861361042f3a58a2a9d1b3575b5" } },
    });
    await getCmsPage("Sports/Grocery-Garden", {
      p: 2,
      limit: 3,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/pwa/page", {
      path: "Sports/Grocery-Garden",
      p: 2,
      limit: 3,
    });
  });
});
