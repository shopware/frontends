import type {
  Category,
  CmsPageResponse,
  LandingPage,
  Product,
} from "@shopware-pwa/types";

export * from "./getCmsLayoutConfiguration";

/**
 * Returns the main page object depending of the type of the CMS page.
 *
 * @category CMS (Shopping Experiences)
 */
export function getCmsEntityObject(
  response: CmsPageResponse
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
  entity: T | Product
): entity is Product {
  return entity.apiAlias === "product";
}

export function isCategory<T extends { apiAlias: string }>(
  entity: T | Category
): entity is Category {
  return entity.apiAlias === "category";
}

export function isLandingPage<T extends { apiAlias: string }>(
  entity: T | LandingPage
): entity is LandingPage {
  return entity.apiAlias === "landing_page";
}
