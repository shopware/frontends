import type { CmsElementVideo } from "@shopware/composables";
import { describe, expect, it } from "vitest";

import {
  getVideoAttributes,
  getVideoElementOptions,
  getVideoToggleAttributes,
} from "./getVideoElementOptions";
import type { VideoElementOptions } from "./getVideoElementOptions";

type Config = Partial<Record<keyof CmsElementVideo["config"], unknown>>;

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
    data: {
      apiAlias: "cms_video",
      media,
      ariaLabel: "ariaLabel" in config ? String(config.ariaLabel ?? "") : null,
      ...data,
    },
  }) as unknown as CmsElementVideo;

const withMedia = (overrides: Record<string, unknown>) => ({
  media: { ...media, ...overrides } as CmsElementVideo["data"]["media"],
});

describe("getVideoElementOptions", () => {
  describe("media", () => {
    it("plays the resolved media", () => {
      const options = getVideoElementOptions(element());

      expect(options.src).toBe("https://shop.test/media/intro.mp4");
      expect(options.mimeType).toBe("video/mp4");
      expect(options.preload).toBe("auto");
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
    const switchesOf = ({
      muted,
      loop,
      playsInline,
      controls,
    }: VideoElementOptions) => ({ muted, loop, playsInline, controls });

    it.each([
      ["muted", "muted"],
      ["loop", "loop"],
      ["playsInline", "playsInline"],
      ["showControls", "controls"],
    ] as const)("maps %s to %s and nothing else", (configKey, optionKey) => {
      expect(
        switchesOf(getVideoElementOptions(element({ [configKey]: true }))),
      ).toEqual({
        muted: false,
        loop: false,
        playsInline: false,
        controls: false,
        [optionKey]: true,
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
        element({ showCover: true }, withMedia({ extensions: {} })),
      );

      expect(options.poster).toBeUndefined();
      expect(options.preload).toBe("none");
    });

    it("does not use the cover without the option", () => {
      expect(getVideoElementOptions(element()).poster).toBeUndefined();
    });

    it("reserves a 16:9 box for a stretched video without a cover", () => {
      expect(
        getVideoElementOptions(
          element(
            { showCover: true, displayMode: "stretch" },
            withMedia({ extensions: {} }),
          ),
        ).placeholderAspectRatio,
      ).toBe("auto 16 / 9");
    });

    it.each([
      ["the cover sizes it", { showCover: true, displayMode: "stretch" }, {}],
      [
        "it is a standard video",
        { showCover: true, displayMode: "standard" },
        withMedia({ extensions: {} }),
      ],
      [
        "it covers the element",
        { showCover: true, displayMode: "cover" },
        withMedia({ extensions: {} }),
      ],
      [
        "its metadata preloads",
        { displayMode: "stretch" },
        withMedia({ extensions: {} }),
      ],
    ])("reserves no box when %s", (_, config, data) => {
      expect(
        getVideoElementOptions(element(config, data)).placeholderAspectRatio,
      ).toBeUndefined();
    });
  });

  describe("accessible name", () => {
    it("uses the screen reader title", () => {
      const options = getVideoElementOptions(
        element({ ariaLabel: " Product demo " }),
      );

      expect(options.ariaLabel).toBe("Product demo");
      expect(options.title).toBe("Product demo");
    });

    it("falls back to the media alt text and title", () => {
      const options = getVideoElementOptions(element({ ariaLabel: null }));

      expect(options.ariaLabel).toBe("Translated alt");
      expect(options.title).toBe("Translated title");
    });

    it("trims the media alt text and title", () => {
      const options = getVideoElementOptions(
        element(
          {},
          withMedia({ translated: { alt: "  Alt  ", title: " Title " } }),
        ),
      );

      expect(options.ariaLabel).toBe("Alt");
      expect(options.title).toBe("Title");
    });

    it("has no name when nothing provides one", () => {
      const options = getVideoElementOptions(
        element(
          { ariaLabel: "  " },
          withMedia({
            alt: "",
            title: "",
            translated: { alt: " ", title: "" },
          }),
        ),
      );

      expect(options.ariaLabel).toBeUndefined();
      expect(options.title).toBeUndefined();
    });

    it("ignores a mapped screen reader title, which arrives as the mapping path", () => {
      const mapped = element({}, { ariaLabel: "media.title" });
      mapped.config.ariaLabel = { source: "mapped", value: "media.title" };

      expect(getVideoElementOptions(mapped).ariaLabel).toBe("Translated alt");
    });
  });
});

describe("getVideoAttributes", () => {
  it("renders no playsinline attribute when inline playback is off", () => {
    expect(
      getVideoAttributes(getVideoElementOptions(element())).playsinline,
    ).toBeUndefined();
    expect(
      getVideoAttributes(getVideoElementOptions(element({ playsInline: true })))
        .playsinline,
    ).toBe(true);
  });

  it("passes the options on to the video", () => {
    expect(
      getVideoAttributes(
        getVideoElementOptions(
          element({ autoPlay: true, loop: true, ariaLabel: "Product demo" }),
        ),
      ),
    ).toEqual({
      preload: "auto",
      poster: undefined,
      autoplay: true,
      muted: true,
      loop: true,
      playsinline: undefined,
      controls: false,
      "aria-label": "Product demo",
      title: "Product demo",
    });
  });
});

describe("getVideoToggleAttributes", () => {
  const labels = {
    playLabel: "Play video",
    pauseLabel: "Pause video",
    loadError: "The video could not be loaded.",
  };
  const state = { isPlaying: false, hasFailed: false, videoId: "video-1" };
  const unnamed = getVideoElementOptions(
    element(
      {},
      withMedia({ alt: "", title: "", translated: { alt: "", title: "" } }),
    ),
  );

  it("adds nothing when the video shows its controls", () => {
    expect(
      getVideoToggleAttributes(
        getVideoElementOptions(element({ showControls: true })),
        state,
        labels,
      ),
    ).toEqual({});
  });

  it("names the button after what it does", () => {
    expect(getVideoToggleAttributes(unnamed, state, labels)).toEqual({
      role: "button",
      tabindex: 0,
      "aria-label": "Play video",
      "aria-describedby": undefined,
      "aria-disabled": undefined,
      title: "Play video",
    });
    expect(
      getVideoToggleAttributes(unnamed, { ...state, isPlaying: true }, labels)[
        "aria-label"
      ],
    ).toBe("Pause video");
  });

  it("keeps the action in the name of a named video and describes it by the video", () => {
    const named = getVideoElementOptions(
      element({ ariaLabel: "Product demo" }),
    );

    expect(
      getVideoToggleAttributes(named, { ...state, isPlaying: true }, labels),
    ).toMatchObject({
      "aria-label": "Pause video",
      "aria-describedby": "video-1",
      title: "Product demo",
    });
  });

  it("reports a video that failed to load and stays focusable", () => {
    expect(
      getVideoToggleAttributes(
        getVideoElementOptions(element({ ariaLabel: "Product demo" })),
        { ...state, hasFailed: true },
        labels,
      ),
    ).toEqual({
      role: "button",
      tabindex: 0,
      "aria-label": "The video could not be loaded.",
      "aria-describedby": "video-1",
      "aria-disabled": true,
      title: "The video could not be loaded.",
    });
  });
});
