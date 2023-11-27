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
