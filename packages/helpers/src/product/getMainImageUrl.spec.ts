import { getMainImageUrl } from "./getMainImageUrl";
import { describe, expect, it } from "vitest";
import type { Product, LineItem } from "@shopware-pwa/types";

describe("Helpers - getMainImageUrl", () => {
  const mediaUrl =
    "https://shopware.test/media/8a/fd/cb/1572351035/msh06-gray_main_2.jpg";

  it("should contain url from first media gallery as a fallback if cover does not exist", () => {
    const product: Product = {
      media: [
        {
          media: {
            url: "fallback-url",
          },
        },
      ],
      apiAlias: "product",
    } as Product;
    const coverUrl = getMainImageUrl(product);
    expect(coverUrl).toEqual("fallback-url");
  });

  it("should contain url in nested media object", () => {
    const product = {
      cover: {
        media: {
          url: mediaUrl,
        },
      },
      apiAlias: "product",
    };
    const coverUrl = getMainImageUrl(product as Product);
    expect(coverUrl).toEqual(mediaUrl);
  });

  it("should contain url in nested cover object when lineItem", () => {
    const lineItem = {
      cover: {
        url: mediaUrl,
      },
    };
    const coverUrl = getMainImageUrl(lineItem as LineItem);
    expect(coverUrl).toEqual(mediaUrl);
  });

  it("should contain empty string when there is no media gallery or cover", () => {
    const product = {
      apiAlias: "product",
    };
    const coverUrl = getMainImageUrl(product as Product);
    expect(coverUrl).toEqual("");
  });

  it("Should take the url from the media object first", () => {
    const product = {
      cover: {
        url: "https://shopware.test/media/8a/fd/cb/1572351035/msh06-gray_main_1.jpg",
        media: {
          url: mediaUrl,
        },
      },
      apiAlias: "product",
    };
    const coverUrl = getMainImageUrl(product as any);
    expect(coverUrl).toEqual(mediaUrl);
  });

  it("should return null for product without cover media and cover url", () => {
    const emptyProduct = {};
    const coverUrl = getMainImageUrl(emptyProduct as Product);
    expect(coverUrl).toEqual("");
  });

  it("should return default negative value if argument wasn't provided", () => {
    const coverUrl = getMainImageUrl(undefined as any);
    expect(coverUrl).toEqual("");
  });

  it("should return default value if product was null", () => {
    const argument: any = null;
    const coverUrl = getMainImageUrl(argument);
    expect(coverUrl).toEqual("");
  });

  it("should return empty string if cover.media is defined but url is not", () => {
    const product = {
      cover: {
        media: {
          url: undefined,
        },
      },
    };
    const coverUrl = getMainImageUrl(product as Product);
    expect(coverUrl).toEqual("");
  });

  it("should return empty string if cover is defined but url is not", () => {
    const product = {
      cover: {
        url: undefined,
      },
    };
    const coverUrl = getMainImageUrl(product as LineItem);
    expect(coverUrl).toEqual("");
  });

  it("should return empty string if media is defined but url is not", () => {
    const product = {
      media: [
        {
          media: {
            url: undefined,
          },
        },
      ],
    };
    const coverUrl = getMainImageUrl(product as Product);
    expect(coverUrl).toEqual("");
  });
});
