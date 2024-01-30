import { describe, expect, it } from "vitest";
import { getBiggestThumbnailUrl } from "./image";

describe("getBiggestThumbnailUrl", () => {
  it("should return undefined if media is undefined", () => {
    const result = getBiggestThumbnailUrl(undefined);
    expect(result).toBeUndefined();
  });

  it("should return undefined if media has no thumbnails", () => {
    const media = {};
    const result = getBiggestThumbnailUrl(media);
    expect(result).toBeUndefined();
  });

  it("should return the URL of the biggest thumbnail", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "thumbnail1.jpg" },
        { width: 200, url: "thumbnail2.jpg" },
        { width: 150, url: "thumbnail3.jpg" },
      ],
    };
    const result = getBiggestThumbnailUrl(media);
    expect(result).toBe("thumbnail2.jpg");
  });

  it("should return the URL of the only thumbnail if there is only one", () => {
    const media = {
      thumbnails: [{ width: 100, url: "thumbnail.jpg" }],
    };
    const result = getBiggestThumbnailUrl(media);
    expect(result).toBe("thumbnail.jpg");
  });
});
