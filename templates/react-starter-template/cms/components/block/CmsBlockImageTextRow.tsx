import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageTextRow as CmsBlockImageTextRowContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageTextRow({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageTextRowContent>) {
  const leftImageContent = getSlotContent(content, "left-image");
  const leftTextContent = getSlotContent(content, "left-text");
  const centerImageContent = getSlotContent(content, "center-image");
  const centerTextContent = getSlotContent(content, "center-text");
  const rightImageContent = getSlotContent(content, "right-image");
  const rightTextContent = getSlotContent(content, "right-text");

  return (
    <div
      className={cx(
        "cms-block-image-text-row flex flex-col md:flex-row justify-center items-stretch gap-6 w-full",
        "[&_.cms-element-image]:relative [&_.cms-element-image]:h-full [&_.cms-element-image]:w-full",
        "[&_.cms-element-image_img]:h-full [&_.cms-element-image_img]:w-full [&_.cms-element-image_img]:rounded-lg [&_.cms-element-image_img]:object-cover",
        "[&_.cms-element-text]:self-stretch [&_.cms-element-text]:min-h-12",
        className,
      )}
      style={style}
    >
      <div className="w-full md:flex-1 flex flex-col">
        <div className="flex-1 mb-4 overflow-hidden rounded-lg min-h-64">
          <CmsGenericElement content={leftImageContent} ctx={ctx} />
        </div>
        <CmsGenericElement
          content={leftTextContent}
          ctx={ctx}
          className="text-center"
        />
      </div>
      <div className="w-full md:flex-1 flex flex-col">
        <div className="flex-1 mb-4 overflow-hidden rounded-lg min-h-64">
          <CmsGenericElement content={centerImageContent} ctx={ctx} />
        </div>
        <CmsGenericElement
          content={centerTextContent}
          ctx={ctx}
          className="text-center"
        />
      </div>
      <div className="w-full md:flex-1 flex flex-col">
        <div className="flex-1 mb-4 overflow-hidden rounded-lg min-h-64">
          <CmsGenericElement content={rightImageContent} ctx={ctx} />
        </div>
        <CmsGenericElement
          content={rightTextContent}
          ctx={ctx}
          className="text-center"
        />
      </div>
    </div>
  );
}
