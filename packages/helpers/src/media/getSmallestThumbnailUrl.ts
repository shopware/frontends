/**
 * Returns the smallest thumbnail url from the media object
 *
 * @param media image object
 *
 * @public
 * @category Media
 */
export function getSmallestThumbnailUrl<
  T extends {
    thumbnails?: Array<{
      width: number;
      url: string;
    }>;
  },
>(media?: T): string | undefined {
  if (!media || !media?.thumbnails?.length) {
    return;
  }

  const lowest = media.thumbnails.reduce((previous, current) => {
    return current.width < previous.width ? current : previous;
  });

  return lowest?.url;
}
