const YOUTUBE_URL = "https://www.youtube.com/embed/";
const YOUTUBE_NOCOOKIE_URL = "https://www.youtube-nocookie.com/embed/";
const VIMEO_URL = "https://player.vimeo.com/video/";

export type YoutubeVideoUrlOptions = {
  videoID?: string | null;
  loop?: boolean | null;
  showControls?: boolean | null;
  start?: string | null;
  end?: string | null;
  advancedPrivacyMode?: boolean | null;
};

function isNonZeroTimestamp(value: string | null | undefined): boolean {
  const seconds = Number.parseInt(value ?? "", 10);
  return !Number.isNaN(seconds) && seconds !== 0;
}

export function getYoutubeVideoUrl(options: YoutubeVideoUrlOptions): string {
  const videoID = options.videoID ?? "";
  const domain = options.advancedPrivacyMode
    ? YOUTUBE_NOCOOKIE_URL
    : YOUTUBE_URL;
  const relatedVideos = "rel=0&";
  const loop = options.loop ? `loop=1&playlist=${videoID}&` : "";
  const showControls = options.showControls ? "controls=1&" : "controls=0&";
  const start = isNonZeroTimestamp(options.start)
    ? `start=${options.start}&`
    : "";
  const end = isNonZeroTimestamp(options.end) ? `end=${options.end}&` : "";
  const disableKeyboard = "disablekb=1";

  return `${domain}${videoID}?${relatedVideos}${loop}${showControls}${start}${end}${disableKeyboard}`;
}

export type VimeoVideoUrlOptions = {
  videoID?: string | null;
  byLine?: boolean | null;
  color?: string | null;
  doNotTrack?: boolean | null;
  loop?: boolean | null;
  mute?: boolean | null;
  title?: boolean | null;
  portrait?: boolean | null;
  controls?: boolean | null;
  autoplay?: boolean | null;
};

type VimeoParamKey = Exclude<keyof VimeoVideoUrlOptions, "videoID">;

const VIMEO_PARAMS: ReadonlyArray<[VimeoParamKey, string]> = [
  ["byLine", "byline"],
  ["color", "color"],
  ["doNotTrack", "dnt"],
  ["loop", "loop"],
  ["mute", "mute"],
  ["title", "title"],
  ["portrait", "portrait"],
  ["controls", "controls"],
  ["autoplay", "autoplay"],
];

export function getVimeoVideoUrl(options: VimeoVideoUrlOptions): string {
  let videoUrl = `${VIMEO_URL}${options.videoID ?? ""}?`;

  for (const [key, param] of VIMEO_PARAMS) {
    const value = options[key];
    if (!value) continue;
    videoUrl +=
      key === "color"
        ? `${param}=${String(value).replace("#", "")}&`
        : `${param}=${String(value)}&`;
  }

  return videoUrl;
}
