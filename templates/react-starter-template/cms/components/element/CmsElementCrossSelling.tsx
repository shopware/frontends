import { getTranslatedProperty } from "@shopware/helpers";

import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementCrossSelling as CmsElementCrossSellingContent } from "../../types";
import { SwProductCard } from "../shared/SwProductCard";
import { CmsElementCrossSellingTabs } from "./CmsElementCrossSellingTabs";
import { DEFAULT_SLIDE_MIN_WIDTH } from "./sliderLayout";

export function CmsElementCrossSelling({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementCrossSellingContent>) {
  const collections = (content.data?.crossSellings ?? []).filter(
    (collection) => !!collection.products.length,
  );
  const layoutType = getConfigValue(content, "boxLayout");
  const displayMode = getConfigValue(content, "displayMode");

  return (
    <CmsElementCrossSellingTabs
      tabs={collections.map((collection) =>
        getTranslatedProperty(collection.crossSelling, "name"),
      )}
      panels={collections.map((collection) =>
        collection.products.map((product) => (
          <SwProductCard
            key={product.id}
            className="w-[300px]"
            product={product}
            ctx={ctx}
            layoutType={layoutType}
            displayMode={displayMode}
          />
        )),
      )}
      elMinWidth={DEFAULT_SLIDE_MIN_WIDTH}
      slotCount={ctx.slotCount}
      className={className}
      style={style}
    />
  );
}
