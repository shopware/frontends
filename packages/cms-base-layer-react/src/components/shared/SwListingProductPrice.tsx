import type { ComponentProps } from "react";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import { getProductPrice } from "./productPrice";
import { SwSharedPrice } from "./SwSharedPrice";

export type ProductPriceContext = Pick<
  CmsClientContext,
  "locale" | "currencyCode" | "translations"
>;

export type SwListingProductPriceProps = Omit<
  ComponentProps<"div">,
  "children"
> & {
  product: Schemas["Product"];
  ctx: ProductPriceContext;
};

const translationDefaults = {
  listing: {
    variantsFrom: "variants from",
    previously: "previously",
    from: "from",
    to: "to",
  },
};

export function SwListingProductPrice({
  product,
  ctx,
  className,
  ...props
}: SwListingProductPriceProps) {
  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );
  const {
    price,
    unitPrice,
    displayFromVariants,
    displayFrom,
    hasListPrice,
    regulationPrice,
  } = getProductPrice(product);

  const fromLabel =
    displayFrom || displayFromVariants ? (
      <span className="text-sm">{translations.listing.from}</span>
    ) : null;

  return (
    <div
      {...props}
      className={cx("inline-flex justify-start items-center gap-2", className)}
    >
      {hasListPrice ? (
        <div className="flex items-center gap-2">
          <div className="text-base font-bold leading-normal">
            <SwSharedPrice
              value={unitPrice}
              ctx={ctx}
              beforePrice={fromLabel}
            />
          </div>
          <div className="text-surface-on-surface-variant text-sm font-normal leading-tight line-through">
            <SwSharedPrice value={price?.listPrice?.price} ctx={ctx} />
          </div>
        </div>
      ) : (
        <div className="text-surface-on-surface text-base font-bold leading-normal">
          <SwSharedPrice value={unitPrice} ctx={ctx} beforePrice={fromLabel} />
        </div>
      )}

      {displayFromVariants ? (
        <div className="text-surface-on-surface text-base font-bold leading-normal">
          <SwSharedPrice
            value={displayFromVariants}
            ctx={ctx}
            beforePrice={
              <span className="text-sm">
                {translations.listing.variantsFrom}
              </span>
            }
          />
        </div>
      ) : null}

      {regulationPrice ? (
        <div className="flex gap-2 text-surface-on-surface-variant text-sm">
          {translations.listing.previously}
          <SwSharedPrice value={regulationPrice} ctx={ctx} />
        </div>
      ) : null}
    </div>
  );
}
