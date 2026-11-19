import { getProductTierPrices, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const PRODUCT_ID = /^[0-9a-f]{32}$/i;

/** Cuts a list to what fits in `room` characters of JSON. Chrome advises at most 1.5K per answer. */
export function shorten<T>(items: T[], room: number) {
  let size = 0;
  const end = items.findIndex((item) => {
    size += JSON.stringify(item).length + 1;
    return size > room;
  });
  return end === -1 ? items : items.slice(0, end);
}

// Agents often send numbers as text.
const toNumber = (value: unknown) =>
  typeof value === "string" && value.trim() ? Number(value) : value;

export function readText(value: unknown, field: string) {
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new TypeError(`${field} must be a non-empty string.`);
}

export function readCount(value: unknown, field: string, min: number) {
  const parsed = toNumber(value);
  if (Number.isInteger(parsed) && (parsed as number) >= min) {
    return parsed as number;
  }
  throw new TypeError(`${field} must be a whole number of at least ${min}.`);
}

export function readPrice(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  const parsed = toNumber(value);
  if (typeof parsed === "number" && Number.isFinite(parsed) && parsed >= 0) {
    return parsed;
  }
  throw new TypeError(`${field} must be a number of 0 or more.`);
}

export function readProductId(value: unknown) {
  if (typeof value === "string" && PRODUCT_ID.test(value)) return value;
  throw new TypeError(
    "productId must be a productId from search_products or browse_category.",
  );
}

export function productSummary(product: Schemas["Product"]) {
  const options = (product.options ?? []).map((option) =>
    getTranslatedProperty(option, "name"),
  );
  // With volume prices, the first one is the price of a single item.
  const [single] = getProductTierPrices(product);
  const unitPrice = single?.unitPrice ?? product.calculatedPrice?.unitPrice;
  // The price filters and the product card use the lowest volume or variant price.
  const lowest = product.calculatedCheapestPrice?.unitPrice;
  return {
    productId: product.id,
    name: getTranslatedProperty(product, "name"),
    ...(options.length ? { options } : {}),
    price: unitPrice,
    ...(lowest !== undefined && unitPrice !== undefined && lowest < unitPrice
      ? { priceFrom: lowest }
      : {}),
    ...(product.available ? {} : { available: false }),
  };
}

type LinePayload = { options?: { option: string }[] };

export function cartAnswer(
  lineItems: Schemas["LineItem"][],
  totals: { subtotal: number; total: number; currency?: string },
) {
  const lines = lineItems.map((item) => {
    const payload = item.payload as LinePayload | undefined;
    const options = payload?.options?.map(({ option }) => option) ?? [];
    return {
      ...(item.type === "product"
        ? { productId: item.referencedId }
        : { type: item.type }),
      name: item.label,
      ...(options.length ? { options } : {}),
      quantity: item.quantity,
      unitPrice: item.price?.unitPrice,
      lineTotal: item.price?.totalPrice,
    };
  });
  const items = shorten(lines, 1000);
  return {
    items,
    ...(items.length < lines.length
      ? { moreItems: lines.length - items.length }
      : {}),
    ...totals,
  };
}

export function listingAnswer(
  listing: Schemas["ProductListingResult"],
  {
    currency,
    shown,
    categories,
  }: { currency?: string; shown: boolean; categories?: string[] },
) {
  const products = shorten(listing.elements.map(productSummary), 1300);
  const total = listing.total ?? products.length;
  const hints: string[] = [];
  if (!shown) {
    hints.push(
      "The shopper opened another page, so this list is not on screen.",
    );
  }
  if (!total) {
    hints.push(
      "No products found. Try other words, another price range, or browse_category with one of these categories.",
    );
  } else if (products.length < total) {
    hints.push(
      `Showing ${products.length} of ${total} products. Set minPrice or maxPrice to see others.`,
    );
  }
  return {
    total,
    currency,
    products,
    ...(hints.length ? { hint: hints.join(" ") } : {}),
    ...(!total && categories ? { categories } : {}),
  };
}

/** The page path without the language prefix, as Shopware's SEO URLs have no prefix. */
export function pathWithoutLocale(path: string, locale: string) {
  const prefix = `/${locale}/`;
  return path.startsWith(prefix) ? path.slice(prefix.length - 1) : path;
}
