<script setup lang="ts">
import {
  getCategoryUrl,
  getProductRoute,
  getProductTierPrices,
  getTranslatedProperty,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";
import type { WebMcpToolHandler } from "~/composables/useWebMcpTools";
import type { WebMcpToolName } from "~/utils/webMcpTools";

const PRODUCT_ID = /^[0-9a-f]{32}$/i;

const { apiClient } = useShopwareContext();
const { search: readProduct } = useProductSearch();
const { resolvePath } = useNavigationSearch();
const { navigationElements, loadNavigationElements } = useNavigation();
const {
  addProduct,
  cart,
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

// Chrome advises at most 1.5K characters per tool answer, so lists are cut to fit.
function fit<T>(items: T[], room: number) {
  let size = 0;
  const end = items.findIndex((item) => {
    size += JSON.stringify(item).length + 1;
    return size > room;
  });
  return end === -1 ? items : items.slice(0, end);
}

const categories = computed(() => {
  const menu = navigationElements.value ?? [];
  return [
    ...menu,
    ...menu.flatMap((category) => category.children ?? []),
  ].filter((category) => category.type === "page");
});
const categoryName = (category: Schemas["Category"]) =>
  getTranslatedProperty(category, "name");
const categoryNames = (menu: Schemas["Category"][]) =>
  fit([...new Set(menu.map(categoryName))], 1000);

async function loadCategories() {
  if (!categories.value.length) await loadNavigationElements({ depth: 2 });
  return categories.value;
}

type LinePayload = { options?: { option: string }[] };

function productSummary(product: Schemas["Product"]) {
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
    url: localePath(getProductRoute(product).path),
  };
}

function cartSummary() {
  const lines = cartItems.value.map((item) => {
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
  const items = fit(lines, 1000);
  return {
    items,
    ...(items.length < lines.length
      ? { moreItems: lines.length - items.length }
      : {}),
    subtotal: subtotal.value,
    total: totalPrice.value,
    currency: currency.value?.isoCode,
  };
}

const cartLine = (id: string) =>
  cartItems.value.find(
    (item) => item.type === "product" && item.referencedId === id,
  );

// The app loads the cart after it mounts. A tool can be called before that.
async function loadCart() {
  if (!cart.value) await refreshCart();
}

function text(value: unknown, field: string) {
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new TypeError(`${field} must be a non-empty string.`);
}

// Agents often send numbers as text.
const toNumber = (value: unknown) =>
  typeof value === "string" && value.trim() ? Number(value) : value;

function count(value: unknown, field: string, min: number) {
  const parsed = toNumber(value);
  if (Number.isInteger(parsed) && (parsed as number) >= min) {
    return parsed as number;
  }
  throw new TypeError(`${field} must be a whole number of at least ${min}.`);
}

function price(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  const parsed = toNumber(value);
  if (typeof parsed === "number" && Number.isFinite(parsed) && parsed >= 0) {
    return parsed;
  }
  throw new TypeError(`${field} must be a number of 0 or more.`);
}

function productId(value: unknown) {
  if (typeof value === "string" && PRODUCT_ID.test(value)) return value;
  throw new TypeError(
    "productId must be a productId from search_products or browse_category.",
  );
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
    products: fit(listing.elements.map(productSummary), 1300),
    ...(listing.total
      ? {}
      : {
          hint: "No products found. Try other words, another price range, or browse_category with one of these categories.",
          categories: categoryNames(await loadCategories()),
        }),
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

useWebMcpToolHandlers({
  async search_products(input) {
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

  async browse_category(input) {
    const name = text(input.category, "category").toLowerCase();
    const menu = await loadCategories();
    const category = menu.find(
      (item) => categoryName(item).toLowerCase() === name,
    );
    if (!category) {
      if (!menu.length) {
        throw new Error("The shop menu did not load. Try again later.");
      }
      return {
        error: "The shop menu has no category with this name.",
        categories: categoryNames(menu),
      };
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

  async get_product(input) {
    const id =
      input.productId === undefined || input.productId === null
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

  async add_to_cart(input) {
    const id = productId(input.productId);
    const quantity =
      input.quantity === undefined || input.quantity === null
        ? 1
        : count(input.quantity, "quantity", 1);
    const warnings = await changeCart(() => addProduct({ id, quantity }));
    const line = cartLine(id);
    if (!line) {
      throw new Error(
        warnings.join(" ") ||
          "The product was not added. If it has variants, call get_product with this productId and add the productId it returns.",
      );
    }
    if (!warnings.length) {
      pushSuccess(`${line.label} ${t("product.addedToCart")}`, {
        action: {
          label: t("product.viewCart"),
          to: localePath("/checkout/cart"),
        },
      });
    }
    return { ...cartSummary(), warnings };
  },

  async get_cart() {
    await refreshCart();
    return cartSummary();
  },

  async update_cart_item(input) {
    const id = productId(input.productId);
    const quantity = count(input.quantity, "quantity", 0);
    await loadCart();
    const line = cartLine(id);
    if (!line) {
      throw new Error(
        "This product is not in the cart. Call get_cart to see the items.",
      );
    }
    const warnings = await changeCart(() =>
      quantity === 0
        ? removeItemById(line.id)
        : changeProductQuantity({ id: line.id, quantity }),
    );
    return { ...cartSummary(), warnings };
  },

  async go_to_checkout() {
    await loadCart();
    if (isEmpty.value) {
      throw new Error("The cart is empty. Add a product first.");
    }
    await navigateTo(localePath("/checkout"));
    return { url: localePath("/checkout") };
  },
} satisfies Record<WebMcpToolName, WebMcpToolHandler>);
</script>

<template>
  <span hidden />
</template>
