import { OrderLineItem, Downloads } from "@shopware-pwa/types";

type ProductMedia = {
  id: string;
  fileName: string;
};

/**
 * Prepare media object
 *
 * @param {OrderLineItem} lineItem order item
 *
 * @public
 * @category Media
 */
export function getMedia(lineItem: OrderLineItem) {
  return lineItem.downloads.reduce(
    (acc: [ProductMedia], current: Downloads) => {
      acc.push({
        id: current.id,
        fileName: `${current.media.fileName}.${current.media.fileExtension}`,
      });
      return acc;
    },
    []
  );
}
