import {
  ProductResponse as LegacyProductResponse,
  LandingPage,
  Category,
  CmsPage,
} from "@shopware-pwa/types";

export * from "./cmsBlockTypes";
export * from "./cmsElementTypes";
export * from "./cmsSectionTypes";

/**
 * API responses' types
 * A combination of legacy response types and new response types
 * @TODO: to be unified in the final types package
 */
export type CategoryResponse = Category;
export type ProductResponse = LegacyProductResponse;
export type LandingPageResponse = LandingPage;
/**
 * Types for internal usage.
 *
 * @TODO: rethink the format of the types
 */

export const PRODUCT_ROUTE_NAME = "frontend.detail.page";
export const CATEGORY_ROUTE_NAME = "frontend.navigation.page";
export const LANDING_PAGE_ROUTE_NAME = "frontend.landing.page";

export type ResourceType =
  | typeof PRODUCT_ROUTE_NAME
  | typeof CATEGORY_ROUTE_NAME
  | typeof LANDING_PAGE_ROUTE_NAME;

type CategoryCmsResult = {
  category: CategoryResponse;
};

type ProductCmsResult = ProductResponse;

type LandingPageCmsResult = {
  landingPage: LandingPage;
};

export type SearchCmsResult = (
  | CategoryCmsResult
  | ProductCmsResult
  | LandingPageCmsResult
) & {
  cmsPage: null | CmsPage;
  resourceType: ResourceType;
};
