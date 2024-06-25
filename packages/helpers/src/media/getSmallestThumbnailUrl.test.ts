import { describe, expect, it } from "vitest";
import { getSmallestThumbnailUrl } from "./getSmallestThumbnailUrl";

describe("getSmallestThumbnailUrl", () => {
  it("should return undefined if media is undefined", () => {
    const result = getSmallestThumbnailUrl(undefined);
    expect(result).toBeUndefined();
  });

  it("should return undefined if media has no thumbnails", () => {
    const media = {};
    const result = getSmallestThumbnailUrl(media);
    expect(result).toBeUndefined();
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
