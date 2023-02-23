import { CustomField } from "../../common/CustomField";
import { Category } from "../category/Category";
import { Product } from "../product/Product";
import { Aggregation } from "../../../search/Aggregation";
import { CmsBlock } from "./CmsBlock";
import { LandingPage } from "../landing-page/LandingPage";

/**
 * Cms page type
 *
 * @public
 */
export type CmsPageType = "product_list" | "landingpage" | "product_detail";

export type NavigationRouteName = "frontend.navigation.page";
export type LandingRouteName = "frontend.landing.page";
export type DetailRouteName = "frontend.detail.page";

/**
 * Cms page route name responsible for the type of the page
 *
 */
export type RouteName =
  | NavigationRouteName
  | LandingRouteName
  | DetailRouteName;

/**
 * @public
 */
export type CmsResponse = {
  apiAlias: "pwa_page_result";
  resourceIdentifier: string;
  canonicalPathInfo: string;
  breadcrumb: PageBreadcrumb;
  cmsPage: CmsPage;
};

/**
 * @public
 */
export type CmsProductPageResponse = CmsResponse & {
  resourceType: "frontend.detail.page";
  cmsPage: CmsPage | null;
  product: Product;
};

/**
 * @public
 */
export type CmsCategoryPageResponse = CmsResponse & {
  resourceType: "frontend.navigation.page";
  category: Category;
};

/**
 * @public
 */
export type CmsStaticPageResponse = CmsResponse & {
  resourceType: "frontend.landing.page";
  landingPage: LandingPage;
};

/**
 * @public
 */
export type CmsPageResponse =
  | CmsCategoryPageResponse
  | CmsProductPageResponse
  | CmsStaticPageResponse;

/**
 * @public
 */
export type CmsPageEntity =
  | Category
  | LandingPage
  | Product;

/**
 * @public
 */
export type Breadcrumb = {
  name: string;
  path: string;
};

/**
 * @public
 */
export type PageBreadcrumb = {
  [id: string]: Breadcrumb;
};

/**
 * @deprecated use CmsPageResponse instead
 */
export type PageResolverResult<T> = {
  cmsPage: T;
  breadcrumb: PageBreadcrumb;
  listingConfiguration: unknown;
  resourceType: CmsPageType;
  resourceIdentifier: string;
  apiAlias: string;
};

/**
 * @deprecated use CmsPageResponse or CmsProductPageResponse instead
 */
export type PageResolverProductResult = {
  product: Partial<Product>;
  breadcrumb: PageBreadcrumb;
  aggregations: Aggregation[];
  resourceType: CmsPageType;
  resourceIdentifier: string;
  cannonicalPathInfo: string;
  apiAlias: string;
};

/**
 * @public
 */
export type CmsPage = {
  category: Category;
  type: CmsPageType;
  name: string;
  customFields: CustomField[] | null;
  locked: boolean;
  _uniqueIdentifier: string;
  versionId: string | null;
  translated: unknown;
  createdAt: Date;
  updatedAt: Date;
  extensions: [any];
  id: string;
  entity: any | null;
  sections: CmsSection[];
  translations: [any] | null;
  categories: [Category] | null;
  config: any | null;
  previewMediaId: any | null;
  previewMedia: any | null;
};

/**
 * @public
 */
export type CmsSlotType =
  | "image"
  | "product-slider"
  | "product-listing"
  | "product-box"
  | "slot"
  | "text"
  | "image-slider"
  | "image-gallery"
  | "youtube-video"
  | "vimeo-video"
  | "sidebar-filter"
  | "category-navigation"
  | "product-description-reviews"
  | "buy-box"
  | "cross-selling"
  | "form";

/**
 * @public
 */
export type CmsFieldConfig = {
  name: string;
  source: string;
  value: string;
};

/**
 * @public
 */
export type OldSlot = {
  type: CmsSlotType;
  customFields: CustomField[] | null;
  locked: boolean;
  _uniqueIdentifier: string;
  versionId: string;
  translated: unknown;
  createdAt: Date;
  updatedAt: Date | null;
  extensions: [any];
  id: string;
  translations: any | null;
  config: unknown;
  slot: string;
  block: CmsBlock | null;
  blockId: string;
  fieldConfig: CmsFieldConfig[];
  data?: unknown;
  apiAlias: "cms_slot";
};
export type CmsSlot = Omit<OldSlot, "data" | "config">;

/**
 * @public
 */
export type SectionType = "default" | "sidebar";

/**
 * @public
 */
export type SizingMode = "boxed";

/**
 * @public
 */
export type MobileBehavior = "boxed" | "wrap" | "hidden";

/**
 * @public
 */
export type BackgroundMediaMode = "cover";

/**
 * @public
 */
export type CmsSection = {
  type: SectionType;
  pageId: string;
  page: null;
  position: number;
  name: string | null;
  sizingMode: SizingMode;
  mobileBehavior: MobileBehavior;
  backgroundColor: string | null;
  backgroundMediaId: string | null;
  backgroundMedia: null;
  backgroundMediaMode: BackgroundMediaMode;
  cssClass: string | null;
  customFields: CustomField[] | null;
  locked: false;
  _uniqueIdentifier: string;
  versionId: string | null;
  translated: any;
  createdAt: Date;
  updatedAt: Date;
  extensions: [any];
  id: string;
  blocks: CmsBlock[];
  apiAlias: "cms_section";
};
