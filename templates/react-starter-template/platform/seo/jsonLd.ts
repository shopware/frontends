import { getProductName, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

import { toPlainText, truncate } from "./text";
import { absoluteUrl } from "./urls";

export const JSON_LD_DESCRIPTION_MAX_LENGTH = 5000;

const SCHEMA = "https://schema.org";

export type JsonLdObject = Record<string, unknown>;

export type BreadcrumbTrailItem = { name: string; href?: string };

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function productAvailability(
  product: Schemas["Product"],
  now: number,
): string {
  const releaseDate = product.releaseDate
    ? Date.parse(product.releaseDate)
    : NaN;
  if (Number.isFinite(releaseDate) && releaseDate > now) {
    return `${SCHEMA}/PreOrder`;
  }
  const stock = product.availableStock ?? product.stock;
  const minPurchase = product.minPurchase ?? 1;
  if (product.available === false) return `${SCHEMA}/OutOfStock`;
  if (stock >= minPurchase) return `${SCHEMA}/InStock`;
  if (product.isCloseout) return `${SCHEMA}/OutOfStock`;
  return product.restockTime
    ? `${SCHEMA}/LimitedAvailability`
    : `${SCHEMA}/InStock`;
}

function gtin(ean: string | undefined): JsonLdObject {
  if (!ean || !/^\d+$/.test(ean)) return {};
  return [8, 12, 13, 14].includes(ean.length)
    ? { [`gtin${ean.length}`]: ean }
    : { gtin: ean };
}

function productImages(product: Schemas["Product"]): string[] {
  const urls = (product.media ?? [])
    .map((productMedia) => productMedia.media)
    .filter((media) => !!media?.url && !media.mimeType?.startsWith("video/"))
    .map((media) => media?.url as string);
  if (urls.length > 0) return [...new Set(urls)];
  return product.cover?.media?.url ? [product.cover.media.url] : [];
}

function offers(
  product: Schemas["Product"],
  currencyCode: string,
  availability: string,
  url: string | null,
): JsonLdObject {
  const common = {
    priceCurrency: currencyCode,
    availability,
    itemCondition: `${SCHEMA}/NewCondition`,
    ...(url ? { url } : {}),
  };
  const tiers = product.calculatedPrices ?? [];
  if (tiers.length > 1) {
    const prices = tiers.map((tier) => tier.unitPrice);
    return {
      "@type": "AggregateOffer",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: tiers.length,
      ...common,
    };
  }
  const price = (tiers[0] ?? product.calculatedPrice)?.unitPrice;
  return {
    "@type": "Offer",
    ...(typeof price === "number" ? { price } : {}),
    ...common,
  };
}

export function buildProductJsonLd({
  product,
  path,
  siteUrl,
  currencyCode,
  now,
}: {
  product: Schemas["Product"];
  path: string;
  siteUrl: URL | null;
  currencyCode: string;
  now: number;
}): JsonLdObject {
  const url = absoluteUrl(path, siteUrl);
  const description = truncate(
    toPlainText(getTranslatedProperty(product, "description")),
    JSON_LD_DESCRIPTION_MAX_LENGTH,
  );
  const brand = product.manufacturer
    ? getTranslatedProperty(product.manufacturer, "name")
    : "";
  const images = productImages(product);
  return {
    "@context": SCHEMA,
    "@type": "Product",
    ...(url ? { "@id": `${url}#product`, url } : {}),
    name: getProductName({ product }) ?? "",
    productID: product.id,
    sku: product.productNumber,
    ...(description ? { description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(product.manufacturerNumber ? { mpn: product.manufacturerNumber } : {}),
    ...gtin(product.ean),
    ...(product.releaseDate ? { releaseDate: product.releaseDate } : {}),
    offers: offers(
      product,
      currencyCode,
      productAvailability(product, now),
      url,
    ),
  };
}

export function buildBreadcrumbListJsonLd(
  items: BreadcrumbTrailItem[],
  siteUrl: URL | null,
): JsonLdObject | null {
  const listed = items.filter(
    (item, index) => !!item.href || index === items.length - 1,
  );
  if (!siteUrl || listed.length === 0) return null;
  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList",
    itemListElement: listed.map((item, index) => {
      const url = item.href ? absoluteUrl(item.href, siteUrl) : null;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(url ? { item: url } : {}),
      };
    }),
  };
}
