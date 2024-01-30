/**
 * get the thumbnail image URL with the smallest width
 *
 * @deprecated use `getSmallestThumbnailUrl` helper instead
 *
 * @param {Product} product product entity
 *
 * @beta
 *
 * @category Product
 */
export function getProductThumbnailUrl<
  T extends {
    cover?: {
      media?: {
        thumbnails?: Array<{
          width: number;
          url: string;
        }>;
        url?: string;
      };
    };
  },
>(product: T): string {
  const coverImageUrlFallback = product?.cover?.media?.url || "";
  const thumbnailImage =
    (product?.cover?.media?.thumbnails?.length &&
      product.cover.media.thumbnails.reduce((res, thumb) =>
        thumb.width < res.width ? thumb : res,
      )) ||
    null;
  return thumbnailImage?.url || coverImageUrlFallback;
}
