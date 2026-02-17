/**
 * Encodes URL pathname to handle special characters (spaces, commas, etc.)
 *
 * @param urlString - The URL string to encode
 * @returns The URL with encoded pathname
 *
 * @public
 * @category Media
 */
export function encodeUrlPath(urlString: string): string {
  try {
    const url = new URL(urlString);
    url.pathname = url.pathname
      .split("/")
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join("/");
    return url.toString();
  } catch {
    return urlString;
  }
}

/**
 * Generates a srcset string using CDN width-based resizing.
 * Useful as a fallback when media has no pre-generated thumbnails.
 *
 * @param src - Base image URL
 * @param widths - Array of widths to generate (default: [400, 800, 1200, 1600])
 * @param options - Optional format and quality params
 * @returns srcset string or undefined if src is invalid
 *
 * @public
 * @category Media
 */
export function generateCdnSrcSet(
  src: string | undefined,
  widths: number[] = [400, 800, 1200, 1600],
  options?: { format?: string; quality?: number },
): string | undefined {
  if (!src) return undefined;

  try {
    return widths
      .map((w) => {
        const url = new URL(encodeUrlPath(src));
        url.searchParams.set("width", String(w));
        url.searchParams.set("fit", "crop,smart");
        if (options?.format) {
          url.searchParams.set("format", options.format);
        }
        if (options?.quality) {
          url.searchParams.set("quality", String(options.quality));
        }
        return `${url.toString()} ${w}w`;
      })
      .join(", ");
  } catch {
    return undefined;
  }
}

/**
 * Builds an optimized CDN image URL with size parameters.
 * Adds width or height (whichever is larger) rounded up to the nearest 100px.
 *
 * @param src - Base image URL
 * @param dimensions - Rendered element dimensions (width and height)
 * @returns Optimized image URL string
 *
 * @public
 * @category Media
 */
export function buildCdnImageUrl(
  src: string | undefined,
  dimensions: { width: number; height: number },
  options?: { format?: string; quality?: number },
): string {
  if (!src) return "";

  try {
    const url = new URL(encodeUrlPath(src));
    const DEFAULT_SIZE = 10;
    const w = dimensions.width
      ? Math.ceil(dimensions.width / 100) * 100
      : DEFAULT_SIZE;
    const h = dimensions.height
      ? Math.ceil(dimensions.height / 100) * 100
      : DEFAULT_SIZE;

    if (w > DEFAULT_SIZE || h > DEFAULT_SIZE) {
      if (dimensions.width > dimensions.height) {
        url.searchParams.set("width", String(w));
      } else {
        url.searchParams.set("height", String(h));
      }
    }

    url.searchParams.set("fit", "crop,smart");
    if (options?.format) {
      url.searchParams.set("format", options.format);
    }
    if (options?.quality) {
      url.searchParams.set("quality", String(options.quality));
    }
    return url.toString();
  } catch {
    return src;
  }
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
>(media?: T): string | undefined {
  if (!media?.thumbnails?.length) {
    return;
  }

  return media.thumbnails
    .map((thumbnail) => {
      return thumbnail.url
        ? `${encodeUrlPath(thumbnail.url)} ${thumbnail.width}w`
        : undefined;
    })
    .filter((value) => !!value)
    .join(", ");
}
