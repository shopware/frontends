import { getBackgroundImageUrl } from "@shopware/helpers";
import { computed } from "vue";
import { useAppConfig, useHead } from "#imports";
import type { Schemas } from "#shopware";

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
  sections: Schemas["CmsSection"][],
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
        const media = (slot.data as { media?: Schemas["Media"] })?.media;
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

/**
 * Preloads the first image found in CMS sections (background or element).
 * This is typically the LCP (Largest Contentful Paint) candidate.
 *
 * Injects a `<link rel="preload" as="image">` in the `<head>` during SSR,
 * allowing the browser to fetch the image before parsing CSS.
 */
export function useLcpImagePreload(sections: Schemas["CmsSection"][]) {
  const appConfig = useAppConfig();

  const lcpImageHref = computed(() =>
    findFirstCmsImageUrl(sections, {
      format: appConfig.backgroundImage?.format,
      quality: appConfig.backgroundImage?.quality,
    }),
  );

  useHead(
    computed(() =>
      lcpImageHref.value
        ? {
            link: [
              {
                rel: "preload",
                as: "image",
                fetchpriority: "high",
                href: lcpImageHref.value,
              },
            ],
          }
        : {},
    ),
  );
}
