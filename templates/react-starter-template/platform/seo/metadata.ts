import { getTranslatedProperty } from "@shopware/helpers";
import type { Metadata } from "next";

import type { Schemas } from "#shopware";

import type { LanguageAlternates } from "./hreflang";
import { toPlainText, truncate } from "./text";
import { absoluteUrl } from "./urls";

export const DESCRIPTION_MAX_LENGTH = 255;

export type SeoContext = {
  canonicalPath: string;
  siteUrl: URL | null;
  siteName: string;
  languages?: LanguageAlternates;
};

type OpenGraphImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

function describe(metaDescription: string, description: string): string {
  return (
    metaDescription ||
    truncate(toPlainText(description), DESCRIPTION_MAX_LENGTH)
  );
}

export function openGraphImage(
  media: Schemas["Media"] | null | undefined,
): OpenGraphImage | undefined {
  if (!media?.url) return undefined;
  const alt = getTranslatedProperty(media, "alt");
  return {
    url: media.url,
    ...(media.metaData?.width ? { width: media.metaData.width } : {}),
    ...(media.metaData?.height ? { height: media.metaData.height } : {}),
    ...(alt ? { alt } : {}),
  };
}

function pageMetadata(
  context: SeoContext,
  fields: {
    title: string;
    description: string;
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
    image?: OpenGraphImage;
  },
): Metadata {
  const url = absoluteUrl(context.canonicalPath, context.siteUrl);
  const description = fields.description || undefined;
  return {
    ...(fields.title ? { title: fields.title } : {}),
    ...(description ? { description } : {}),
    ...(fields.keywords ? { keywords: fields.keywords } : {}),
    alternates: {
      canonical: url ?? context.canonicalPath,
      ...(context.languages ? { languages: context.languages } : {}),
    },
    openGraph: {
      type: "website",
      siteName: context.siteName,
      ...(fields.ogTitle || fields.title
        ? { title: fields.ogTitle || fields.title }
        : {}),
      ...(fields.ogDescription || description
        ? { description: fields.ogDescription || description }
        : {}),
      ...(url ? { url } : {}),
      ...(fields.image ? { images: [fields.image] } : {}),
    },
  };
}

export function categoryMetadata(
  category: Schemas["Category"],
  context: SeoContext,
): Metadata {
  return pageMetadata(context, {
    title:
      getTranslatedProperty(category, "metaTitle") ||
      getTranslatedProperty(category, "name"),
    description: describe(
      getTranslatedProperty(category, "metaDescription"),
      getTranslatedProperty(category, "description"),
    ),
    keywords: getTranslatedProperty(category, "keywords"),
    image: openGraphImage(category.media),
  });
}

export function homeMetadata(
  category: Schemas["Category"],
  context: SeoContext,
): Metadata {
  const metaTitle = getTranslatedProperty(category, "metaTitle");
  const metadata = pageMetadata(context, {
    title: metaTitle,
    description: getTranslatedProperty(category, "metaDescription"),
    keywords: getTranslatedProperty(category, "keywords"),
    ogTitle: metaTitle || context.siteName,
    image: openGraphImage(category.media),
  });
  return metaTitle
    ? { ...metadata, title: { absolute: `${metaTitle} | ${context.siteName}` } }
    : metadata;
}

export function productMetadata(
  product: Schemas["Product"],
  context: SeoContext,
): Metadata {
  const title =
    getTranslatedProperty(product, "metaTitle") ||
    getTranslatedProperty(product, "name");
  return pageMetadata(context, {
    title,
    description: describe(
      getTranslatedProperty(product, "metaDescription"),
      getTranslatedProperty(product, "description"),
    ),
    keywords: getTranslatedProperty(product, "keywords"),
    ogTitle: getTranslatedProperty(product, "ogTitle"),
    ogDescription: getTranslatedProperty(product, "ogDescription"),
    image: openGraphImage(product.openGraphMedia ?? product.cover?.media),
  });
}

export function landingPageMetadata(
  landingPage: Schemas["LandingPage"],
  context: SeoContext,
): Metadata {
  return pageMetadata(context, {
    title:
      getTranslatedProperty(landingPage, "metaTitle") ||
      getTranslatedProperty(landingPage, "name"),
    description: getTranslatedProperty(landingPage, "metaDescription"),
    keywords: getTranslatedProperty(landingPage, "keywords"),
  });
}

export function customerGroupRegistrationMetadata(
  group: { title: string; metaDescription: string | null },
  context: SeoContext | null,
): Metadata {
  const fields = {
    title: group.title,
    description: group.metaDescription ?? "",
    keywords: "",
  };
  if (context) return pageMetadata(context, fields);
  return {
    title: fields.title,
    ...(fields.description ? { description: fields.description } : {}),
  };
}
