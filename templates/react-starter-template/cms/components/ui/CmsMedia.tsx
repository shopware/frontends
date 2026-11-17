import { getSrcSetForMedia } from "@shopware/helpers";
import type { ComponentProps } from "react";

export type CmsMediaSource = {
  url?: string;
  thumbnails?: Array<{ width: number; url: string }>;
};

export type CmsMediaProps = Omit<ComponentProps<"img">, "src" | "srcSet"> & {
  media?: CmsMediaSource | null;
  alt: string;
};

export function CmsMedia({
  media,
  alt,
  loading = "lazy",
  decoding = "async",
  ...props
}: CmsMediaProps) {
  if (!media?.url) return null;
  return (
    <img
      {...props}
      src={media.url}
      srcSet={getSrcSetForMedia(media)}
      alt={alt}
      loading={loading}
      decoding={decoding}
    />
  );
}
