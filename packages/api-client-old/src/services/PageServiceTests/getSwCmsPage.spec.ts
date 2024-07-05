import { getSwCmsPage } from "../pageService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("PageService - getSwCmsPage", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("should return getLandingPage for given id", async () => {
    mockedPost.mockResolvedValueOnce({});
    const result = await getSwCmsPage("idtest8888");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/cms/idtest8888");
  });
});
