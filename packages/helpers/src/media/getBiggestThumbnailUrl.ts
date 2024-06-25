/**
 * Returns the biggest thumbnail url from the media object
 *
 * @param media image object
 *
 * @public
 * @category Media
 */
export function getBiggestThumbnailUrl<
  T extends {
    thumbnails?: Array<{
      width: number;
      url: string;
    }>;
  },
>(media?: T): string | undefined {
  if (!media?.thumbnails?.length) {
    return;
  }

  const biggest = media.thumbnails.reduce((previous, current) => {
    return current.width > previous.width ? current : previous;
  });

  return biggest?.url;
}
