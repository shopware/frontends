import { describe, expect, it } from "vitest";
import { getSrcSetForMedia } from "./image";

describe("getSrcSetForMedia", () => {
  it("should return an empty string if media is undefined", () => {
    const result = getSrcSetForMedia(undefined);
    expect(result).toEqual("");
  });

  it("should return an empty string if media.thumbnails is undefined", () => {
    const media = {};
    const result = getSrcSetForMedia(media);
    expect(result).toEqual("");
  });

  it("should return an empty string if media.thumbnails is an empty array", () => {
    const media = { thumbnails: [] };
    const result = getSrcSetForMedia(media);
    expect(result).toEqual("");
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
});
