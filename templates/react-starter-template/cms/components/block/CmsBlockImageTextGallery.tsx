import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageTextGallery as CmsBlockImageTextGalleryContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

function getImageCursorStyle(
  slotContent: Schemas["CmsSlot"] | undefined,
): CSSProperties | undefined {
  const data = slotContent?.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return undefined;
  }
  return typeof data.url === "string" && data.url
    ? { cursor: "pointer" }
    : undefined;
}

export function CmsBlockImageTextGallery({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageTextGalleryContent>) {
  const leftTextContent = getSlotContent(content, "left-text");
  const rightTextContent = getSlotContent(content, "right-text");
  const centerTextContent = getSlotContent(content, "center-text");

  const leftImageContent = getSlotContent(content, "left-image");
  const rightImageContent = getSlotContent(content, "right-image");
  const centerImageContent = getSlotContent(content, "center-image");

  const blockStyle: CSSProperties = content.backgroundColor
    ? { backgroundColor: content.backgroundColor, ...style }
    : { ...style };

  return (
    <article
      className={cx(
        "cms-block-image-text-gallery flex flex-col sm:flex-row justify-start items-start gap-6 w-full",
        className,
      )}
      style={blockStyle}
    >
      <div className="w-full sm:flex-1">
        <CmsGenericElement
          content={leftImageContent}
          ctx={ctx}
          style={getImageCursorStyle(leftImageContent)}
        />
        <CmsGenericElement
          content={leftTextContent}
          ctx={ctx}
          className="self-stretch"
        />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement
          content={centerImageContent}
          ctx={ctx}
          style={getImageCursorStyle(centerImageContent)}
        />
        <CmsGenericElement
          content={centerTextContent}
          ctx={ctx}
          className="self-stretch"
        />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement
          content={rightImageContent}
          ctx={ctx}
          style={getImageCursorStyle(rightImageContent)}
        />
        <CmsGenericElement
          content={rightTextContent}
          ctx={ctx}
          className="self-stretch"
        />
      </div>
    </article>
  );
}
