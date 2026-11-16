import { describe, expect, it } from "vitest";

import { getVimeoVideoUrl, getYoutubeVideoUrl } from "./videoEmbedUrl";

describe("getYoutubeVideoUrl", () => {
  it("builds the default embed url with related videos off, controls and keyboard disabled", () => {
    expect(getYoutubeVideoUrl({ videoID: "abc123", showControls: true })).toBe(
      "https://www.youtube.com/embed/abc123?rel=0&controls=1&disablekb=1",
    );
  });

  it("uses the nocookie domain in advanced privacy mode", () => {
    expect(
      getYoutubeVideoUrl({
        videoID: "abc123",
        showControls: true,
        advancedPrivacyMode: true,
      }),
    ).toBe(
      "https://www.youtube-nocookie.com/embed/abc123?rel=0&controls=1&disablekb=1",
    );
  });

  it("loops through a single-video playlist and hides controls", () => {
    expect(
      getYoutubeVideoUrl({
        videoID: "abc123",
        loop: true,
        showControls: false,
      }),
    ).toBe(
      "https://www.youtube.com/embed/abc123?rel=0&loop=1&playlist=abc123&controls=0&disablekb=1",
    );
  });

  it("adds start and end only for non-zero timestamps", () => {
    expect(
      getYoutubeVideoUrl({
        videoID: "abc123",
        showControls: true,
        start: "10",
        end: "90",
      }),
    ).toBe(
      "https://www.youtube.com/embed/abc123?rel=0&controls=1&start=10&end=90&disablekb=1",
    );
    expect(
      getYoutubeVideoUrl({
        videoID: "abc123",
        showControls: true,
        start: "0",
        end: "0",
      }),
    ).toBe("https://www.youtube.com/embed/abc123?rel=0&controls=1&disablekb=1");
  });

  it("skips the admin's null defaults and non-numeric timestamps", () => {
    expect(
      getYoutubeVideoUrl({
        videoID: "abc123",
        showControls: true,
        start: null,
        end: "",
      }),
    ).toBe("https://www.youtube.com/embed/abc123?rel=0&controls=1&disablekb=1");
    expect(
      getYoutubeVideoUrl({
        videoID: "abc123",
        showControls: true,
        start: "later",
      }),
    ).toBe("https://www.youtube.com/embed/abc123?rel=0&controls=1&disablekb=1");
  });
});

describe("getVimeoVideoUrl", () => {
  it("builds the player url from the truthy options in mapping order", () => {
    expect(
      getVimeoVideoUrl({
        videoID: "987",
        byLine: true,
        color: "#ff0000",
        doNotTrack: true,
        loop: true,
        mute: true,
        title: true,
        portrait: true,
        controls: true,
        autoplay: true,
      }),
    ).toBe(
      "https://player.vimeo.com/video/987?byline=true&color=ff0000&dnt=true&loop=true&mute=true&title=true&portrait=true&controls=true&autoplay=true&",
    );
  });

  it("omits falsy options and keeps the color without the hash", () => {
    expect(
      getVimeoVideoUrl({
        videoID: "987",
        byLine: false,
        color: "",
        doNotTrack: true,
        loop: false,
        title: true,
        portrait: true,
        controls: true,
        autoplay: false,
      }),
    ).toBe(
      "https://player.vimeo.com/video/987?dnt=true&title=true&portrait=true&controls=true&",
    );
  });

  it("renders only the player base when no option is set", () => {
    expect(getVimeoVideoUrl({ videoID: "987" })).toBe(
      "https://player.vimeo.com/video/987?",
    );
  });
});
