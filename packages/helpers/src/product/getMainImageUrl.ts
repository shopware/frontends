/**
 * gets the cover image
 *
 * @param {Product | LineItem | OrderLineItem} object Object containing media object
 *
 * @public
 *
 * @category Product
 */
export function getMainImageUrl<
  T extends
    | {
        cover?: {
          media?: {
            url: string;
          };
        };
      }
    | {
        media?: Array<{
          media?: {
            url?: string;
          };
        }>;
      }
    | {
        cover?: {
          url: string;
        };
      },
>(object: T): string {
  if (!object) return "";
  if ("cover" in object && object.cover) {
    if ("media" in object.cover) {
      return object?.cover?.media?.url || "";
    }
    if ("url" in object.cover) {
      return object?.cover?.url || "";
    }
  }
  if (
    "media" in object &&
    Array.isArray(object.media) &&
    object.media.length > 0
  ) {
    return object?.media?.[0]?.media?.url || "";
  }
  return "";
}
