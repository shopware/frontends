import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { SwProductAddToCartForm } from "./SwProductAddToCartForm";
import { SwStockInfo } from "./SwStockInfo";

export type SwProductAddToCartProps = {
  product: Schemas["Product"];
  ctx: Pick<CmsClientContext, "translations">;
  className?: string;
  style?: CSSProperties;
};

export function SwProductAddToCart({
  product,
  ctx,
  className,
  style,
}: SwProductAddToCartProps) {
  return (
    <SwProductAddToCartForm
      productId={product.id}
      productName={product.translated?.name || product.name || ""}
      productNumber={product.productNumber ?? ""}
      available={!!product.available}
      minPurchase={product.minPurchase}
      maxPurchase={product.maxPurchase}
      purchaseSteps={product.purchaseSteps}
      translations={ctx.translations}
      className={className}
      style={style}
    >
      <SwStockInfo
        availableStock={product.availableStock ?? 0}
        minPurchase={product.minPurchase ?? 0}
        deliveryTime={product.deliveryTime}
        restockTime={product.restockTime}
        ctx={ctx}
      />
    </SwProductAddToCartForm>
  );
}
