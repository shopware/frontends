import type { Schemas } from "@shopware/api-client/store-api-types";

import { WebMcpToolError } from "../../types";
import { toProductDetails } from "../projections";
import {
  PRODUCT_ASSOCIATIONS,
  PRODUCT_INCLUDES,
  defineLocalTool,
} from "../tool";
import type { StoreApiClient } from "../tool";

const PRODUCT_ID_PATTERN = "^[0-9a-f]{32}$";

/** Resolves a product by id or product number. Shared with the cart tools. */
export async function findProduct(
  apiClient: StoreApiClient,
  selector: { productId?: string; productNumber?: string },
  signal?: AbortSignal,
): Promise<Schemas["Product"]> {
  if (selector.productId) {
    const { data } = await apiClient.invoke(
      "readProductDetail post /product/{productId}",
      {
        pathParams: { productId: selector.productId },
        body: {
          associations: PRODUCT_ASSOCIATIONS,
          includes: PRODUCT_INCLUDES,
        },
        fetchOptions: { signal },
      },
    );
    return data.product;
  }
  if (selector.productNumber) {
    const { data } = await apiClient.invoke("readProduct post /product", {
      body: {
        filter: [
          {
            type: "equals",
            field: "productNumber",
            value: selector.productNumber,
          },
        ],
        limit: 1,
        associations: PRODUCT_ASSOCIATIONS,
        includes: PRODUCT_INCLUDES,
      },
      fetchOptions: { signal },
    });
    const product = data.elements?.[0];
    if (product) return product;
    throw new WebMcpToolError(
      `No product with number ${selector.productNumber}`,
      "failed",
    );
  }
  throw new WebMcpToolError(
    "Give a productId or productNumber, or open a product page first",
    "invalid_input",
  );
}

export const getProduct = defineLocalTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Use when the shopper asks about a specific product: price, availability, description or variant options. Without productId or productNumber it describes the product page the shopper is looking at. Does not change the cart.",
  params: {
    properties: {
      productId: {
        type: "string",
        description: "Product id (32 hex characters) from search_products.",
        maxLength: 32,
        pattern: PRODUCT_ID_PATTERN,
      },
      productNumber: {
        type: "string",
        description: "The shop's product number, e.g. SW10001.",
        minLength: 1,
        maxLength: 64,
      },
    },
  },
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  minimumMode: "read_only",
  async execute(input, context, apiClient) {
    const product = await findProduct(
      apiClient,
      {
        productId:
          (input.productId as string | undefined) ??
          (input.productNumber ? undefined : context.pageContext.productId),
        productNumber: input.productNumber as string | undefined,
      },
      context.signal,
    );
    return { data: toProductDetails(product) };
  },
});
