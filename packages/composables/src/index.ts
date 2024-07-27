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
export * from "./useAddToCart";
export * from "./useAddress";
export * from "./useBreadcrumbs";
export * from "./useCart";
export * from "./useCartItem";
export * from "./useCategory";
export * from "./useCategorySearch";
export * from "./useCheckout";
export * from "./useCmsBlock";
export * from "./useCmsMeta";
export * from "./useCmsSection";
export * from "./useCmsTranslations";
export * from "./useContext";
export * from "./useCountries";
export * from "./useCustomerOrders";
export * from "./useCustomerPassword";
export * from "./useInternationalization";
export * from "./useLandingSearch";
export * from "./useListing";
export * from "./useLocalWishlist";
export * from "./useNavigation";
export * from "./useNavigationContext";
export * from "./useNavigationSearch";
export * from "./useNewsletter";
export * from "./useNotifications";
export * from "./useOrderDetails";
export * from "./useOrderPayment";
export * from "./usePrice";
export * from "./useProduct";
export * from "./useProductAssociations";
export * from "./useProductConfigurator";
export * from "./useProductPrice";
export * from "./useProductReviews";
export * from "./useProductSearch";
export * from "./useProductSearchSuggest";
export * from "./useProductWishlist";
export * from "./useSalutations";
export * from "./useSessionContext";
export * from "./useShopwareContext";
export * from "./useSyncWishlist";
export * from "./useUrlResolver";
export * from "./useUser";
export * from "./useWishlist";
export * from "./useB2bQuoteManagement";

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
