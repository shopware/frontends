import { describe, expect, it } from "vitest";
import { getMedia } from "./getMedia";

describe("getMedia", () => {
  it("should return an empty array if lineItem is undefined", () => {
    const lineItem = undefined;
    // @ts-expect-error - intentionally passing undefined
    const result = getMedia(lineItem);
    expect(result).toEqual([]);
  });

  it("should return an empty array if lineItem.downloads is undefined", () => {
    const lineItem = {};
    const result = getMedia(lineItem);
    expect(result).toEqual([]);
  });

  it("should return an empty array if lineItem.downloads is an empty array", () => {
    const lineItem = { downloads: [] };
    const result = getMedia(lineItem);
    expect(result).toEqual([]);
  });

  it("should return an array of ProductMedia objects", () => {
    const lineItem = {
      downloads: [
        {
          id: "1",
          accessGranted: true,
          media: {
            fileName: "image",
            fileExtension: "jpg",
          },
        },
        {
          id: "2",
          accessGranted: false,
          media: {
            fileName: "video",
            fileExtension: "mp4",
          },
        },
      ],
    };
    const result = getMedia(lineItem);
    expect(result).toEqual([
      {
        id: "1",
        fileName: "image.jpg",
        accessGranted: true,
      },
      {
        id: "2",
        fileName: "video.mp4",
        accessGranted: false,
      },
    ]);
  });
});
