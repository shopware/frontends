import { toProductCard } from "../projections";
import {
  PRODUCT_ASSOCIATIONS,
  PRODUCT_INCLUDES,
  defineLocalTool,
} from "../tool";

export const searchProducts = defineLocalTool({
  name: "search_products",
  title: "Search products",
  description:
    "Use when the shopper asks to find, look for or browse products by words. Returns up to 10 compact product cards with id, name, price and link. Does not change the cart.",
  params: {
    properties: {
      query: {
        type: "string",
        description: "Words to search for, e.g. a product name or category.",
        minLength: 1,
        maxLength: 200,
      },
      limit: {
        type: "integer",
        description: "How many results to return. Default 5.",
        minimum: 1,
        maximum: 10,
      },
    },
    required: ["query"],
  },
  annotations: { readOnlyHint: true, untrustedContentHint: true },
  minimumMode: "read_only",
  async execute(input, context, apiClient) {
    const { data } = await apiClient.invoke("searchPage post /search", {
      body: {
        search: input.query as string,
        limit: (input.limit as number | undefined) ?? 5,
        associations: PRODUCT_ASSOCIATIONS,
        includes: PRODUCT_INCLUDES,
      },
      fetchOptions: { signal: context.signal },
    });
    return {
      data: {
        total: data.total ?? data.elements.length,
        products: data.elements.map(toProductCard),
      },
    };
  },
});
