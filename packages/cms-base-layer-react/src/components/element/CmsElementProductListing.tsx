import { cx } from "../../helpers/cx";
import { getConfigValue } from "../../helpers/slots";
import { LISTING_DEFAULTS } from "../../listing/query";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementProductListing as CmsElementProductListingContent } from "../../types";
import { SwProductCard } from "../shared/SwProductCard";
import { CmsElementProductListingResults } from "./CmsElementProductListingResults";

export function CmsElementProductListing({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementProductListingContent>) {
  const listing = ctx.listing ?? content.data?.listing;
  const elements = listing?.elements ?? [];
  const limit = listing?.limit || LISTING_DEFAULTS.limit;
  const current = listing?.page || LISTING_DEFAULTS.page;
  const total = Math.ceil((listing?.total || 0) / limit);
  const layoutType = getConfigValue(content, "boxLayout");

  return (
    <div
      className={cx("max-w-2xl mx-auto lg:max-w-full", className)}
      style={style}
    >
      <CmsElementProductListingResults
        productCount={elements.length}
        limit={limit}
        total={total}
        current={current}
        placeholderColor={ctx.config.imagePlaceholder.color}
        isProductSearch={ctx.isProductSearch}
        translations={ctx.translations}
      >
        {elements.map((product) => (
          <SwProductCard
            key={product.id}
            product={product}
            ctx={ctx}
            layoutType={layoutType}
            className="w-full"
          />
        ))}
      </CmsElementProductListingResults>
    </div>
  );
}
