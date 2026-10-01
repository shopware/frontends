import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import { SwSharedPrice } from "./SwSharedPrice";

export type SwProductUnitsProps = {
  product: Schemas["Product"];
  ctx: Pick<CmsClientContext, "locale" | "currencyCode" | "translations">;
  showContent?: boolean;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  product: {
    content: "Content",
  },
};

export function SwProductUnits({
  product,
  ctx,
  showContent = true,
  className,
  style,
}: SwProductUnitsProps) {
  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );
  const purchaseUnit = product.purchaseUnit;
  if (!purchaseUnit) return null;

  const unitName = product.unit?.translated.name;
  const referencePrice = product.calculatedPrice?.referencePrice;

  return (
    <div
      className={cx("flex text-gray-500 justify-end gap-1", className)}
      style={style}
    >
      {showContent ? (
        <>
          {translations.product.content}: {purchaseUnit} {unitName}
        </>
      ) : null}
      {referencePrice?.price ? (
        <>
          {"("}
          <SwSharedPrice value={referencePrice.price} ctx={ctx} />
          {" / "}
          {referencePrice.referenceUnit} {referencePrice.unitName}
          {" )"}
        </>
      ) : null}
    </div>
  );
}
