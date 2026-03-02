import { getBackgroundImageUrl } from "@shopware/helpers";

interface MediaMeta {
  width?: number;
  height?: number;
}

interface BackgroundMediaHolder {
  backgroundMedia?: {
    url?: string;
    metaData?: MediaMeta;
  };
}

interface CmsSlot {
  data?: { media?: { url?: string } } | unknown;
}

interface CmsBlock extends BackgroundMediaHolder {
  slots?: CmsSlot[];
}

interface CmsSection extends BackgroundMediaHolder {
  blocks?: CmsBlock[];
}

/**
 * Finds the first visible image URL in CMS page sections by scanning:
 * 1. Section background images
 * 2. Block background images
 * 3. Image element media (slot data)
 *
 * Returns the URL with optimized format/quality params applied,
 * or undefined if no image is found.
 */
export function findFirstCmsImageUrl(
  sections: CmsSection[],
  options?: { format?: string; quality?: number },
): string | undefined {
  for (const section of sections) {
    // 1. Section background
    if (section.backgroundMedia?.url) {
      return getBackgroundImageUrl(
        `url("${section.backgroundMedia.url}")`,
        section,
        options,
      ).replace(/^url\("([^"]+)"\)$/, "$1");
    }

    if (!section.blocks) continue;

    for (const block of section.blocks) {
      // 2. Block background
      if (block.backgroundMedia?.url) {
        return getBackgroundImageUrl(
          `url("${block.backgroundMedia.url}")`,
          block,
          options,
        ).replace(/^url\("([^"]+)"\)$/, "$1");
      }

      if (!block.slots) continue;

      for (const slot of block.slots) {
        // 3. Image element media
        const media = (slot.data as { media?: { url?: string } })?.media;
        if (media?.url) {
          try {
            const url = new URL(media.url);
            if (options?.format) {
              url.searchParams.set("format", options.format);
            }
            if (typeof options?.quality === "number") {
              url.searchParams.set("quality", String(options.quality));
            }
            return url.toString();
          } catch {
            return media.url;
          }
        }
      }
    }
  }

  return undefined;
}
