import { getTranslatedProperty } from "@shopware/helpers";
import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";

export type SwStockInfoProps = {
  availableStock: number;
  minPurchase: number;
  deliveryTime?: Schemas["DeliveryTime"];
  restockTime?: number;
  ctx: Pick<CmsClientContext, "translations">;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  product: {
    deliveryTime: "Available, delivery time",
    days: "days",
    noAvailable: "No longer available",
  },
};

export function SwStockInfo({
  availableStock,
  minPurchase,
  deliveryTime,
  restockTime,
  ctx,
  className,
  style,
}: SwStockInfoProps) {
  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );
  const deliveryTimeName = getTranslatedProperty(deliveryTime, "name");

  return (
    <div
      className={cx("inline-flex justify-start items-center gap-2", className)}
      style={style}
    >
      {availableStock > 0 ? (
        <div className="w-2 h-2 bg-states-success rounded-full" />
      ) : (
        <div className="w-2 h-2 bg-states-error rounded-full" />
      )}
      {availableStock >= minPurchase && deliveryTime ? (
        <span>
          {translations.product.deliveryTime} {deliveryTimeName}
        </span>
      ) : availableStock < minPurchase && deliveryTime && restockTime ? (
        <span>
          {translations.product.deliveryTime} {restockTime}{" "}
          {translations.product.days} {deliveryTimeName}
        </span>
      ) : (
        <span>{translations.product.noAvailable}</span>
      )}
    </div>
  );
}
