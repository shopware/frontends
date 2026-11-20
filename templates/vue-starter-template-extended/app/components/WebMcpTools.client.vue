<script setup lang="ts">
import {
  getCategoryUrl,
  getProductRoute,
  getTranslatedProperty,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";
import {
  cartAnswer,
  listingAnswer,
  pathWithoutLocale,
  productSummary,
  readCount,
  readPrice,
  readProductId,
  readText,
  shorten,
} from "~/utils/webmcp/answers";
import type { WebMcpToolHandler } from "~/utils/webmcp/register";
import { webMcpLabels } from "~/utils/webmcp/tools";
import type { WebMcpToolName } from "~/utils/webmcp/tools";

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
  shorten([...new Set(menu.map(categoryName))], 1000);

async function loadCategories() {
  if (!categories.value.length) await loadNavigationElements({ depth: 2 });
  return categories.value;
}

const currentCart = () =>
  cartAnswer(cartItems.value, {
    subtotal: subtotal.value,
    total: totalPrice.value,
    currency: currency.value?.isoCode,
  });

const cartLine = (id: string) =>
  cartItems.value.find(
    (item) => item.type === "product" && item.referencedId === id,
  );

// app.vue reads the cart after it mounts and does not wait for the answer.
// A cart change made before that answer lands would be undone on screen.
const firstCartRead = new Promise<void>((resolve) => {
  if (cart.value) return resolve();
  const timer = setTimeout(done, 10_000);
  const unwatch = watch(cart, (value) => value && done());
  function done() {
    clearTimeout(timer);
    unwatch();
    resolve();
  }
});

async function loadCart(stop: AbortSignal) {
  await firstCartRead;
  if (!cart.value) await refreshCart();
  stop.throwIfAborted();
}

// Counts navigations, so a call never moves a shopper who opened another page.
let navigations = 0;
onBeforeUnmount(
  router.beforeEach(() => {
    navigations++;
  }),
);
function sinceNow() {
  const start = navigations;
  return () => navigations !== start;
}

// Cart errors pile up in shared state, so drop old ones before each write.
// A stopped call shows nothing more to the shopper.
async function changeCart(write: () => Promise<unknown>, stop: AbortSignal) {
  getErrorsCodes();
  await write();
  const warnings = getErrorsCodes().map((error) => {
    const key = `errors.${error.messageKey}`;
    return te(key) ? t(key, { ...error }) : error.message;
  });
  if (!stop.aborted) for (const message of warnings) pushWarning(message);
  return shorten(warnings, 300);
}

// Resolves when the next page has rendered, or after 5 seconds.
function nextPage() {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(done, 5000);
    const unhook = nuxtApp.hooks.hookOnce("page:finish", done);
    function done() {
      clearTimeout(timer);
      unhook();
      resolve();
    }
  });
}

// The tool reads the list itself, so its answer does not depend on when the
// page loads. The page then reads it again: two requests per call, on purpose.
// It opens the page with the same filters and order, so the shopper sees the
// same list. A new page must render before the next call changes its query.
async function showListing(
  path: string,
  query: Record<string, string | number | undefined>,
  listing: Schemas["ProductListingResult"],
  stop: AbortSignal,
  movedOn: () => boolean,
) {
  const to = {
    path: localePath(path),
    query: { ...query, order: listing.sorting },
  };
  const target = router.resolve(to);
  // A shopper who went on to the cart or checkout stays there.
  stop.throwIfAborted();
  // So does a shopper who opened another page while the list loaded.
  let shown = false;
  if (!movedOn()) {
    const rendered =
      target.path === router.currentRoute.value.path ? undefined : nextPage();
    await navigateTo(to);
    shown = router.currentRoute.value.fullPath === target.fullPath;
    if (shown) await rendered;
  }
  return listingAnswer(listing, {
    currency: currency.value?.isoCode,
    shown,
    categories: listing.total
      ? undefined
      : categoryNames(await loadCategories()),
  });
}

function plainText(html: string) {
  const markup = html.replace(/</g, " <");
  const { body } = new DOMParser().parseFromString(markup, "text/html");
  return (body.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 600);
}

// The router follows the URL at once. useRoute() waits for the next page.
async function currentProductId() {
  const path = pathWithoutLocale(router.currentRoute.value.path, locale.value);
  const seoUrl = await resolvePath(path);
  if (seoUrl?.routeName === "frontend.detail.page") return seoUrl.foreignKey;
  throw new Error("The shopper is not on a product page. Pass a productId.");
}

const handlers = {
  async search_products(input, stop) {
    const movedOn = sinceNow();
    const search = readText(input.query, "query");
    const minPrice = readPrice(input.minPrice, "minPrice");
    const maxPrice = readPrice(input.maxPrice, "maxPrice");
    const filters = { "min-price": minPrice, "max-price": maxPrice };
    const { data } = await apiClient.invoke("searchPage post /search", {
      headers: { "sw-include-seo-urls": true },
      body: { search, limit: 10, ...filters },
      fetchOptions: { signal: stop },
    });
    return showListing("/search", { search, ...filters }, data, stop, movedOn);
  },

  async browse_category(input, stop) {
    const movedOn = sinceNow();
    const name = readText(input.category, "category").toLowerCase();
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
    const minPrice = readPrice(input.minPrice, "minPrice");
    const maxPrice = readPrice(input.maxPrice, "maxPrice");
    const filters = { "min-price": minPrice, "max-price": maxPrice };
    const { data } = await apiClient.invoke(
      "readProductListing post /product-listing/{categoryId}",
      {
        headers: { "sw-include-seo-urls": true },
        pathParams: { categoryId: category.id },
        body: { limit: 10, ...filters },
        fetchOptions: { signal: stop },
      },
    );
    return showListing(getCategoryUrl(category), filters, data, stop, movedOn);
  },

  async get_product(input) {
    const id =
      input.productId === undefined || input.productId === null
        ? await currentProductId()
        : readProductId(input.productId);
    const { product } = await readProduct(id, {
      associations: { options: {} },
    });
    return {
      ...productSummary(product),
      url: localePath(getProductRoute(product).path),
      currency: currency.value?.isoCode,
      stock: product.availableStock,
      description: plainText(getTranslatedProperty(product, "description")),
    };
  },

  async add_to_cart(input, stop) {
    const id = readProductId(input.productId);
    const quantity =
      input.quantity === undefined || input.quantity === null
        ? 1
        : readCount(input.quantity, "quantity", 1);
    await loadCart(stop);
    const warnings = await changeCart(() => addProduct({ id, quantity }), stop);
    const line = cartLine(id);
    if (!line) {
      throw new Error(
        warnings.join(" ") ||
          "The product was not added. If it has variants, call get_product with this productId and add the productId it returns.",
      );
    }
    if (!warnings.length && !stop.aborted) {
      pushSuccess(`${line.label} ${t("product.addedToCart")}`, {
        action: {
          label: t("product.viewCart"),
          to: localePath("/checkout/cart"),
        },
      });
    }
    return { ...currentCart(), warnings };
  },

  async get_cart() {
    await firstCartRead;
    await refreshCart();
    return currentCart();
  },

  async update_cart_item(input, stop) {
    const id = readProductId(input.productId);
    const quantity = readCount(input.quantity, "quantity", 0);
    await loadCart(stop);
    const line = cartLine(id);
    if (!line) {
      throw new Error(
        "This product is not in the cart. Call get_cart to see the items.",
      );
    }
    const warnings = await changeCart(
      () =>
        quantity === 0
          ? removeItemById(line.id)
          : changeProductQuantity({ id: line.id, quantity }),
      stop,
    );
    return { ...currentCart(), warnings };
  },

  async go_to_checkout(_input, stop) {
    const movedOn = sinceNow();
    await loadCart(stop);
    if (isEmpty.value) {
      throw new Error("The cart is empty. Add a product first.");
    }
    if (movedOn()) {
      throw new Error(
        "The shopper opened another page meanwhile, so checkout was not opened.",
      );
    }
    await navigateTo(localePath("/checkout"));
    return { url: localePath("/checkout") };
  },
} satisfies Record<WebMcpToolName, WebMcpToolHandler>;

// The shopper sees every step, also the ones that change nothing on the page.
const activity = ref("");
let fade: ReturnType<typeof setTimeout> | undefined;

function announced(name: WebMcpToolName): WebMcpToolHandler {
  return async (input, stop) => {
    const labels = webMcpLabels(locale.value);
    clearTimeout(fade);
    activity.value = `${labels.assistant}: ${labels[name]}`;
    try {
      return await handlers[name](input, stop);
    } finally {
      fade = setTimeout(() => {
        activity.value = "";
      }, 3000);
    }
  };
}

let stopServing = () => {};
onMounted(() => {
  const names = Object.keys(handlers) as WebMcpToolName[];
  stopServing = nuxtApp.$serveWebMcpTools(
    Object.fromEntries(names.map((name) => [name, announced(name)])),
  );
});
onBeforeUnmount(() => {
  stopServing();
  clearTimeout(fade);
});
</script>

<template>
  <p
    role="status"
    data-testid="agent-activity"
    :class="
      activity
        ? 'pointer-events-none fixed bottom-4 left-4 z-40 m-0 rounded-md bg-surface-inverse-surface px-4 py-2 text-sm text-surface-inverse-on-surface shadow-lg'
        : 'sr-only'
    "
  >
    {{ activity }}
  </p>
</template>
