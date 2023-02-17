import { LineItem, Product, OrderLineItem } from "@shopware-pwa/types";

function isProduct(
  object: Product | LineItem | OrderLineItem
): object is Product {
  return object?.apiAlias === "product" || object?.type === "product";
}

/**
 * gets the cover image
 *
 * @public
 */
export function getMainImageUrl(
  product: Product | LineItem | OrderLineItem
): string {
  return isProduct(product)
    ? product?.cover?.media?.url || product?.media?.[0]?.media.url || ""
    : "";
}
