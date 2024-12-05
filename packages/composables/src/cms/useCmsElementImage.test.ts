import { describe, expect, it } from "vitest";
import type { CmsElementImage, CmsElementManufacturerLogo } from "../types";
import { useCmsElementImage } from "./useCmsElementImage";

describe("useCmsElementImage", () => {
  describe("computed", () => {
    describe("containerStyle", () => {
      it("should return minHeight css property", () => {
        const { containerStyle } = useCmsElementImage({
          config: {
            minHeight: {
              value: "100px",
            },
          },
        } as CmsElementImage);

        expect(containerStyle.value).toEqual({ minHeight: "100px" });
      });
      it("should return anchorAttrs", () => {
        const { anchorAttrs } = useCmsElementImage({
          config: {
            url: {
              value: "https://shopware.com",
            },
            newTab: {
              value: true,
            },
          },
        } as CmsElementImage);

        expect(anchorAttrs.value).toEqual({
          href: "https://shopware.com",
          target: "_blank",
        });
      });

      it("should return default anchorAttrs", () => {
        const { anchorAttrs } = useCmsElementImage({
          config: {
            url: {
              value: "https://shopware.com",
            },
          },
        } as CmsElementImage);

        expect(anchorAttrs.value).toEqual({
          href: "https://shopware.com",
          target: "_self",
        });
      });

      it("should return imageContainerAttrs - absolute link", () => {
        const { imageContainerAttrs } = useCmsElementImage({
          data: {
            newTab: true,
            url: "https://shopware.com/logo.png",
          },
          config: {
            url: {
              value: "https://shopware.com",
            },
            newTab: {
              value: true,
            },
          },
        } as CmsElementImage);

        expect(imageContainerAttrs.value).toEqual({
          href: "https://shopware.com/logo.png",
          target: "blank",
          rel: "noopener noreferrer",
        });
      });

      it("should return imageContainerAttrs", () => {
        const { imageContainerAttrs } = useCmsElementImage({
          data: {
            newTab: true,
            url: "/logo.png",
          },
          config: {
            url: {
              value: "https://shopware.com",
            },
            newTab: {
              value: true,
            },
          },
        } as CmsElementImage);

        expect(imageContainerAttrs.value).toEqual({
          href: "/logo.png",
          target: "blank",
          rel: "noopener noreferrer",
        });
      });

      it("should return imageLink", () => {
        const { imageLink } = useCmsElementImage({
          data: {
            newTab: true,
            url: "https://shopware.com/logo.png",
          },
        } as CmsElementImage);

        expect(imageLink.value).toEqual({
          newTab: true,
          url: "https://shopware.com/logo.png",
        });
      });
      it("should return imageAttrs", () => {
        const { imageAttrs } = useCmsElementImage({
          data: {
            media: {
              url: "https://shopware.com/logo.png",
              fileName: "logo.png",
              thumbnails: [
                {
                  url: "https://shopware.com/logo-128px.png",
                  width: "128",
                },
              ],
            },
          },
        } as unknown as CmsElementManufacturerLogo);

        expect(imageAttrs.value).toEqual({
          alt: "",
          src: "https://shopware.com/logo.png",
          srcset: "https://shopware.com/logo-128px.png 128w",
        });
      });

      it("should return displayMode", () => {
        const { displayMode } = useCmsElementImage({
          config: {
            displayMode: {
              value: "contain",
            },
          },
        } as CmsElementImage);

        expect(displayMode.value).toEqual("contain");
      });

      it("should return default displayMode", () => {
        const { displayMode } = useCmsElementImage({
          config: {},
        } as CmsElementImage);

        expect(displayMode.value).toEqual("initial");
      });

      it("should return isVideoElement", () => {
        const { isVideoElement } = useCmsElementImage({
          data: {
            media: {
              mimeType: "video",
            },
          },
        } as CmsElementImage);

        expect(isVideoElement.value).toBeTruthy();
      });

      it("should return mimeType", () => {
        const { mimeType } = useCmsElementImage({
          data: {
            media: {
              mimeType: "image/png",
            },
          },
        } as CmsElementImage);

        expect(mimeType.value).toEqual("image/png");
      });
    });
  });
});
