import { ProductResponse as LegacyProductResponse } from "@shopware-pwa/commons/interfaces/response/ProductResult";

import { Product as LegacyProduct } from "@shopware-pwa/commons/interfaces/models/content/product/Product";
import { Category as LegacyCategory } from "@shopware-pwa/commons/interfaces/models/content/category/Category";
import { CmsPage } from "@shopware-pwa/commons/interfaces/models/content/cms/CmsPage";
import { SeoUrl } from "@shopware-pwa/commons/interfaces/models/content/navigation/Navigation";
import { PropertyGroup } from "@shopware-pwa/commons/interfaces/models/content/property/PropertyGroup";

/**
 * API responses' types
 * A combination of legacy response types and new response types
 * @TODO: to be unified in the final types package
 */
export type ProductResponse = LegacyProductResponse & {
  product: LegacyProduct & { cmsPage: CmsPage };
  configurator: PropertyGroup[] | null;
};

export type CategoryResponse = LegacyCategory & {
  cmsPage?: null | CmsPage;
};

export type LandingPageResponse = {
  active: boolean;
  translations: null | unknown;
  cmsPage: null | CmsPage;
  cmsPageId: string;
  name: string;
  metaTitle: null | string;
  metaDescription: null | string;
  keywords: null | string;
  url: string;
  slotConfig: null | unknown[];
  seoUrls: null | SeoUrl[];
  _uniqueIdentifier: string;
  versionId: string;
  translated: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: null | string;
  extensions: unknown;
  id: string;
  customFields: null | unknown;
  cmsPageVersionId: string;
  apiAlias: "landing_page";
};

/**
 * Types for internal usage.
 *
 * @TODO: rethink the format of the types
 */

type ResourceType =
  | "frontend.navigation.page"
  | "frontend.detail.page"
  | "frontend.landing.page";

type CategoryCmsResult = {
  category: CategoryResponse;
  resourceType: "frontend.navigation.page";
};

type ProductCmsResult = {
  product: ProductResponse;
  resourceType: "frontend.detail.page";
};

type LandingPageCmsResult = {
  landingPage: LandingPageResponse;
  resourceType: "frontend.landing.page";
};

export type SearchCmsResult = (
  | CategoryCmsResult
  | ProductCmsResult
  | LandingPageCmsResult
) & {
  resourceType: ResourceType;
  cmsPage: CmsPage;
};
