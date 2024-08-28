import { getSitemap } from "../sitemapService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("SitemapService - getSitemap", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });

  it("should return sitemap links", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: {} } });
    const result = await getSitemap();
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith(`/store-api/sitemap`);
    expect(result).toMatchObject({});
  });
});
