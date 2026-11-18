import type { Schemas } from "@shopware/api-client/store-api-types";
/**
 * Compact, allowlisted output shapes. Chrome recommends tool output under
 * roughly 1.5K characters, so these carry only what an agent needs to decide
 * and to hand the shopper a link. No personal data, no tokens.
 */
import { getProductUrl } from "@shopware/helpers";

export type ProductCard = {
  id: string;
  productNumber?: string;
  name: string;
  price?: number;
  listPrice?: number;
  available: boolean;
  url: string;
};

export type ProductDetails = ProductCard & {
  description?: string;
  options?: string[];
  isVariant: boolean;
};

export type CartItem = {
  lineItemId: string;
  productId?: string;
  name: string;
  quantity: number;
  type: string;
  total?: number;
};

export type CartSummary = {
  items: CartItem[];
  itemCount: number;
  total?: number;
  promotionCodes: string[];
  errors: string[];
};

const DESCRIPTION_LIMIT = 300;

export function stripHtml(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(input: string, limit = DESCRIPTION_LIMIT): string {
  return input.length > limit ? `${input.slice(0, limit - 1)}…` : input;
}

function productName(product: Schemas["Product"]): string {
  return stripHtml(product.translated?.name ?? product.name);
}

export function isAvailable(product: Schemas["Product"]): boolean {
  const stock = product.stock ?? 0;
  return stock > 0 || product.isCloseout !== true;
}

export function toProductCard(product: Schemas["Product"]): ProductCard {
  return {
    id: product.id,
    productNumber: product.productNumber,
    name: productName(product),
    price: product.calculatedPrice?.unitPrice,
    listPrice: product.calculatedPrice?.listPrice?.price,
    available: isAvailable(product),
    url: getProductUrl(product),
  };
}

export function toProductDetails(product: Schemas["Product"]): ProductDetails {
  const description = truncate(
    stripHtml(product.translated?.description ?? product.description),
  );
  const options = product.options
    ?.map((option) => {
      const group = option.group?.translated?.name ?? option.group?.name;
      const value = option.translated?.name ?? option.name;
      return group ? `${group}: ${value}` : value;
    })
    .filter((entry): entry is string => Boolean(entry));
  return {
    ...toProductCard(product),
    ...(description ? { description } : {}),
    ...(options && options.length > 0 ? { options } : {}),
    isVariant: Boolean(product.parentId),
  };
}

export function toCartSummary(cart: Schemas["Cart"]): CartSummary {
  const lineItems = cart.lineItems ?? [];
  const items = lineItems
    .filter((item) => item.type !== "promotion")
    .map((item): CartItem => ({
      lineItemId: item.id,
      productId: item.type === "product" ? item.referencedId : undefined,
      name: stripHtml(item.label),
      quantity: item.quantity ?? 0,
      type: item.type ?? "product",
      total: item.price?.totalPrice,
    }));
  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: cart.price?.totalPrice,
    promotionCodes: lineItems
      .filter((item) => item.type === "promotion")
      .map((item) => item.referencedId ?? "")
      .filter(Boolean),
    errors: Object.values(cart.errors ?? {})
      .map((error) => stripHtml(error.message))
      .filter(Boolean),
  };
}
