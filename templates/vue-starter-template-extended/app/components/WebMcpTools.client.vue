<script setup lang="ts">
import {
  getCategoryUrl,
  getProductRoute,
  getTranslatedProperty,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";

const PRODUCT_ID = /^[0-9a-f]{32}$/i;

const { apiClient } = useShopwareContext();
const { search: readProduct } = useProductSearch();
const { resolvePath } = useNavigationSearch();
const { navigationElements, loadNavigationElements } = useNavigation();
const {
  addProduct,
  cartItems,
  changeProductQuantity,
  isEmpty,
  refreshCart,
  removeItemById,
  subtotal,
  totalPrice,
} = useCart();
const { getErrorsCodes } = useCartNotification();
const { currency } = useSessionContext();
const { pushSuccess, pushWarning } = useNotifications();
const { t, te, locale } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const nuxtApp = useNuxtApp();

const categories = computed(() =>
  (navigationElements.value ?? [])
    .flatMap((category) => [category, ...(category.children ?? [])])
    .filter((category) => category.type === "page"),
);
const categoryName = (category: Schemas["Category"]) =>
  getTranslatedProperty(category, "name");

type LinePayload = { options?: { option: string }[] };

function productSummary(product: Schemas["Product"]) {
  const options = (product.options ?? []).map((option) =>
    getTranslatedProperty(option, "name"),
  );
  return {
    productId: product.id,
    name: getTranslatedProperty(product, "name"),
    ...(options.length ? { options } : {}),
    price: product.calculatedPrice?.unitPrice,
    available: product.available,
    url: localePath(getProductRoute(product).path),
  };
}

function cartSummary() {
  return {
    items: cartItems.value.map((item) => {
      const payload = item.payload as LinePayload | undefined;
      const options = payload?.options?.map(({ option }) => option) ?? [];
      return {
        lineItemId: item.id,
        productId: item.referencedId,
        name: item.label,
        ...(options.length ? { options } : {}),
        quantity: item.quantity,
        unitPrice: item.price?.unitPrice,
        lineTotal: item.price?.totalPrice,
      };
    }),
    subtotal: subtotal.value,
    total: totalPrice.value,
    currency: currency.value?.isoCode,
  };
}

function text(value: unknown, field: string) {
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new TypeError(`${field} must be a non-empty string.`);
}

function count(value: unknown, field: string, min: number) {
  if (Number.isInteger(value) && (value as number) >= min) {
    return value as number;
  }
  throw new TypeError(`${field} must be a whole number of at least ${min}.`);
}

function price(value: unknown, field: string) {
  if (value === undefined) return undefined;
  if (typeof value === "number" && value >= 0) return value;
  throw new TypeError(`${field} must be a number of 0 or more.`);
}

function productId(value: unknown) {
  if (typeof value === "string" && PRODUCT_ID.test(value)) return value;
  throw new TypeError("productId must be a product id from search_products.");
}

// Cart errors pile up in shared state, so drop old ones before each write.
async function changeCart(write: () => Promise<unknown>) {
  getErrorsCodes();
  await write();
  const warnings = getErrorsCodes().map((error) => {
    const key = `errors.${error.messageKey}`;
    return te(key) ? t(key, { ...error }) : error.message;
  });
  for (const message of warnings) pushWarning(message);
  return warnings;
}

// Opens the page with the same filters and order, so the shopper sees the same
// list. A new page must render before the next call changes its query.
async function showListing(
  path: string,
  query: Record<string, string | number | undefined>,
  listing: Schemas["ProductListingResult"],
) {
  const to = {
    path: localePath(path),
    query: { ...query, order: listing.sorting },
  };
  const rendered = new Promise<void>((resolve) => {
    if (router.resolve(to).path === router.currentRoute.value.path) {
      return resolve();
    }
    nuxtApp.hooks.hookOnce("page:finish", () => resolve());
    setTimeout(resolve, 5000);
  });
  await navigateTo(to);
  await rendered;
  return {
    total: listing.total,
    currency: currency.value?.isoCode,
    products: listing.elements.map(productSummary),
  };
}

function plainText(html: string) {
  const markup = html.replace(/</g, " <");
  const { body } = new DOMParser().parseFromString(markup, "text/html");
  return (body.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 600);
}

// The router follows the URL at once. useRoute() waits for the next page.
async function currentProductId() {
  const { path: url } = router.currentRoute.value;
  const prefix = `/${locale.value}/`;
  const path = url.startsWith(prefix) ? url.slice(prefix.length - 1) : url;
  const seoUrl = await resolvePath(path);
  if (seoUrl?.routeName === "frontend.detail.page") return seoUrl.foreignKey;
  throw new Error("The shopper is not on a product page. Pass a productId.");
}

useWebMcpTools([
  {
    name: "search_products",
    description:
      "Search products by name and show the results to the shopper. Returns up to 10 products with productId, name, price and url. To find products by type, use browse_category.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Words from a product name.",
        },
        minPrice: {
          type: "number",
          description: "Lowest price in the shop currency.",
        },
        maxPrice: {
          type: "number",
          description: "Highest price in the shop currency.",
        },
      },
      required: ["query"],
    },
    async execute(input) {
      const search = text(input.query, "query");
      const minPrice = price(input.minPrice, "minPrice");
      const maxPrice = price(input.maxPrice, "maxPrice");
      const filters = { "min-price": minPrice, "max-price": maxPrice };
      const { data } = await apiClient.invoke("searchPage post /search", {
        headers: { "sw-include-seo-urls": true },
        body: { search, limit: 10, ...filters },
      });
      return showListing("/search", { search, ...filters }, data);
    },
  },
  {
    name: "browse_category",
    description:
      "Open a category from the shop menu and show its products to the shopper. Returns up to 10 products with productId, name, price and url. An unknown name returns the menu's category names.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "A category name from the shop menu.",
        },
        minPrice: {
          type: "number",
          description: "Lowest price in the shop currency.",
        },
        maxPrice: {
          type: "number",
          description: "Highest price in the shop currency.",
        },
      },
      required: ["category"],
    },
    async execute(input) {
      const name = text(input.category, "category").toLowerCase();
      if (!categories.value.length) {
        await loadNavigationElements({ depth: 2 });
      }
      const category = categories.value.find(
        (item) => categoryName(item).toLowerCase() === name,
      );
      if (!category) {
        const names = categories.value.map(categoryName).join(", ");
        throw new Error(
          names
            ? `Unknown category. The shop menu has: ${names}.`
            : "The shop menu did not load. Try again later.",
        );
      }
      const minPrice = price(input.minPrice, "minPrice");
      const maxPrice = price(input.maxPrice, "maxPrice");
      const filters = { "min-price": minPrice, "max-price": maxPrice };
      const { data } = await apiClient.invoke(
        "readProductListing post /product-listing/{categoryId}",
        {
          headers: { "sw-include-seo-urls": true },
          pathParams: { categoryId: category.id },
          body: { limit: 10, ...filters },
        },
      );
      return showListing(getCategoryUrl(category), filters, data);
    },
  },
  {
    name: "get_product",
    description:
      "Get one product with price, stock and description. Leave out productId to get the product the shopper is looking at.",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "productId from search_products.",
        },
      },
    },
    annotations: { readOnlyHint: true },
    async execute(input) {
      const id =
        input.productId === undefined
          ? await currentProductId()
          : productId(input.productId);
      const { product } = await readProduct(id, {
        associations: { options: {} },
      });
      return {
        ...productSummary(product),
        currency: currency.value?.isoCode,
        stock: product.availableStock,
        description: plainText(getTranslatedProperty(product, "description")),
      };
    },
  },
  {
    name: "add_to_cart",
    description:
      "Add a product to the shopper's cart. The shopper sees a confirmation.",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "productId from search_products or get_product.",
        },
        quantity: { type: "integer", minimum: 1, default: 1 },
      },
      required: ["productId"],
    },
    async execute(input) {
      const id = productId(input.productId);
      const quantity =
        input.quantity === undefined ? 1 : count(input.quantity, "quantity", 1);
      const warnings = await changeCart(() => addProduct({ id, quantity }));
      const item = cartItems.value.find((line) => line.referencedId === id);
      if (!item) {
        throw new Error(
          warnings.join(" ") ||
            "The product was not added. If it has variants, call get_product with this productId and add the productId it returns.",
        );
      }
      if (!warnings.length) {
        pushSuccess(`${item.label} ${t("product.addedToCart")}`, {
          action: {
            label: t("product.viewCart"),
            to: localePath("/checkout/cart"),
          },
        });
      }
      return { ...cartSummary(), warnings };
    },
  },
  {
    name: "get_cart",
    description:
      "Get the shopper's cart: items with lineItemId and quantity, the subtotal, and the total with shipping.",
    annotations: { readOnlyHint: true },
    async execute() {
      await refreshCart();
      return cartSummary();
    },
  },
  {
    name: "update_cart_item",
    description: "Change the quantity of a cart item. Quantity 0 removes it.",
    inputSchema: {
      type: "object",
      properties: {
        lineItemId: {
          type: "string",
          description: "lineItemId from get_cart.",
        },
        quantity: { type: "integer", minimum: 0 },
      },
      required: ["lineItemId", "quantity"],
    },
    async execute(input) {
      const id = text(input.lineItemId, "lineItemId");
      const quantity = count(input.quantity, "quantity", 0);
      if (!cartItems.value.some((item) => item.id === id)) {
        throw new Error("No cart item with this lineItemId. Call get_cart.");
      }
      const warnings = await changeCart(() =>
        quantity === 0
          ? removeItemById(id)
          : changeProductQuantity({ id, quantity }),
      );
      return { ...cartSummary(), warnings };
    },
  },
  {
    name: "go_to_checkout",
    description:
      "Open the checkout page. The shopper reviews and places the order there. You cannot place orders.",
    async execute() {
      if (isEmpty.value) throw new Error("The cart is empty.");
      await navigateTo(localePath("/checkout"));
      return { url: localePath("/checkout") };
    },
  },
]);
</script>

<template>
  <span hidden />
</template>
