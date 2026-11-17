import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementProductSlider as CmsElementProductSliderContent } from "../../types";
import { SwProductCard } from "../shared/SwProductCard";
import { CmsElementProductSliderContainer } from "./CmsElementProductSliderContainer";
import { parseMinWidth } from "./sliderLayout";

export function CmsElementProductSlider({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementProductSliderContent>) {
  const products = content.data?.products ?? [];
  const verticalAlign = getConfigValue(content, "verticalAlign");
  const rootStyle = verticalAlign
    ? { alignContent: verticalAlign, ...style }
    : style;

  return (
    <div className={className} style={rootStyle}>
      <CmsElementProductSliderContainer
        title={getConfigValue(content, "title")}
        border={!!getConfigValue(content, "border")}
        elMinWidth={parseMinWidth(getConfigValue(content, "elMinWidth"))}
        slotCount={ctx.slotCount}
        verticalAlign={verticalAlign || ""}
        navigation={getConfigValue(content, "navigation") === true}
        autoplay={!!getConfigValue(content, "rotate")}
      >
        {products.map((product) => (
          <SwProductCard
            key={product.id}
            className="h-full"
            product={product}
            ctx={ctx}
            layoutType={getConfigValue(content, "boxLayout")}
            displayMode={getConfigValue(content, "displayMode")}
          />
        ))}
      </CmsElementProductSliderContainer>
    </div>
  );
}
