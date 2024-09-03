type Category = { apiAlias: "category" };
type LandingPage = { apiAlias: "landing_page" };
type Product = {
  apiAlias: "product";
  media?: {
    thumbnails?: Array<{
      width: number;
      url: string;
    }>;
  };
};
type CmsPageResponse = {
  resourceType:
    | "frontend.navigation.page"
    | "frontend.detail.page"
    | "frontend.landing.page";
  product: Product;
  category: Category;
  landingPage: LandingPage;
};

export { getCmsLayoutConfiguration } from "./getCmsLayoutConfiguration";
export type { LayoutConfiguration } from "./getCmsLayoutConfiguration";
export * from "./getBackgroundImageUrl";
export * from "./buildUrlPrefix";
export * from "./layoutClasses";
export * from "./isMaintenanceMode";
export * from "./getCmsTranslate";

/**
 * Returns the main page object depending of the type of the CMS page.
 *
 * @category CMS (Shopping Experiences)
 */
export function getCmsEntityObject(
  response: CmsPageResponse,
): Product | Category | LandingPage {
  switch (response.resourceType) {
    case "frontend.detail.page":
      return response.product;
    case "frontend.navigation.page":
      return response.category;
    case "frontend.landing.page":
      return response.landingPage;
  }
}

/**
 * Predicate function to check if the entity is a product.
 *
 * @category CMS (Shopping Experiences)
 */
export function isProduct<T extends { apiAlias: string }>(
  entity: T | Product,
): entity is Product {
  return entity.apiAlias === "product";
}

export function isCategory<T extends { apiAlias: string }>(
  entity: T | Category,
): entity is Category {
  return entity.apiAlias === "category";
}

export function isLandingPage<T extends { apiAlias: string }>(
  entity: T | LandingPage,
): entity is LandingPage {
  return entity.apiAlias === "landing_page";
}
