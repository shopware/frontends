import { describe, expect, it } from "vitest";
import { getProductThumbnailUrl } from "./getProductThumbnailUrl";

describe("Helpers - getProductThumbnailUrl", () => {
  it("should return the smallest thumbnail contained in thumbnails array", () => {
    const product = {
      cover: {
        media: {
          url: "https://shopware.test/media/image.jpg",
          thumbnails: [
            {
              width: 1920,
              height: 1920,
              url: "https://shopware.test/media/image_1920x1920.jpg",
            },
            {
              width: 500,
              height: 500,
              url: "https://shopware.test/media/image_500x500.jpg",
            },
          ],
        },
      },
    };
    const coverUrl = getProductThumbnailUrl(product);
    expect(coverUrl).toEqual("https://shopware.test/media/image_500x500.jpg");
  });

  it("should return the smallest thumbnail contained in thumbnails array", () => {
    const product = {
      cover: {
        media: {
          url: "https://shopware.test/media/image.jpg",
          thumbnails: [
            {
              width: 500,
              height: 500,
              url: "https://shopware.test/media/image_500x500.jpg",
            },
            {
              width: 1920,
              height: 500,
              url: "https://shopware.test/media/image_1920x500.jpg",
            },
          ],
        },
      },
    };
    const coverUrl = getProductThumbnailUrl(product);
    expect(coverUrl).toEqual("https://shopware.test/media/image_500x500.jpg");
  });

  it("should return the main media url as a fallback if there is no thumbnail in the list", () => {
    const product = {
      cover: {
        media: {
          url: "https://shopware.test/media/image.jpg",
          thumbnails: null,
        },
      },
    };
    // @ts-expect-error type should be wrong here
    const coverUrl = getProductThumbnailUrl(product);
    expect(coverUrl).toEqual("https://shopware.test/media/image.jpg");
  });

  it("should return empty string as a fallback if the thumbnails array can't be reached", () => {
    const product = {
      cover: {},
    };
    const coverUrl = getProductThumbnailUrl(product);
    expect(coverUrl).toEqual("");
  });

  it("should return null for product without cover media, cover or thumnails", () => {
    const emptyProduct = {};
    const coverUrl = getProductThumbnailUrl(emptyProduct);
    expect(coverUrl).toEqual("");
  });

  it("should return default negative value if argument wasn't provided", () => {
    // @ts-expect-error type should be wrong here
    const coverUrl = getProductThumbnailUrl(undefined);
    expect(coverUrl).toEqual("");
  });

  it("should return default value if product was null", () => {
    const argument = null;
    // @ts-expect-error type should be wrong here
    const coverUrl = getProductThumbnailUrl(argument);
    expect(coverUrl).toEqual("");
  });
  it("should return default value if product cover.media has no thumnbails in array", () => {
    const argument = {
      cover: {
        media: {
          url: "https://shopware-pwa.com/image.png",
          thumbnails: [],
        },
      },
    };
    const coverUrl = getProductThumbnailUrl(argument);
    expect(coverUrl).toEqual("https://shopware-pwa.com/image.png");
  });
});
