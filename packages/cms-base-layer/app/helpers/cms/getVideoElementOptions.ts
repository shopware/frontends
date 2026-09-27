import type {
  CmsElementVideo,
  VerticalAlign,
  VideoDisplayMode,
} from "@shopware/composables";
import { getTranslatedProperty } from "@shopware/helpers";

type Alignment = Exclude<VerticalAlign, "">;

export type VideoElementOptions = {
  src?: string;
  mimeType?: string;
  poster?: string;
  displayMode: VideoDisplayMode;
  minHeight?: string;
  verticalAlign?: Alignment;
  horizontalAlign?: Alignment;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  playsInline: boolean;
  controls: boolean;
  preload: "auto" | "none";
  ariaLabel?: string;
  title?: string;
};

const DISPLAY_MODES: VideoDisplayMode[] = ["standard", "stretch", "cover"];
const ALIGNMENTS: Alignment[] = ["flex-start", "center", "flex-end"];

function getConfigValue<KEY extends keyof CmsElementVideo["config"]>(
  element: CmsElementVideo,
  key: KEY,
): CmsElementVideo["config"][KEY]["value"] | undefined {
  const config = element.config?.[key];

  return config?.source === "mapped" ? undefined : config?.value;
}

function toAlignment(value: unknown): Alignment | undefined {
  return ALIGNMENTS.find((alignment) => alignment === value);
}

export function getVideoElementOptions(
  element: CmsElementVideo,
): VideoElementOptions {
  const media = element.data?.media ?? undefined;
  const displayMode =
    DISPLAY_MODES.find(
      (mode) => mode === getConfigValue(element, "displayMode"),
    ) ?? "standard";
  const isCover = displayMode === "cover";
  const showCover = !!getConfigValue(element, "showCover");
  const autoplay = !showCover && !!getConfigValue(element, "autoPlay");
  const label = (
    element.data?.ariaLabel ||
    getConfigValue(element, "ariaLabel") ||
    ""
  ).trim();

  return {
    src: media?.url || undefined,
    mimeType: media?.mimeType || undefined,
    poster: (showCover && media?.extensions?.videoCoverMedia?.url) || undefined,
    displayMode,
    minHeight: (isCover && getConfigValue(element, "minHeight")) || undefined,
    verticalAlign: isCover
      ? undefined
      : toAlignment(getConfigValue(element, "verticalAlign")),
    horizontalAlign: isCover
      ? undefined
      : toAlignment(getConfigValue(element, "horizontalAlign")),
    autoplay,
    // Browsers only autoplay a muted video
    muted: autoplay || !!getConfigValue(element, "muted"),
    loop: !!getConfigValue(element, "loop"),
    playsInline: !!getConfigValue(element, "playsInline"),
    controls: !!getConfigValue(element, "showControls"),
    preload: showCover ? "none" : "auto",
    ariaLabel: label || getTranslatedProperty(media, "alt").trim() || undefined,
    title: label || getTranslatedProperty(media, "title").trim() || undefined,
  };
}
