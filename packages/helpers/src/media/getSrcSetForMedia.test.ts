import { describe, expect, it } from "vitest";
import { encodeUrlPath, getSrcSetForMedia } from "./getSrcSetForMedia";

describe("getSrcSetForMedia", () => {
  it("should return an empty string if media is undefined", () => {
    const result = getSrcSetForMedia(undefined);
    expect(result).toBeUndefined();
  });

  it("should return an empty string if media.thumbnails is undefined", () => {
    const media = {};
    const result = getSrcSetForMedia(media);
    expect(result).toBeUndefined();
  });

  it("should return an empty string if media.thumbnails is an empty array", () => {
    const media = { thumbnails: [] };
    const result = getSrcSetForMedia(media);
    expect(result).toBeUndefined();
  });

  it("should return the srcset only for media that contains a proper url defined", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "image1.jpg" },
        { width: 200, url: "" },
        { width: 300, url: "" },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual("image1.jpg 100w");
  });

  it("should return the correct srcset string if media.thumbnails is not empty", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "image1.jpg" },
        { width: 200, url: "image2.jpg" },
        { width: 300, url: "image3.jpg" },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual("image1.jpg 100w, image2.jpg 200w, image3.jpg 300w");
  });

  it("should encode URLs with spaces in the path", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "https://example.com/path with spaces/image.jpg" },
        { width: 200, url: "https://example.com/another path/image.jpg" },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual(
      "https://example.com/path%20with%20spaces/image.jpg 100w, https://example.com/another%20path/image.jpg 200w",
    );
  });

  it("should encode URLs with commas in the path", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "https://example.com/path,with,commas/image.jpg" },
        { width: 200, url: "https://example.com/file,name.jpg" },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual(
      "https://example.com/path%2Cwith%2Ccommas/image.jpg 100w, https://example.com/file%2Cname.jpg 200w",
    );
  });

  it("should encode URLs with special characters (spaces, commas, parentheses)", () => {
    const media = {
      thumbnails: [
        {
          width: 100,
          url: "https://example.com/path/image (1).jpg",
        },
        {
          width: 200,
          url: "https://example.com/file name, test.jpg",
        },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual(
      "https://example.com/path/image%20(1).jpg 100w, https://example.com/file%20name%2C%20test.jpg 200w",
    );
  });

  it("should handle already encoded URLs correctly", () => {
    const media = {
      thumbnails: [
        {
          width: 100,
          url: "https://example.com/path%20with%20spaces/image.jpg",
        },
        { width: 200, url: "https://example.com/file%2Cname.jpg" },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual(
      "https://example.com/path%20with%20spaces/image.jpg 100w, https://example.com/file%2Cname.jpg 200w",
    );
  });

  it("should preserve query parameters and fragments in URLs", () => {
    const media = {
      thumbnails: [
        {
          width: 100,
          url: "https://example.com/image.jpg?width=100&height=200",
        },
        { width: 200, url: "https://example.com/image.jpg#fragment" },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual(
      "https://example.com/image.jpg?width=100&height=200 100w, https://example.com/image.jpg#fragment 200w",
    );
  });

  it("should handle invalid URLs gracefully", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "not a valid url with spaces" },
        { width: 200, url: "image2.jpg" },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual("not a valid url with spaces 100w, image2.jpg 200w");
  });

  it("should handle mixed valid and encoded URLs", () => {
    const media = {
      thumbnails: [
        { width: 100, url: "https://example.com/normal/image.jpg" },
        { width: 200, url: "https://example.com/path with space/image.jpg" },
        {
          width: 300,
          url: "https://example.com/path%20already%20encoded/image.jpg",
        },
      ],
    };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual(
      "https://example.com/normal/image.jpg 100w, https://example.com/path%20with%20space/image.jpg 200w, https://example.com/path%20already%20encoded/image.jpg 300w",
    );
  });
});

describe("encodeUrlPath", () => {
  it("should encode commas in pathname", () => {
    const result = encodeUrlPath("https://example.com/path/image, test.jpg");
    expect(result).toBe("https://example.com/path/image%2C%20test.jpg");
  });

  it("should encode spaces in pathname", () => {
    const result = encodeUrlPath("https://example.com/path/image test.jpg");
    expect(result).toBe("https://example.com/path/image%20test.jpg");
  });

  it("should encode special characters in filename", () => {
    const result = encodeUrlPath(
      "https://cdn.shopware.store/media/ChatGPT Image 2 gru 2025, 14_08_58.png",
    );
    expect(result).toBe(
      "https://cdn.shopware.store/media/ChatGPT%20Image%202%20gru%202025%2C%2014_08_58.png",
    );
  });

  it("should handle already encoded URLs correctly", () => {
    const result = encodeUrlPath("https://example.com/path/image%20test.jpg");
    expect(result).toBe("https://example.com/path/image%20test.jpg");
  });

  it("should encode parentheses in pathname", () => {
    const result = encodeUrlPath("https://example.com/path/image (1).jpg");
    expect(result).toBe("https://example.com/path/image%20(1).jpg");
  });

  it("should preserve query parameters", () => {
    const result = encodeUrlPath(
      "https://example.com/image.jpg?width=100&height=200",
    );
    expect(result).toBe("https://example.com/image.jpg?width=100&height=200");
  });

  it("should preserve fragments", () => {
    const result = encodeUrlPath("https://example.com/image.jpg#section");
    expect(result).toBe("https://example.com/image.jpg#section");
  });

  it("should handle invalid URLs gracefully", () => {
    const result = encodeUrlPath("not a valid url with spaces");
    expect(result).toBe("not a valid url with spaces");
  });

  it("should not double-encode already encoded characters", () => {
    const result = encodeUrlPath("https://example.com/path/image%2Ctest.jpg");
    expect(result).toBe("https://example.com/path/image%2Ctest.jpg");
  });
});
