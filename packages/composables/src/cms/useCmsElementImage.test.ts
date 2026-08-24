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

      it("should return imageContainerAttrs without url", () => {
        const { imageContainerAttrs } = useCmsElementImage({
          data: {
            newTab: false,
          },
        } as CmsElementImage);

        expect(imageContainerAttrs.value).toEqual({});
      });

      it("should return imageContainerAttrs with url but no newTab", () => {
        const { imageContainerAttrs } = useCmsElementImage({
          data: {
            url: "https://shopware.com/logo.png",
            newTab: false,
          },
        } as CmsElementImage);

        expect(imageContainerAttrs.value).toEqual({
          href: "https://shopware.com/logo.png",
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

      it("should use media alt for imageAttrs alt", () => {
        const { imageAttrs } = useCmsElementImage({
          data: {
            media: {
              url: "https://shopware.com/logo.png",
              alt: "Shopware logo",
            },
          },
        } as unknown as CmsElementImage);

        expect(imageAttrs.value.alt).toBe("Shopware logo");
      });

      it("should fall back to the element aria label when media has no alt", () => {
        const { imageAttrs, ariaLabel } = useCmsElementImage({
          data: {
            ariaLabel: "Go to the summer collection",
            media: {
              url: "https://shopware.com/banner.png",
            },
          },
        } as unknown as CmsElementImage);

        expect(ariaLabel.value).toBe("Go to the summer collection");
        expect(imageAttrs.value.alt).toBe("Go to the summer collection");
      });

      it("should read the aria label from config when data has none", () => {
        const { ariaLabel } = useCmsElementImage({
          config: {
            ariaLabel: {
              value: "Go to the sale",
            },
          },
        } as unknown as CmsElementImage);

        expect(ariaLabel.value).toBe("Go to the sale");
      });

      it("should return an empty aria label when neither data nor config has one", () => {
        const { ariaLabel } = useCmsElementImage({
          data: {},
          config: {},
        } as unknown as CmsElementImage);

        expect(ariaLabel.value).toBe("");
      });

      it("should drop alternative text when the image is decorative but keep the aria label", () => {
        const { imageAttrs, isDecorative, ariaLabel } = useCmsElementImage({
          data: {
            ariaLabel: "Go to the sale",
            media: {
              url: "https://shopware.com/pattern.png",
              alt: "ignored",
            },
          },
          config: {
            isDecorative: {
              value: true,
            },
          },
        } as unknown as CmsElementImage);

        expect(isDecorative.value).toBe(true);
        expect(imageAttrs.value.alt).toBe("");
        // a decorative image inside a link still needs the link named
        expect(ariaLabel.value).toBe("Go to the sale");
      });

      it("should not be decorative by default", () => {
        const { isDecorative } = useCmsElementImage({
          config: {},
        } as unknown as CmsElementImage);

        expect(isDecorative.value).toBe(false);
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
