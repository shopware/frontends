import { cx } from "../../helpers/cx";
import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type {
  CmsElementImage as CmsElementImageContent,
  CmsElementImageSlider as CmsElementImageSliderContent,
} from "../../types";
import { SwSlider } from "../shared/SwSlider";
import { CmsElementImage } from "./CmsElementImage";

export function CmsElementImageSlider({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementImageSliderContent>) {
  const items = content.data?.sliderItems ?? [];

  return (
    <div
      className={cx(
        "cms-element-image-slider w-[92vw] sm:w-[94vw] md:w-full",
        className,
      )}
      style={style}
    >
      <SwSlider
        minHeight={getConfigValue(content, "minHeight")}
        verticalAlign={getConfigValue(content, "verticalAlign")}
        displayMode={getConfigValue(content, "displayMode")}
        navigationArrows={getConfigValue(content, "navigationArrows")}
        navigationDots={getConfigValue(content, "navigationDots")}
      >
        {items.map((image, index) => (
          <CmsElementImage
            key={`${image.mediaId ?? image.media?.url}-${index}`}
            content={
              {
                ...content,
                type: "image",
                data: image,
                config: content.config,
              } as unknown as CmsElementImageContent
            }
            ctx={ctx}
          />
        ))}
      </SwSlider>
    </div>
  );
}
