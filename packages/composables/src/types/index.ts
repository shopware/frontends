import { ProductResponse as LegacyProductResponse } from "@shopware-pwa/commons/interfaces/response/ProductResult";
import { EntityResult } from "@shopware-pwa/commons";
import { Product as LegacyProduct } from "@shopware-pwa/commons/interfaces/models/content/product/Product";
import { Category as LegacyCategory } from "@shopware-pwa/commons/interfaces/models/content/category/Category";
import { CmsPage } from "@shopware-pwa/commons/interfaces/models/content/cms/CmsPage";
import { SeoUrl as LegacySeoUrl } from "@shopware-pwa/commons/interfaces/models/content/navigation/Navigation";
export { SearchFilterType } from "@shopware-pwa/commons";

export type SeoUrl = LegacySeoUrl;
type Category = LegacyCategory;
type Product = LegacyProduct & { cmsPage: null | CmsPage };

export type SeoResult = EntityResult<"seo_url", LegacySeoUrl[]>;
/**
 * API responses' types
 * A combination of legacy response types and new response types
 * @TODO: to be unified in the final types package
 */
export type ProductResponse = LegacyProductResponse & {
  product: Product;
};

export type CategoryResponse = Category;

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

export type ResourceType =
  | "frontend.navigation.page"
  | "frontend.detail.page"
  | "frontend.landing.page";

type CategoryCmsResult = {
  category: CategoryResponse;
};

type ProductCmsResult = ProductResponse;

type LandingPageCmsResult = {
  landingPage: LandingPageResponse;
};

export type SearchCmsResult = (
  | CategoryCmsResult
  | ProductCmsResult
  | LandingPageCmsResult
) & {
  cmsPage: null | CmsPage;
  resourceType: ResourceType;
};
