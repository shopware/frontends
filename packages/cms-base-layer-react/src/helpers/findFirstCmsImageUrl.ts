import { getBackgroundImageUrl } from "@shopware/helpers";

type MediaMeta = {
  width?: number;
  height?: number;
};

type BackgroundMediaHolder = {
  backgroundMedia?: {
    url?: string;
    metaData?: MediaMeta;
  };
};

type CmsSlotLike = {
  data?: { media?: { url?: string } } | unknown;
};

type CmsBlockLike = BackgroundMediaHolder & {
  slots?: CmsSlotLike[];
};

type CmsSectionLike = BackgroundMediaHolder & {
  blocks?: CmsBlockLike[];
};

function unwrapUrl(value: string): string {
  return value.replace(/^url\("([^"]+)"\)$/, "$1");
}

export function findFirstCmsImageUrl(
  sections: CmsSectionLike[],
  options?: { format?: string; quality?: number },
): string | undefined {
  for (const section of sections) {
    if (section.backgroundMedia?.url) {
      return unwrapUrl(
        getBackgroundImageUrl(
          `url("${section.backgroundMedia.url}")`,
          section,
          options,
        ),
      );
    }

    for (const block of section.blocks ?? []) {
      if (block.backgroundMedia?.url) {
        return unwrapUrl(
          getBackgroundImageUrl(
            `url("${block.backgroundMedia.url}")`,
            block,
            options,
          ),
        );
      }

      for (const slot of block.slots ?? []) {
        const media = (slot.data as { media?: { url?: string } } | undefined)
          ?.media;
        if (!media?.url) continue;
        try {
          const url = new URL(media.url);
          if (options?.format) url.searchParams.set("format", options.format);
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

  return undefined;
}
