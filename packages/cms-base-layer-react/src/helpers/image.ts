import {
  getSrcSetForMedia,
  getTranslatedProperty,
  relativeUrlSlash,
  urlIsAbsolute,
} from "@shopware/helpers";
import type { CSSProperties } from "react";

import type {
  CmsElementImage,
  CmsElementManufacturerLogo,
  DisplayMode,
} from "../types";
import { getConfigValue } from "./slots";

export type CmsImageContainerAttrs = {
  href?: string;
  target?: string;
  rel?: string;
};

export type CmsElementImageData = {
  containerStyle: CSSProperties;
  imageAttrs: { src?: string; alt: string; srcSet?: string };
  imageContainerAttrs: CmsImageContainerAttrs;
  imageLink: { newTab: boolean; url: string };
  ariaLabel: string;
  isDecorative: boolean;
  displayMode: DisplayMode | "initial";
  isVideoElement: boolean;
  mimeType: string | undefined;
};

export function getCmsElementImage(
  element: CmsElementImage | CmsElementManufacturerLogo,
): CmsElementImageData {
  const minHeight = getConfigValue(element, "minHeight");
  const containerStyle: CSSProperties = minHeight ? { minHeight } : {};

  const imageLink = {
    newTab: !!element.data?.newTab,
    url: element.data?.url ?? "",
  };

  const imageContainerAttrs: CmsImageContainerAttrs = {};
  if (imageLink.url) {
    imageContainerAttrs.href = urlIsAbsolute(imageLink.url)
      ? imageLink.url
      : relativeUrlSlash(imageLink.url);
  }
  if (imageLink.newTab) {
    imageContainerAttrs.target = "_blank";
    imageContainerAttrs.rel = "noopener noreferrer";
  }

  const ariaLabel =
    element.data?.ariaLabel || getConfigValue(element, "ariaLabel") || "";
  const isDecorative = !!getConfigValue(element, "isDecorative");
  const media = element.data?.media;

  return {
    containerStyle,
    imageAttrs: {
      src: media?.url,
      alt: isDecorative ? "" : getTranslatedProperty(media, "alt"),
      srcSet: getSrcSetForMedia(media),
    },
    imageContainerAttrs,
    imageLink,
    ariaLabel,
    isDecorative,
    displayMode: getConfigValue(element, "displayMode") || "initial",
    isVideoElement: !!media?.mimeType?.includes("video"),
    mimeType: media?.mimeType,
  };
}
