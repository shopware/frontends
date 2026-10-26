import type {
  CmsElementVideo,
  MediaDisplayMode,
  VerticalAlign,
} from "@shopware/composables";
import { getTranslatedProperty } from "@shopware/helpers";

type Alignment = Exclude<VerticalAlign, "">;

export type VideoElementOptions = {
  src?: string;
  mimeType?: string;
  poster?: string;
  displayMode: MediaDisplayMode;
  minHeight?: string;
  placeholderAspectRatio?: string;
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

export type VideoToggleState = {
  isPlaying: boolean;
  hasFailed: boolean;
  videoId: string;
};

export type VideoToggleLabels = {
  playLabel: string;
  pauseLabel: string;
  loadError: string;
};

const DISPLAY_MODES: MediaDisplayMode[] = ["standard", "stretch", "cover"];
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
  const poster =
    (showCover && media?.extensions?.videoCoverMedia?.url) || undefined;
  const label =
    element.config?.ariaLabel?.source === "mapped"
      ? ""
      : (element.data?.ariaLabel ?? "").trim();

  return {
    src: media?.url || undefined,
    mimeType: media?.mimeType || undefined,
    poster,
    displayMode,
    minHeight: (isCover && getConfigValue(element, "minHeight")) || undefined,
    placeholderAspectRatio:
      showCover && !poster && displayMode === "stretch"
        ? "auto 16 / 9"
        : undefined,
    verticalAlign: isCover
      ? undefined
      : toAlignment(getConfigValue(element, "verticalAlign")),
    horizontalAlign: isCover
      ? undefined
      : toAlignment(getConfigValue(element, "horizontalAlign")),
    autoplay,
    muted: autoplay || !!getConfigValue(element, "muted"),
    loop: !!getConfigValue(element, "loop"),
    playsInline: !!getConfigValue(element, "playsInline"),
    controls: !!getConfigValue(element, "showControls"),
    preload: showCover ? "none" : "auto",
    ariaLabel: label || getTranslatedProperty(media, "alt").trim() || undefined,
    title: label || getTranslatedProperty(media, "title").trim() || undefined,
  };
}

export function getVideoAttributes(options: VideoElementOptions) {
  return {
    preload: options.preload,
    poster: options.poster,
    autoplay: options.autoplay,
    muted: options.muted,
    loop: options.loop,
    playsinline: options.playsInline || undefined,
    controls: options.controls,
    "aria-label": options.ariaLabel,
    title: options.title,
  };
}

function getToggleLabel(
  state: VideoToggleState,
  labels: VideoToggleLabels,
): string {
  if (state.hasFailed) return labels.loadError;

  return state.isPlaying ? labels.pauseLabel : labels.playLabel;
}

export function getVideoToggleAttributes(
  options: VideoElementOptions,
  state: VideoToggleState,
  labels: VideoToggleLabels,
) {
  if (options.controls) return {};

  const label = getToggleLabel(state, labels);

  return {
    role: "button",
    tabindex: 0,
    "aria-label": label,
    "aria-describedby": options.ariaLabel ? state.videoId : undefined,
    "aria-disabled": state.hasFailed || undefined,
    title: (!state.hasFailed && options.title) || label,
  };
}
