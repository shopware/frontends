import { getSeoUrls } from "../pageService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("PageService - getSeoUrls", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return seoUrls for given path", async () => {
    mockedPost.mockResolvedValueOnce({
      data: [{ seoPathInfo: "/Sports/Grocery-Garden" }],
    });
    const result = await getSeoUrls("3223232321112257");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/seo-url", {
      filter: [
        {
          field: "foreignKey",
          type: "equals",
          value: "3223232321112257",
        },
      ],
      includes: {
        seo_url: ["seoPathInfo"],
      },
    });
    expect(result[0].seoPathInfo).toEqual("/Sports/Grocery-Garden");
  });
  it("should make a request with specific languageId if any provided", async () => {
    mockedPost.mockResolvedValueOnce({
      data: [{ seoPathInfo: "/Sports/Grocery-Garden" }],
    });
    await getSeoUrls("3223232321112257", "someLanguageId");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedApiInstance.defaults.headers.common["sw-language-id"]).toBe(
      "someLanguageId"
    );
    expect(mockedPost).toBeCalledWith("/store-api/seo-url", {
      filter: [
        {
          field: "foreignKey",
          type: "equals",
          value: "3223232321112257",
        },
      ],
      includes: {
        seo_url: ["seoPathInfo"],
      },
    });
  });
});
