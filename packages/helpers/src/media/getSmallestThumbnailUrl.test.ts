import { describe, expect, it } from "vitest";
import { getSmallestThumbnailUrl } from "./getSmallestThumbnailUrl";

describe("getSmallestThumbnailUrl", () => {
  it("should return undefined if media is undefined", () => {
    const result = getSmallestThumbnailUrl(undefined);
    expect(result).toBeUndefined();
  });

  it("should return undefined if media has no thumbnails and no url", () => {
    const media = {};
    const result = getSmallestThumbnailUrl(media);
    expect(result).toBeUndefined();
  });

  it("should return media.url when media has no thumbnails but has url", () => {
    const media = { url: "fallback.jpg" };
    const result = getSmallestThumbnailUrl(media);
    expect(result).toBe("fallback.jpg");
  });

  it("should return media.url when media has empty thumbnails array but has url", () => {
    const media = { thumbnails: [], url: "main.jpg" };
    const result = getSmallestThumbnailUrl(media);
    expect(result).toBe("main.jpg");
  });

  it("should return the URL of the smallest thumbnail", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "thumbnail1.jpg" },
        { width: 200, url: "thumbnail2.jpg" },
        { width: 50, url: "thumbnail3.jpg" },
      ],
    };
    const result = getSmallestThumbnailUrl(media);
    expect(result).toBe("thumbnail3.jpg");
  });

  it("should return the URL of the only thumbnail if there is only one", () => {
    const media = {
      thumbnails: [{ width: 100, url: "thumbnail.jpg" }],
    };
    const result = getSmallestThumbnailUrl(media);
    expect(result).toBe("thumbnail.jpg");
  });
});
