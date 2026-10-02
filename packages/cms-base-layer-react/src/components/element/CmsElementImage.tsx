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

function CmsElementImage3dPlaceholder() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="552"
      height="383"
      viewBox="0 0 552 383"
    >
      <defs>
        <g
          id="icons-default-placeholder"
          fill="none"
          fillRule="evenodd"
          opacity=".65"
        >
          <rect
            width="333.061"
            height="499.591"
            x="84.659"
            y="-82.663"
            fill="#E9EBF2"
            fillRule="nonzero"
            transform="rotate(-89.862 251.19 167.132)"
          ></rect>
          <g transform="translate(51 49)">
            <rect
              width="333.06"
              height="499.59"
              x="83.983"
              y="-83.234"
              fill="#DADDE5"
              fillRule="nonzero"
              transform="rotate(-90 250.513 166.561)"
            ></rect>
            <polygon
              fill="#E9EBF2"
              points="137.18 333.1 500.31 333.1 500.31 302.36 322.15 110.42"
            ></polygon>
            <circle cx="113.04" cy="65.68" r="35.9" fill="#F5F7FC"></circle>
            <polygon
              fill="#F5F7FC"
              points="219.88 157.3 73.85 333.1 383.05 333.1"
            ></polygon>
          </g>
        </g>
      </defs>
      <use
        xlinkHref="#icons-default-placeholder"
        fill="#758CA3"
        fillRule="evenodd"
      ></use>
    </svg>
  );
}

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
    child = <CmsElementImage3dPlaceholder />;
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
