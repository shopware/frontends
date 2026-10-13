import "server-only";
import type { Metadata } from "next";

import { withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { readCategory } from "@/platform/shopware/reads/category";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { readCustomerGroupRegistration } from "@/platform/shopware/reads/customerGroupRegistration";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";
import { readProductDetail } from "@/platform/shopware/reads/product";

import {
  categoryMetadata,
  customerGroupRegistrationMetadata,
  homeMetadata,
  landingPageMetadata,
  productMetadata,
} from "./metadata";
import type { SeoContext } from "./metadata";
import { getSiteUrl } from "./siteUrl";
import { pageQuery, seoPathFrom, technicalPath } from "./urls";

export type MetadataRoute = {
  routeName: string;
  foreignKey: string;
  seoPathInfo?: string;
};

export type RouteMetadataOptions = {
  locale: Locale;
  languageId: string | null;
  page?: unknown;
};

function seoContext(locale: Locale, path: string): SeoContext {
  return {
    canonicalPath: withLocale(path, locale),
    siteUrl: getSiteUrl(),
    siteName: getTranslator(locale)("layout.logo"),
  };
}

export async function buildRouteMetadata(
  route: MetadataRoute,
  { locale, languageId, page }: RouteMetadataOptions,
): Promise<Metadata | null> {
  const fallbackPath = technicalPath(route.routeName, route.foreignKey);
  switch (route.routeName) {
    case "frontend.navigation.page": {
      const category = await readCategory(route.foreignKey, languageId);
      const path = seoPathFrom(category.seoUrls) ?? fallbackPath;
      return categoryMetadata(
        category,
        seoContext(locale, `${path}${pageQuery(page)}`),
      );
    }
    case "frontend.detail.page": {
      const { product } = await readProductDetail(route.foreignKey, languageId);
      const path =
        seoPathFrom(product.seoUrls) ??
        technicalPath(route.routeName, product.id);
      return productMetadata(product, seoContext(locale, path));
    }
    case "frontend.landing.page": {
      const landingPage = await readLandingPage(route.foreignKey, languageId);
      const path = seoPathFrom(landingPage.seoUrls) ?? fallbackPath;
      return landingPageMetadata(landingPage, seoContext(locale, path));
    }
    case "frontend.account.customer-group-registration.page": {
      const group = await readCustomerGroupRegistration(
        route.foreignKey,
        languageId,
      );
      const path = seoPathFrom([{ seoPathInfo: route.seoPathInfo }]);
      return customerGroupRegistrationMetadata(
        group,
        path ? seoContext(locale, path) : null,
      );
    }
    default:
      return null;
  }
}

export async function buildHomeMetadata({
  locale,
  languageId,
  page,
}: RouteMetadataOptions): Promise<Metadata> {
  const context = await readSalesChannelContext(languageId);
  const category = await readCategory(
    context.salesChannel.navigationCategoryId,
    languageId,
  );
  return homeMetadata(category, seoContext(locale, `/${pageQuery(page)}`));
}
