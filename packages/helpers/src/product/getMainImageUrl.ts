import { LineItem, Product, OrderLineItem } from "@shopware-pwa/types";

function isProduct(
  object: Product | LineItem | OrderLineItem
): object is Product {
  return object?.apiAlias === "product";
}

/**
 * gets the cover image
 *
 * @public
 */
export function getMainImageUrl(
  object: Product | LineItem | OrderLineItem
): string {
  if (isProduct(object)) {
    return object?.cover?.media?.url || object?.media?.[0]?.media.url || "";
  }

  return object?.cover?.url || "";
}
