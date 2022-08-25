import {
  CmsElementImage,
  DisplayMode,
  CmsElementManufacturerLogo,
  useCmsElementConfig,
} from "../index";
import {
  computed,
  ComputedRef,
  CSSProperties,
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
} from "vue";
import { MediaThumbnail } from "@shopware-pwa/types";

export type UseCmsElementImage = {
  containerStyle: ComputedRef<CSSProperties>;
  anchorAttrs: ComputedRef<AnchorHTMLAttributes>;
  imageAttrs: ComputedRef<ImgHTMLAttributes>;
  imageContainerAttrs: ComputedRef<CSSProperties>;
  imageLink: ComputedRef<{ newTab: boolean; url: string }>;
  displayMode: ComputedRef<DisplayMode>;
};

export function useCmsElementImage(
  element: CmsElementImage | CmsElementManufacturerLogo
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
    const attr: { [k: string]: string } = {};
    if (imageLink.value.url) {
      attr.href = imageLink.value.url;
    }
    if (imageLink.value.newTab) {
      attr.target = "blank";
      attr.rel = "noopener noreferrer";
    }
    return attr;
  });

  const srcset = "";
  const imageAttrs: ComputedRef<ImgHTMLAttributes> = computed(() => ({
    src: element.data?.media?.url,
    alt: element.data?.media?.fileName,
    srcset:
      element.data?.media?.thumbnails?.reduce(
        (
          previousValue: string,
          currentValue: MediaThumbnail,
          currentIndex: number
        ) =>
          `${previousValue}${currentIndex != 0 ? "," : ""} ${
            currentValue.url
          } ${currentValue.width}w`,
        srcset
      ) || "",
  }));

  const displayMode = computed(
    () => getConfigValue("displayMode") || "initial"
  );

  return {
    containerStyle,
    anchorAttrs,
    imageAttrs,
    imageContainerAttrs,
    imageLink,
    displayMode,
  };
}
