import Link from "next/link";
import type { ReactNode } from "react";

import { cx } from "../../helpers/cx";
import { getCmsElementImage } from "../../helpers/image";
import { isSpatial } from "../../helpers/isSpatial";
import { isInternalUrl, prefixUrl } from "../../helpers/resolveUrl";
import type { CmsComponentProps } from "../../registry";
import { withTranslationDefaults } from "../../translations";
import type {
  CmsElementImage as CmsElementImageContent,
  CmsElementManufacturerLogo as CmsElementManufacturerLogoContent,
} from "../../types";
import { CmsMedia } from "../ui/CmsMedia";
import { CmsElementImageGallery3dPlaceholder } from "./CmsElementImageGallery3dPlaceholder";

const translations = {
  cms: {
    image: {
      linkWithoutLabel: "Open linked page",
    },
  },
};

const FILLING_DISPLAY_MODES: ReadonlySet<string> = new Set([
  "cover",
  "stretch",
]);

export type CmsElementImageProps = CmsComponentProps<
  CmsElementImageContent | CmsElementManufacturerLogoContent
> & {
  imageGallery?: boolean;
};

export function CmsElementImage({
  content,
  ctx,
  className,
  style,
  imageGallery = false,
}: CmsElementImageProps) {
  const t = withTranslationDefaults(ctx.translations, translations);
  const {
    ariaLabel,
    containerStyle,
    displayMode,
    imageContainerAttrs,
    imageAttrs,
    imageLink,
    isDecorative,
    isVideoElement,
    mimeType,
  } = getCmsElementImage(content);

  if (!imageAttrs.src) return null;

  const media = content.data?.media;
  const fillsContainer = FILLING_DISPLAY_MODES.has(displayMode);

  let linkAriaLabel: string | undefined;
  if (imageLink.url && !imageAttrs.alt) {
    const mediaTitle = isDecorative ? "" : media?.title;
    linkAriaLabel = ariaLabel || mediaTitle || t.cms.image.linkWithoutLabel;
  }

  const rootClassName = cx(
    "cms-element-image self-stretch relative",
    imageGallery && "flex justify-center items-center",
    className,
  );
  const rootStyle = { ...containerStyle, ...style };

  let child: ReactNode;
  if (isVideoElement) {
    child = (
      <video
        controls
        className={cx(
          "w-full h-full",
          fillsContainer && "absolute inset-0",
          displayMode === "cover" ? "object-cover" : "object-contain",
        )}
      >
        <source src={imageAttrs.src} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    );
  } else if (isSpatial(media)) {
    child = <CmsElementImageGallery3dPlaceholder />;
  } else {
    child = (
      <CmsMedia
        media={media}
        alt={imageAttrs.alt}
        sizes={ctx.imageSizes}
        className={cx(
          !imageGallery && "w-full",
          !imageGallery && fillsContainer && "h-full",
          imageGallery && "w-4/5",
          fillsContainer && "absolute left-0 top-0",
          displayMode === "cover" && "object-cover",
          (imageGallery || displayMode !== "cover") && "object-contain",
        )}
      />
    );
  }

  if (imageLink.url) {
    const href = imageContainerAttrs.href
      ? prefixUrl(imageContainerAttrs.href, ctx.urlPrefix)
      : undefined;

    if (href && isInternalUrl(href)) {
      return (
        <Link
          className={rootClassName}
          style={rootStyle}
          href={href}
          target={imageContainerAttrs.target}
          rel={imageContainerAttrs.rel}
          aria-label={linkAriaLabel}
        >
          {child}
        </Link>
      );
    }

    return (
      <a
        className={rootClassName}
        style={rootStyle}
        href={href}
        target={imageContainerAttrs.target}
        rel={imageContainerAttrs.rel}
        aria-label={linkAriaLabel}
      >
        {child}
      </a>
    );
  }

  return (
    <div className={rootClassName} style={rootStyle}>
      {child}
    </div>
  );
}
