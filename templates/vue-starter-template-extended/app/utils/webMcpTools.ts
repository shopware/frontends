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

const error = {
  type: "string",
  description: "What went wrong and what to do next.",
};
const strings = { type: "array", items: { type: "string" } };

// Answer shapes, for the tools whose ids feed later calls (Chrome 159+).
// An error answer must match too, or a client that checks answers hides it.
const listing = {
  type: "object",
  properties: {
    total: { type: "integer", description: "All matches, also unlisted ones." },
    currency: { type: "string" },
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          name: { type: "string" },
          options: strings,
          price: { type: "number", description: "Price of one item." },
          priceFrom: {
            type: "number",
            description: "Lowest volume or variant price.",
          },
          available: { type: "boolean", description: "Only sent when false." },
        },
        required: ["productId", "name"],
      },
    },
    hint: { type: "string" },
    categories: strings,
    error,
  },
  anyOf: [{ required: ["products"] }, { required: ["error"] }],
};

const cart = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          type: {
            type: "string",
            description: "Only on lines that are not products.",
          },
          name: { type: "string" },
          options: strings,
          quantity: { type: "integer" },
          unitPrice: { type: "number" },
          lineTotal: { type: "number" },
        },
        required: ["quantity"],
      },
    },
    moreItems: {
      type: "integer",
      description: "Lines left out to keep it short.",
    },
    subtotal: { type: "number" },
    total: { type: "number", description: "With shipping." },
    currency: { type: "string" },
    error,
  },
  anyOf: [{ required: ["items"] }, { required: ["error"] }],
};

/** The tools an agent sees. `WebMcpTools.client.vue` holds what each one does. */
export const webMcpTools = [
  {
    name: "search_products",
    title: "Search products",
    description:
      "Search products by name and show the results to the shopper. Returns the first products with productId, name and price, and the total. Use browse_category to find products by type.",
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
    outputSchema: listing,
  },
  {
    name: "browse_category",
    title: "Browse a category",
    description:
      "Open a category from the shop menu and show its products to the shopper. Returns the first products with productId, name and price, and the total. An unknown name returns the category names.",
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
    outputSchema: listing,
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
    outputSchema: cart,
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

type Labels = Record<WebMcpToolName | "assistant", string>;

// The words match the shop's own buttons in each language.
const translated: Record<string, Labels> = {
  de: {
    assistant: "Assistent",
    search_products: "Produkte suchen",
    browse_category: "Kategorie anzeigen",
    get_product: "Produktdetails anzeigen",
    add_to_cart: "Zum Warenkorb hinzufügen",
    get_cart: "Warenkorb anzeigen",
    update_cart_item: "Menge im Warenkorb ändern",
    go_to_checkout: "Zur Kasse",
  },
  pl: {
    assistant: "Asystent",
    search_products: "Szukaj produktów",
    browse_category: "Pokaż kategorię",
    get_product: "Pokaż szczegóły produktu",
    add_to_cart: "Dodaj do koszyka",
    get_cart: "Zobacz koszyk",
    update_cart_item: "Zmień ilość w koszyku",
    go_to_checkout: "Przejdź do kasy",
  },
};

/** Tool titles and the word for the assistant, in the page language or in English. */
export function webMcpLabels(language: string): Labels {
  const english = { assistant: "Assistant" } as Labels;
  for (const { name, title } of webMcpTools) english[name] = title;
  return translated[language.slice(0, 2).toLowerCase()] ?? english;
}
