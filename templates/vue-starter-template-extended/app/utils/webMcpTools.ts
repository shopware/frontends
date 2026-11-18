import type { WebMcpTool } from "~/composables/useWebMcpTools";

const noInput = { type: "object", properties: {} };

const priceRange = {
  minPrice: {
    type: "number",
    description: "Lowest price in the shop currency.",
  },
  maxPrice: {
    type: "number",
    description: "Highest price in the shop currency.",
  },
};

/** The tools an agent sees. `WebMcpTools.client.vue` holds what each one does. */
export const webMcpTools = [
  {
    name: "search_products",
    title: "Search products",
    description:
      "Search products by name and show the results to the shopper. Returns the first products with productId, name, price and url, and the total. Use browse_category to find products by type.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Words from a product name.",
        },
        ...priceRange,
      },
      required: ["query"],
    },
  },
  {
    name: "browse_category",
    title: "Browse a category",
    description:
      "Open a category from the shop menu and show its products to the shopper. Returns the first products with productId, name, price and url, and the total. An unknown name returns the category names.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "A category name from the shop menu.",
        },
        ...priceRange,
      },
      required: ["category"],
    },
  },
  {
    name: "get_product",
    title: "Get product details",
    description:
      "Get one product with price, stock and description. Leave out productId to get the product the shopper is looking at.",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "productId from search_products or browse_category.",
        },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "add_to_cart",
    title: "Add to cart",
    description:
      "Add a product to the shopper's cart. The shopper sees a confirmation. Returns the cart.",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description:
            "productId from search_products, browse_category or get_product.",
        },
        quantity: { type: "integer", minimum: 1, default: 1 },
      },
      required: ["productId"],
    },
  },
  {
    name: "get_cart",
    title: "View cart",
    description:
      "Get the shopper's cart: items with productId and quantity, the subtotal, and the total with shipping.",
    inputSchema: noInput,
    annotations: { readOnlyHint: true },
  },
  {
    name: "update_cart_item",
    title: "Change cart quantity",
    description:
      "Set the quantity of a product in the cart. Quantity 0 removes it. Returns the cart.",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "productId of an item in the cart.",
        },
        quantity: { type: "integer", minimum: 0 },
      },
      required: ["productId", "quantity"],
    },
  },
  {
    name: "go_to_checkout",
    title: "Go to checkout",
    description:
      "Open the checkout page, where the shopper reviews and places the order.",
    inputSchema: noInput,
  },
] as const satisfies readonly WebMcpTool[];

export type WebMcpToolName = (typeof webMcpTools)[number]["name"];
