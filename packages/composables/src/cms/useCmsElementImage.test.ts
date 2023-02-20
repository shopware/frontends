import { describe, expect, it } from "vitest";
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
        } as any);

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
        } as any);

        expect(anchorAttrs.value).toEqual({
          href: "https://shopware.com",
          target: "_blank",
        });
      });
      it("should return imageContainerAttrs", () => {
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
        } as any);

        expect(imageContainerAttrs.value).toEqual({
          href: "https://shopware.com/logo.png",
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
        } as any);

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
        } as any);

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
        } as any);

        expect(displayMode.value).toEqual("contain");
      });
    });
  });
});
