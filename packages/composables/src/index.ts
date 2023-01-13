import { CmsBlock, CmsSection, CmsSlot } from "@shopware-pwa/types";
import { pascalCase } from "scule";
import { resolveComponent } from "vue";

export * from "./types";
export * from "./cms";
export * from "./useShopwareContext";
export * from "./useCategory";
export * from "./useCategorySearch";
export * from "./useProductConfigurator";
export * from "./useProductReviews";
export * from "./useProductAssociations";
export * from "./useCmsBlock";
export * from "./useCmsSection";
export * from "./useNavigation";
export * from "./useCart";
export * from "./useCartItem";
export * from "./useUser";
export * from "./useSessionContext";
export * from "./useAddToCart";
export * from "./useNotifications";
export * from "./useLandingSearch";
export * from "./useListing";
export * from "./useProduct";
export * from "./useProductSearch";
export * from "./useCheckout";
export * from "./useSalutations";
export * from "./useCountries";
export * from "./useOrderDetails";
export * from "./useOrderPayment";
export * from "./useLocalWishlist";
export * from "./useSyncWishlist";
export * from "./useProductSearchSuggest";
export * from "./useCustomerPassword";
export * from "./usePrice";
export * from "./userCustomerOrders";
export * from "./createShopwareContext";
export * from "./useAddress";
export * from "./useProductPrice";
export * from "./useInternationalization";
export * from "./useCmsMeta";
export * from "./useNewsletter";
export * from "./useNavigationContext";
export * from "./useNavigationSearch";
export * from "./useWishlist";
export * from "./useProductWishlist";

export function resolveCmsComponent(content: CmsSection | CmsBlock | CmsSlot) {
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
      isResolved: resolvedComponent !== componentName,
      resolvedComponent:
        typeof resolvedComponent !== "string" ? resolvedComponent : undefined,
    };
  } catch (e) {
    return {
      componentName,
      resolvedComponent: undefined,
      resolved: false,
      error: (e as Error).message,
    };
  }
}

// TODO: handle defaults in app
export function getDefaultApiParams(): {
  [composableName: string]: any;
} {
  return {};
}
