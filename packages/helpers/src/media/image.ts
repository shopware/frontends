import { Media } from "@shopware-pwa/types";

/**
 * Returns the smallest thumbnail url from the media object
 *
 * @param media image object
 *
 * @category Media
 */
export function getSmallestThumbnailUrl(
  media: Media | undefined | null
): string | undefined {
  if (!media || !media?.thumbnails?.length) {
    return;
  }

  const lowest = media.thumbnails.reduce((previous, current) => {
    return current.width < previous.width ? current : previous;
  });

  return lowest?.url;
}

/**
 * Returns the biggest thumbnail url from the media object
 *
 * @param media image object
 *
 * @category Media
 */
export function getBiggestThumbnailUrl(media: Media): string | undefined {
  if (!media?.thumbnails?.length) {
    return;
  }

  const biggest = media.thumbnails.reduce((previous, current) => {
    return current.width > previous.width ? current : previous;
  });

  return biggest?.url;
}

/**
 * Returns the srcset attribute for the image, for available breakpoints
 *
 * @param media image object
 *
 * @category Media
 */
export function getSrcSetForMedia(media: Media): string {
  if (!media?.thumbnails?.length) {
    return "";
  }

  return media.thumbnails
    .map((thumbnail) => {
      return `${thumbnail.url} ${thumbnail.width}w`;
    })
    .join(", ");
}
