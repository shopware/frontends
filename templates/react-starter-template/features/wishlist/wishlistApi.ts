import { ApiClientError } from "@shopware/api-client";

import type { ApiClient, Schemas } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";

export type WishlistClient = Pick<ApiClient, "invoke">;

export const WISHLIST_IDS_LIMIT = 100;

export const WISHLIST_NOT_FOUND = "CHECKOUT__WISHLIST_NOT_FOUND";
export const WISHLIST_PRODUCT_NOT_FOUND =
  "CHECKOUT__WISHLIST_PRODUCT_NOT_FOUND";
export const CUSTOMER_NOT_LOGGED_IN =
  "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN";
export const DUPLICATE_WISHLIST_PRODUCT =
  "CHECKOUT__DUPLICATE_WISHLIST_PRODUCT";

export type WishlistPage = {
  elements: Schemas["Product"][];
  total: number;
};

export type WishlistIds = {
  productIds: string[];
  total: number;
};

export function hasApiErrorCode(error: unknown, code: string): boolean {
  if (!(error instanceof ApiClientError)) return false;
  const errors: unknown = error.details?.errors;
  return (
    Array.isArray(errors) &&
    errors.some(
      (apiError: { code?: unknown } | null) => apiError?.code === code,
    )
  );
}

async function readWishlist(
  client: WishlistClient,
  criteria: Schemas["Criteria"],
): Promise<WishlistPage> {
  try {
    const { data } = await client.invoke(
      "readCustomerWishlist post /customer/wishlist",
      {
        body: { ...criteria, "total-count-mode": "exact" },
        fetchOptions: { timeout: READ_TIMEOUT_MS },
      },
    );
    return {
      elements: data.products?.elements ?? [],
      total: data.products?.total ?? 0,
    };
  } catch (error) {
    if (hasApiErrorCode(error, WISHLIST_NOT_FOUND)) {
      return { elements: [], total: 0 };
    }
    throw error;
  }
}

export async function readWishlistIds(
  client: WishlistClient,
): Promise<WishlistIds> {
  const { elements, total } = await readWishlist(client, {
    limit: WISHLIST_IDS_LIMIT,
    includes: { product: ["id"] },
  });
  return { productIds: elements.map(({ id }) => id), total };
}

export function readWishlistPage(
  client: WishlistClient,
  { page, limit }: { page: number; limit: number },
): Promise<WishlistPage> {
  return readWishlist(client, {
    page,
    limit,
    associations: { seoUrls: {} },
  });
}

export type WishlistWriteOutcome = "changed" | "unchanged";

export async function addWishlistProduct(
  client: WishlistClient,
  productId: string,
): Promise<WishlistWriteOutcome> {
  try {
    await client.invoke(
      "addProductOnWishlist post /customer/wishlist/add/{productId}",
      { pathParams: { productId } },
    );
    return "changed";
  } catch (error) {
    if (hasApiErrorCode(error, DUPLICATE_WISHLIST_PRODUCT)) return "unchanged";
    throw error;
  }
}

export async function removeWishlistProduct(
  client: WishlistClient,
  productId: string,
): Promise<WishlistWriteOutcome> {
  try {
    await client.invoke(
      "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}",
      { pathParams: { productId } },
    );
    return "changed";
  } catch (error) {
    if (
      hasApiErrorCode(error, WISHLIST_PRODUCT_NOT_FOUND) ||
      hasApiErrorCode(error, WISHLIST_NOT_FOUND)
    ) {
      return "unchanged";
    }
    throw error;
  }
}
