import type { CmsComponentProps } from "../../registry";
import type { CmsElementManufacturerLogo as CmsElementManufacturerLogoContent } from "../../types";
import { CmsElementImage } from "./CmsElementImage";

export function CmsElementManufacturerLogo({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementManufacturerLogoContent>) {
  return (
    <CmsElementImage
      content={content}
      ctx={ctx}
      className={className}
      style={style}
    />
  );
}
