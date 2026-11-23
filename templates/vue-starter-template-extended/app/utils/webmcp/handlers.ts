import {
  getCategoryUrl,
  getProductRoute,
  getTranslatedProperty,
} from "@shopware/helpers";
import { computed } from "vue";
import type { RouteLocationRaw, Router } from "vue-router";

import type { Schemas } from "#shopware";

import {
  LISTING_INCLUDES,
  cartAnswer,
  cartWarnings,
  listingAnswer,
  pathWithoutLocale,
  productAnswer,
  readCount,
  readPrice,
  readProductId,
  readText,
  shorten,
} from "./answers";
import { trackNavigations, unlessStopped, whenSet } from "./guards";
import type { WebMcpToolHandler } from "./register";
import type { WebMcpToolName } from "./tools";

/** What the tools use from the page. `WebMcpTools.client.vue` passes the shop's composables. */
export type WebMcpPage = {
  apiClient: Pick<ReturnType<typeof useShopwareContext>["apiClient"], "invoke">;
  invokeRead: ReturnType<typeof useCacheableRead>["invokeRead"];
  cart: Pick<
    ReturnType<typeof useCart>,
    | "addProduct"
    | "cart"
    | "cartItems"
    | "changeProductQuantity"
    | "consumeCartErrors"
    | "isEmpty"
    | "refreshCart"
    | "removeItemById"
    | "subtotal"
    | "totalPrice"
  >;
  currency: ReturnType<typeof useSessionContext>["currency"];
  navigation: Pick<
    ReturnType<typeof useNavigation>,
    "navigationElements" | "loadNavigationElements"
  >;
  resolvePath: ReturnType<typeof useNavigationSearch>["resolvePath"];
  notifications: Pick<
    ReturnType<typeof useNotifications>,
    "pushSuccess" | "pushWarning"
  >;
  i18n: Pick<ReturnType<typeof useI18n>, "t" | "te" | "locale">;
  localePath: (path: string) => string;
  router: Router;
  navigate: (to: RouteLocationRaw) => unknown;
  /** Resolves when the next page has rendered. */
  nextPage: () => Promise<void>;
};

/** The tool handlers. Call `dispose` when the page goes away. */
export function createWebMcpHandlers(page: WebMcpPage) {
  const { i18n, localePath, notifications, router } = page;
  const {
    addProduct,
    cart,
    cartItems,
    changeProductQuantity,
    consumeCartErrors,
    isEmpty,
    refreshCart,
    removeItemById,
    subtotal,
    totalPrice,
  } = page.cart;

  const categories = computed(() => {
    const menu = page.navigation.navigationElements.value ?? [];
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
    if (!categories.value.length) {
      await page.navigation.loadNavigationElements({ depth: 2 });
    }
    return categories.value;
  }

  const currentCart = () =>
    cartAnswer(cartItems.value, {
      subtotal: subtotal.value,
      total: totalPrice.value,
      currency: page.currency.value?.isoCode,
    });

  const cartLine = (id: string) =>
    cartItems.value.find(
      (item) => item.type === "product" && item.referencedId === id,
    );

  // app.vue reads the cart after it mounts and does not wait for the answer.
  // A cart change made before that answer lands would be undone on screen.
  const firstCartRead = whenSet(cart, 10_000);

  async function loadCart(stop: AbortSignal) {
    await unlessStopped(stop, firstCartRead);
    if (!cart.value) await unlessStopped(stop, refreshCart());
    stop.throwIfAborted();
  }

  // So a call never moves a shopper who opened another page after the call was made.
  const navigations = trackNavigations(router);

  // The warnings come from the write's own answer. The shared error list is
  // emptied after it, so the shopper's next click does not show them again.
  // A stopped call shows nothing more to the shopper.
  async function changeCart(
    write: () => Promise<Schemas["Cart"]>,
    stop: AbortSignal,
  ) {
    const result = await write();
    consumeCartErrors();
    const warnings = cartWarnings(result).map((error) => {
      const key = `errors.${error.messageKey}`;
      return i18n.te(key) ? i18n.t(key, { ...error }) : error.message;
    });
    if (!stop.aborted) {
      for (const message of warnings) notifications.pushWarning(message);
    }
    return shorten(warnings, 300);
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
        target.path === router.currentRoute.value.path
          ? undefined
          : page.nextPage();
      await navigations.own(() => page.navigate(to));
      shown = router.currentRoute.value.fullPath === target.fullPath;
      if (shown) await rendered;
    }
    return listingAnswer(listing, {
      currency: page.currency.value?.isoCode,
      shown,
      categories: listing.total
        ? undefined
        : categoryNames(await loadCategories()),
    });
  }

  function plainText(html: string) {
    const markup = html.replace(/</g, " <");
    const { body } = new DOMParser().parseFromString(markup, "text/html");
    return (body.textContent ?? "").replace(/\s+/g, " ").trim();
  }

  // The router follows the URL at once. useRoute() waits for the next page.
  async function currentProductId(stop: AbortSignal) {
    const path = pathWithoutLocale(
      router.currentRoute.value.path,
      i18n.locale.value,
    );
    const seoUrl = await unlessStopped(stop, page.resolvePath(path));
    if (seoUrl?.routeName === "frontend.detail.page") return seoUrl.foreignKey;
    throw new Error("The shopper is not on a product page. Pass a productId.");
  }

  const handlers = {
    async search_products(input, stop, madeAt) {
      const movedOn = navigations.since(madeAt);
      const search = readText(input.query, "query");
      const minPrice = readPrice(input.minPrice, "minPrice");
      const maxPrice = readPrice(input.maxPrice, "maxPrice");
      const filters = { "min-price": minPrice, "max-price": maxPrice };
      const { data } = await page.apiClient.invoke("searchPage post /search", {
        body: { search, limit: 10, ...filters, includes: LISTING_INCLUDES },
        fetchOptions: { signal: stop },
      });
      return showListing(
        "/search",
        { search, ...filters },
        data,
        stop,
        movedOn,
      );
    },

    async browse_category(input, stop, madeAt) {
      const movedOn = navigations.since(madeAt);
      const name = readText(input.category, "category").toLowerCase();
      const menu = await unlessStopped(stop, loadCategories());
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
      const { data } = await page.apiClient.invoke(
        "readProductListing post /product-listing/{categoryId}",
        {
          pathParams: { categoryId: category.id },
          body: { limit: 10, ...filters, includes: LISTING_INCLUDES },
          fetchOptions: { signal: stop },
        },
      );
      return showListing(
        getCategoryUrl(category),
        filters,
        data,
        stop,
        movedOn,
      );
    },

    async get_product(input, stop) {
      const id =
        input.productId === undefined || input.productId === null
          ? await currentProductId(stop)
          : readProductId(input.productId);
      const { data } = await page.invokeRead(
        "readProductDetail post /product/{productId}",
        {
          headers: { "sw-include-seo-urls": true },
          pathParams: { productId: id },
          body: { associations: { options: {} } },
          fetchOptions: { signal: stop },
        },
      );
      const { product } = data;
      return productAnswer(product, {
        url: localePath(getProductRoute(product).path),
        currency: page.currency.value?.isoCode,
        description: plainText(getTranslatedProperty(product, "description")),
      });
    },

    async add_to_cart(input, stop) {
      const id = readProductId(input.productId);
      const quantity =
        input.quantity === undefined || input.quantity === null
          ? 1
          : readCount(input.quantity, "quantity", 1);
      await loadCart(stop);
      const warnings = await changeCart(
        () => addProduct({ id, quantity }),
        stop,
      );
      const line = cartLine(id);
      if (!line) {
        throw new Error(
          warnings.join(" ") ||
            "The product was not added. If it has variants, call get_product with this productId and add the productId it returns.",
        );
      }
      if (!warnings.length && !stop.aborted) {
        notifications.pushSuccess(
          `${line.label} ${i18n.t("product.addedToCart")}`,
          {
            action: {
              label: i18n.t("product.viewCart"),
              to: localePath("/checkout/cart"),
            },
          },
        );
      }
      return { ...currentCart(), warnings };
    },

    async get_cart(_input, stop) {
      await unlessStopped(stop, firstCartRead);
      await unlessStopped(stop, refreshCart());
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

    async go_to_checkout(_input, stop, madeAt) {
      const movedOn = navigations.since(madeAt);
      await loadCart(stop);
      if (isEmpty.value) {
        throw new Error("The cart is empty. Add a product first.");
      }
      if (movedOn()) {
        throw new Error(
          "The shopper opened another page meanwhile, so checkout was not opened.",
        );
      }
      await navigations.own(() => page.navigate(localePath("/checkout")));
      return { url: localePath("/checkout") };
    },
  } satisfies Record<WebMcpToolName, WebMcpToolHandler>;

  return { handlers, dispose: navigations.stop };
}
