import type { Schemas } from "#shopware";
import { pascalCase } from "scule";
import { resolveComponent } from "vue";

/**
 * A composables library compatible with Vue 3 and Shopware 6.
 *
 * Some more info...
 *
 * @remarks
 * The `widget-lib` defines the {@link IWidget} interface and {@link Widget} class,
 * which are used to build widgets.
 *
 * @packageDocumentation
 */

export * from "./types";
export * from "./cms";
export * from "./createShopwareContext";

export * from "./useAddress/useAddress";
export * from "./useAddToCart/useAddToCart";
export * from "./useBreadcrumbs/useBreadcrumbs";
export * from "./useCart/useCart";
export * from "./useCartItem/useCartItem";
export * from "./useCategory/useCategory";
export * from "./useCategorySearch/useCategorySearch";
export * from "./useCheckout/useCheckout";
export * from "./useCmsBlock/useCmsBlock";
export * from "./useCmsMeta/useCmsMeta";
export * from "./useCmsSection/useCmsSection";
export * from "./useCmsTranslations/useCmsTranslations";
export * from "./useContext/useContext";
export * from "./useCountries/useCountries";
export * from "./useCustomerOrders/useCustomerOrders";
export * from "./useCustomerPassword/useCustomerPassword";
export * from "./useDefaultOrderAssociations/useDefaultOrderAssociations";
export * from "./useInternationalization/useInternationalization";
export * from "./useLandingSearch/useLandingSearch";
export * from "./useListing/useListing";
export * from "./useLocalWishlist/useLocalWishlist";
export * from "./useNavigation/useNavigation";
export * from "./useNavigationContext/useNavigationContext";
export * from "./useNavigationSearch/useNavigationSearch";
export * from "./useNewsletter/useNewsletter";
export * from "./useNotifications/useNotifications";
export * from "./useOrderDetails/useOrderDetails";
export * from "./useOrderPayment/useOrderPayment";
export * from "./usePrice/usePrice";
export * from "./useProduct/useProduct";
export * from "./useProductAssociations/useProductAssociations";
export * from "./useProductConfigurator/useProductConfigurator";
export * from "./useProductPrice/useProductPrice";
export * from "./useProductReviews/useProductReviews";
export * from "./useProductSearch/useProductSearch";
export * from "./useProductSearchSuggest/useProductSearchSuggest";
export * from "./useProductWishlist/useProductWishlist";
export * from "./useSalutations/useSalutations";
export * from "./useSessionContext/useSessionContext";
export * from "./useShopwareContext/useShopwareContext";
export * from "./useSyncWishlist/useSyncWishlist";
export * from "./useUrlResolver/useUrlResolver";
export * from "./useUser/useUser";
export * from "./useWishlist/useWishlist";
export * from "./useB2bQuoteManagement/useB2bQuoteManagement";
export * from "./useCartNotification/useCartNotification";
export * from "./useCartErrorParamsResolver/useCartErrorParamsResolver";

export function resolveCmsComponent(
  content: Schemas["CmsSection"] | Schemas["CmsBlock"] | Schemas["CmsSlot"],
) {
  const componentName = content.type;
  const type =
    content.apiAlias === "cms_block"
      ? "Block"
      : content.apiAlias === "cms_section"
        ? "Section"
        : "Element";

  const componentNameToResolve = pascalCase(`Cms-${type}-${componentName}`);
  try {
    const resolvedComponent = resolveComponent(componentNameToResolve);

    return {
      componentName,
      componentNameToResolve,
      isResolved: resolvedComponent !== componentName,
      resolvedComponent:
        typeof resolvedComponent !== "string" ? resolvedComponent : undefined,
    };
  } catch (e) {
    return {
      componentName,
      componentNameToResolve,
      resolvedComponent: undefined,
      resolved: false,
      isResolved: false,
      error: (e as Error).message,
    };
  }
}

// TODO: handle defaults in app
export function getDefaultApiParams(): {
  [composableName: string]: unknown;
} {
  console.error(
    "[@shopware-pwa/composables] `getDefaultApiParams` is deprecated and will be removed in the next major release.",
  );
  return {};
}
