import { useCmsElementConfig } from "#imports";
import type {
  CmsElementImage,
  DisplayMode,
  CmsElementManufacturerLogo,
} from "../types";
import { computed } from "vue";
import type {
  ComputedRef,
  CSSProperties,
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
} from "vue";
import {
  getSrcSetForMedia,
  urlIsAbsolute,
  relativeUrlSlash,
} from "@shopware-pwa/helpers-next";

export type ImageContainerAttrs = {
  href?: string;
  target?: string;
  rel?: string;
};

export type UseCmsElementImage = {
  containerStyle: ComputedRef<CSSProperties>;
  anchorAttrs: ComputedRef<AnchorHTMLAttributes>;
  imageAttrs: ComputedRef<ImgHTMLAttributes>;
  imageContainerAttrs: ComputedRef<ImageContainerAttrs>;
  imageLink: ComputedRef<{ newTab: boolean; url: string }>;
  displayMode: ComputedRef<DisplayMode>;
  isVideoElement: ComputedRef<boolean>;
  mimeType: ComputedRef<string | undefined>;
};

/**
 * Composable to get cms element image
 *
 * @category CMS (Shopping Experiences)
 */
export function useCmsElementImage(
  element: CmsElementImage | CmsElementManufacturerLogo,
): UseCmsElementImage {
  const { getConfigValue } = useCmsElementConfig(element);

  const containerStyle: ComputedRef<CSSProperties> = computed(() => ({
    minHeight: getConfigValue("minHeight"),
  }));

  const anchorAttrs = computed(() => ({
    href: getConfigValue("url"),
    target: getConfigValue("newTab") ? "_blank" : "_self",
  }));

  const imageLink = computed(() => ({
    newTab: element.data?.newTab,
    url: element.data?.url,
  }));

  const imageContainerAttrs = computed(() => {
    const attr: ImageContainerAttrs = {};
    if (imageLink.value.url) {
      attr.href = urlIsAbsolute(imageLink.value.url)
        ? imageLink.value.url
        : relativeUrlSlash(imageLink.value.url);
    }
    if (imageLink.value.newTab) {
      attr.target = "blank";
      attr.rel = "noopener noreferrer";
    }
    return attr;
  });

  const imageAttrs: ComputedRef<ImgHTMLAttributes> = computed(() => ({
    src: element.data?.media?.url,
    alt: element.data?.media?.alt || "",
    srcset: getSrcSetForMedia(element.data?.media),
  }));

  const displayMode = computed(
    () => getConfigValue("displayMode") || "initial",
  );

  const isVideoElement = computed(() => {
    return !!element.data?.media?.mimeType?.includes("video");
  });

  const mimeType = computed(() => {
    return element.data?.media?.mimeType;
  });

  return {
    containerStyle,
    anchorAttrs,
    imageAttrs,
    imageContainerAttrs,
    imageLink,
    displayMode,
    isVideoElement,
    mimeType,
  };
}
