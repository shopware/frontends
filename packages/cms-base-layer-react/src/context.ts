import type { BackgroundImageOptions } from "@shopware/helpers";

import type { Schemas } from "#shopware";

import { DEFAULT_IMAGE_SIZES, getImageSizes } from "./helpers/imageSizes";
import type { CmsRegistry } from "./registry";
import type { CmsTranslations } from "./translations";

export type CmsRouteName =
  | "frontend.navigation.page"
  | "frontend.detail.page"
  | "frontend.landing.page"
  | "frontend.account.customer-group-registration.page";

export type CmsSectionLayout = "default" | "sidebar";

export type CmsConfig = {
  imagePlaceholder: { color: string };
  backgroundImage: BackgroundImageOptions;
  lcpImagePreload: boolean;
  imageSizes: Record<string, string>;
};

export type CmsConfigInput = {
  imagePlaceholder?: Partial<CmsConfig["imagePlaceholder"]>;
  backgroundImage?: BackgroundImageOptions;
  lcpImagePreload?: boolean;
  imageSizes?: Record<string, string>;
};

export const defaultCmsConfig: CmsConfig = {
  imagePlaceholder: { color: "#543B95" },
  backgroundImage: { format: "webp", quality: 90 },
  lcpImagePreload: false,
  imageSizes: DEFAULT_IMAGE_SIZES,
};

export type CmsClientContext = {
  routeName?: CmsRouteName;
  foreignKey?: string;
  urlPrefix: string;
  locale: string;
  currencyCode: string;
  taxState: "gross" | "net";
  navigationCategoryId?: string;
  isLoggedIn: boolean;
  isProductSearch: boolean;
  slotCount: number;
  imageSizes: string;
  sectionLayout?: CmsSectionLayout;
  config: CmsConfig;
  translations: CmsTranslations;
};

export type CmsContext = CmsClientContext & {
  registry: CmsRegistry;
  product?: Schemas["Product"];
  category?: Schemas["Category"];
  landingPage?: Schemas["LandingPage"];
  navigation?: Schemas["Category"][];
  listing?: Schemas["ProductListingResult"];
};

export type CreateCmsContextInput = {
  registry: CmsRegistry;
  routeName?: CmsRouteName;
  foreignKey?: string;
  urlPrefix?: string;
  locale?: string;
  currencyCode?: string;
  taxState?: "gross" | "net";
  navigationCategoryId?: string;
  isLoggedIn?: boolean;
  isProductSearch?: boolean;
  config?: CmsConfigInput;
  translations?: CmsTranslations;
  product?: Schemas["Product"];
  category?: Schemas["Category"];
  landingPage?: Schemas["LandingPage"];
  navigation?: Schemas["Category"][];
  listing?: Schemas["ProductListingResult"];
};

export function resolveCmsConfig(input: CmsConfigInput = {}): CmsConfig {
  return {
    imagePlaceholder: {
      ...defaultCmsConfig.imagePlaceholder,
      ...input.imagePlaceholder,
    },
    backgroundImage: {
      ...defaultCmsConfig.backgroundImage,
      ...input.backgroundImage,
    },
    lcpImagePreload: input.lcpImagePreload ?? defaultCmsConfig.lcpImagePreload,
    imageSizes: { ...defaultCmsConfig.imageSizes, ...input.imageSizes },
  };
}

export function createCmsContext(input: CreateCmsContextInput): CmsContext {
  const config = resolveCmsConfig(input.config);
  return {
    registry: input.registry,
    routeName: input.routeName,
    foreignKey: input.foreignKey,
    urlPrefix: input.urlPrefix ?? "",
    locale: input.locale ?? "en-GB",
    currencyCode: input.currencyCode ?? "EUR",
    taxState: input.taxState ?? "gross",
    navigationCategoryId: input.navigationCategoryId,
    isLoggedIn: input.isLoggedIn ?? false,
    isProductSearch: input.isProductSearch ?? false,
    slotCount: 1,
    imageSizes: getImageSizes(1, config.imageSizes),
    config,
    translations: input.translations ?? {},
    product: input.product,
    category: input.category,
    landingPage: input.landingPage,
    navigation: input.navigation,
    listing: input.listing,
  };
}

export function toClientContext(ctx: CmsContext): CmsClientContext {
  return {
    routeName: ctx.routeName,
    foreignKey: ctx.foreignKey,
    urlPrefix: ctx.urlPrefix,
    locale: ctx.locale,
    currencyCode: ctx.currencyCode,
    taxState: ctx.taxState,
    navigationCategoryId: ctx.navigationCategoryId,
    isLoggedIn: ctx.isLoggedIn,
    isProductSearch: ctx.isProductSearch,
    slotCount: ctx.slotCount,
    imageSizes: ctx.imageSizes,
    sectionLayout: ctx.sectionLayout,
    config: ctx.config,
    translations: ctx.translations,
  };
}
