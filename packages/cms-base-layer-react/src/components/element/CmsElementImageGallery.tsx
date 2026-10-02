import { getTranslatedProperty } from "@shopware/helpers";

import { cx } from "../../helpers/cx";
import { getImagePlaceholder } from "../../helpers/imagePlaceholder";
import { isSpatial } from "../../helpers/isSpatial";
import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementImageGallery as CmsElementImageGalleryContent } from "../../types";
import { CmsMedia } from "../ui/CmsMedia";
import { CmsElementImageGallery3dPlaceholder } from "./CmsElementImageGallery3dPlaceholder";
import { CmsElementImageGallerySlides } from "./CmsElementImageGallerySlides";

const DEFAULT_MIN_HEIGHT = "500px";
const DEFAULT_NAVIGATION = "inside";
const IMAGE_CLASS = "w-full h-full absolute inset-0 object-cover";
const PLACEHOLDER_ALT = "Placeholder image";
const PRODUCT_IMAGE_ALT = "Product image";

export function CmsElementImageGallery({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementImageGalleryContent>) {
  const minHeight = getConfigValue(content, "minHeight") || DEFAULT_MIN_HEIGHT;
  const navigationArrows =
    getConfigValue(content, "navigationArrows") || DEFAULT_NAVIGATION;
  const navigationDots =
    getConfigValue(content, "navigationDots") || DEFAULT_NAVIGATION;
  const mediaGallery = content.data?.sliderItems ?? [];
  const placeholderSvg = getImagePlaceholder(ctx.config.imagePlaceholder.color);

  function renderPlaceholder(key: string) {
    return (
      <img
        key={key}
        className={IMAGE_CLASS}
        src={placeholderSvg}
        alt={PLACEHOLDER_ALT}
      />
    );
  }

  const slides = mediaGallery.map((item, index) => {
    const media = item.media;
    if (!media?.url) {
      return renderPlaceholder(`placeholder-${index}`);
    }
    if (isSpatial(media)) {
      return (
        <div
          key={`${media.id}-${index}-3d`}
          className="w-full h-full relative"
          style={{ minHeight }}
        >
          <CmsElementImageGallery3dPlaceholder className={IMAGE_CLASS} />
          <span className="absolute bottom-4 right-4 text-sm bg-gray-800 rounded px-2 py-1 text-white">
            3D
          </span>
        </div>
      );
    }
    return (
      <CmsMedia
        key={`${media.id}-${index}`}
        media={media}
        alt={getTranslatedProperty(media, "alt") || PRODUCT_IMAGE_ALT}
        className={IMAGE_CLASS}
        sizes={ctx.imageSizes}
      />
    );
  });

  return (
    <div
      className={cx(
        "w-full max-w-full relative inline-flex flex-col justify-center items-center gap-2 mx-auto",
        className,
      )}
      style={style}
    >
      <div className="w-full">
        <CmsElementImageGallerySlides
          minHeight={minHeight}
          navigationArrows={navigationArrows}
          navigationDots={navigationDots}
        >
          {slides.length ? slides : renderPlaceholder("placeholder")}
        </CmsElementImageGallerySlides>
      </div>
    </div>
  );
}
