/**
 * Returns the srcset attribute for the image, for available breakpoints
 *
 * @param media image object
 *
 * @public
 * @category Media
 */
export function getSrcSetForMedia<
  T extends {
    thumbnails?: Array<{
      width: number;
      url: string;
    }>;
  },
>(media?: T): string {
  if (!media?.thumbnails?.length) {
    return "";
  }

  return media.thumbnails
    .map((thumbnail) => {
      return `${thumbnail.url} ${thumbnail.width}w`;
    })
    .join(", ");
}
