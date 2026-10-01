import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageTextBubble as CmsBlockImageTextBubbleContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

const IMAGE_CLASS_NAME =
  "object-center rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64";

export function CmsBlockImageTextBubble({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageTextBubbleContent>) {
  const leftText = getSlotContent(content, "left-text");
  const leftImage = getSlotContent(content, "left-image");
  const centerText = getSlotContent(content, "center-text");
  const centerImage = getSlotContent(content, "center-image");
  const rightText = getSlotContent(content, "right-text");
  const rightImage = getSlotContent(content, "right-image");

  return (
    <div
      className={cx(
        "cms-block-image-text-bubble flex flex-col sm:flex-row justify-start items-start gap-6 w-full",
        className,
      )}
      style={style}
    >
      <div className="w-full sm:flex-1">
        <div className="self-stretch flex justify-center">
          <CmsGenericElement
            content={leftImage}
            ctx={ctx}
            className={IMAGE_CLASS_NAME}
          />
        </div>
        <CmsGenericElement
          content={leftText}
          ctx={ctx}
          className="self-stretch"
        />
      </div>
      <div className="w-full sm:flex-1">
        <div className="self-stretch flex justify-center">
          <CmsGenericElement
            content={centerImage}
            ctx={ctx}
            className={IMAGE_CLASS_NAME}
          />
        </div>
        <CmsGenericElement
          content={centerText}
          ctx={ctx}
          className="self-stretch"
        />
      </div>
      <div className="w-full sm:flex-1">
        <div className="self-stretch flex justify-center">
          <CmsGenericElement
            content={rightImage}
            ctx={ctx}
            className={IMAGE_CLASS_NAME}
          />
        </div>
        <CmsGenericElement
          content={rightText}
          ctx={ctx}
          className="self-stretch"
        />
      </div>
    </div>
  );
}
