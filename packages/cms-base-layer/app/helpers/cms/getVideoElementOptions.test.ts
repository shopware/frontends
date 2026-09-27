import type { CmsElementVideo } from "@shopware/composables";
import { describe, expect, it } from "vitest";

import { getVideoElementOptions } from "./getVideoElementOptions";

type Config = Record<string, unknown>;

const media = {
  url: "https://shop.test/media/intro.mp4",
  mimeType: "video/mp4",
  alt: "Alt",
  title: "Title",
  translated: { alt: "Translated alt", title: "Translated title" },
  extensions: {
    videoCoverMedia: { url: "https://shop.test/media/intro-cover.jpg" },
  },
};

const element = (
  config: Config = {},
  data: Partial<CmsElementVideo["data"]> = {},
) =>
  ({
    type: "video",
    config: Object.fromEntries(
      Object.entries(config).map(([key, value]) => [
        key,
        { source: "static", value },
      ]),
    ),
    data: { apiAlias: "cms_video", media, ...data },
  }) as unknown as CmsElementVideo;

describe("getVideoElementOptions", () => {
  describe("media", () => {
    it("plays the resolved media", () => {
      const options = getVideoElementOptions(element());

      expect(options.src).toBe("https://shop.test/media/intro.mp4");
      expect(options.mimeType).toBe("video/mp4");
    });

    it("has no source when no media resolved", () => {
      expect(
        getVideoElementOptions(element({}, { media: null })).src,
      ).toBeUndefined();
    });
  });

  describe("displayMode", () => {
    it.each(["standard", "stretch", "cover"])("accepts %s", (displayMode) => {
      expect(getVideoElementOptions(element({ displayMode })).displayMode).toBe(
        displayMode,
      );
    });

    it("falls back to standard for a missing or unknown value", () => {
      expect(getVideoElementOptions(element()).displayMode).toBe("standard");
      expect(
        getVideoElementOptions(element({ displayMode: "contain" })).displayMode,
      ).toBe("standard");
    });

    it("applies the minimum height to cover only", () => {
      expect(
        getVideoElementOptions(
          element({ displayMode: "cover", minHeight: "400px" }),
        ).minHeight,
      ).toBe("400px");
      expect(
        getVideoElementOptions(
          element({ displayMode: "standard", minHeight: "400px" }),
        ).minHeight,
      ).toBeUndefined();
    });
  });

  describe("alignment", () => {
    it("reads both alignments", () => {
      const options = getVideoElementOptions(
        element({ verticalAlign: "flex-end", horizontalAlign: "center" }),
      );

      expect(options.verticalAlign).toBe("flex-end");
      expect(options.horizontalAlign).toBe("center");
    });

    it("ignores both alignments for cover, which fills the element", () => {
      const options = getVideoElementOptions(
        element({
          displayMode: "cover",
          verticalAlign: "flex-end",
          horizontalAlign: "center",
        }),
      );

      expect(options.verticalAlign).toBeUndefined();
      expect(options.horizontalAlign).toBeUndefined();
    });

    it("drops an empty or unknown alignment", () => {
      const options = getVideoElementOptions(
        element({ verticalAlign: "", horizontalAlign: "left" }),
      );

      expect(options.verticalAlign).toBeUndefined();
      expect(options.horizontalAlign).toBeUndefined();
    });
  });

  describe("playback", () => {
    it("maps the playback switches", () => {
      expect(
        getVideoElementOptions(
          element({
            autoPlay: false,
            muted: true,
            loop: true,
            playsInline: true,
            showControls: true,
          }),
        ),
      ).toMatchObject({
        autoplay: false,
        muted: true,
        loop: true,
        playsInline: true,
        controls: true,
        preload: "auto",
      });
    });

    it("leaves every switch off when it is not configured", () => {
      expect(getVideoElementOptions(element())).toMatchObject({
        autoplay: false,
        muted: false,
        loop: false,
        playsInline: false,
        controls: false,
      });
    });

    it("mutes an autoplaying video", () => {
      expect(
        getVideoElementOptions(element({ autoPlay: true, muted: false })),
      ).toMatchObject({ autoplay: true, muted: true });
    });
  });

  describe("load only after confirmation", () => {
    it("shows the cover, loads nothing up front and does not autoplay", () => {
      expect(
        getVideoElementOptions(element({ showCover: true, autoPlay: true })),
      ).toMatchObject({
        poster: "https://shop.test/media/intro-cover.jpg",
        preload: "none",
        autoplay: false,
        muted: false,
      });
    });

    it("waits for the visitor even when the video has no cover", () => {
      const options = getVideoElementOptions(
        element(
          { showCover: true },
          {
            media: {
              ...media,
              extensions: {},
            } as CmsElementVideo["data"]["media"],
          },
        ),
      );

      expect(options.poster).toBeUndefined();
      expect(options.preload).toBe("none");
    });

    it("does not use the cover without the option", () => {
      expect(getVideoElementOptions(element()).poster).toBeUndefined();
    });
  });

  describe("accessible name", () => {
    it("prefers the resolved screen reader title", () => {
      const options = getVideoElementOptions(
        element({ ariaLabel: "From config" }, { ariaLabel: " From data " }),
      );

      expect(options.ariaLabel).toBe("From data");
      expect(options.title).toBe("From data");
    });

    it("falls back to the configured screen reader title", () => {
      const options = getVideoElementOptions(
        element({ ariaLabel: "From config" }),
      );

      expect(options.ariaLabel).toBe("From config");
      expect(options.title).toBe("From config");
    });

    it("falls back to the media alt text and title", () => {
      const options = getVideoElementOptions(element({ ariaLabel: "  " }));

      expect(options.ariaLabel).toBe("Translated alt");
      expect(options.title).toBe("Translated title");
    });

    it("has no name when nothing provides one", () => {
      const options = getVideoElementOptions(
        element(
          {},
          {
            media: {
              ...media,
              alt: "",
              title: "",
              translated: {},
            } as CmsElementVideo["data"]["media"],
          },
        ),
      );

      expect(options.ariaLabel).toBeUndefined();
      expect(options.title).toBeUndefined();
    });

    it("ignores a mapped config value", () => {
      const mapped = element();
      mapped.config.ariaLabel = { source: "mapped", value: "media.title" };

      expect(getVideoElementOptions(mapped).ariaLabel).toBe("Translated alt");
    });
  });
});
