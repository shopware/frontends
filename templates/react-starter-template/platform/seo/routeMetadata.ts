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

import { buildLanguageAlternates } from "./alternates";
import type { LanguageAlternates } from "./hreflang";
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

function seoContext(
  locale: Locale,
  path: string,
  siteUrl: URL | null,
  languages?: LanguageAlternates,
): SeoContext {
  return {
    canonicalPath: withLocale(path, locale),
    siteUrl,
    siteName: getTranslator(locale)("layout.logo"),
    ...(languages ? { languages } : {}),
  };
}

export async function buildRouteMetadata(
  route: MetadataRoute,
  { locale, languageId, page }: RouteMetadataOptions,
): Promise<Metadata | null> {
  const siteUrl = getSiteUrl();
  const fallbackPath = technicalPath(route.routeName, route.foreignKey);
  const alternates = (foreignKey: string, seoPath: string | null, query = "") =>
    buildLanguageAlternates({
      target: { kind: "route", routeName: route.routeName, foreignKey },
      locale,
      seoPath,
      query,
      siteUrl,
    });
  switch (route.routeName) {
    case "frontend.navigation.page": {
      const category = await readCategory(route.foreignKey, languageId);
      const seoPath = seoPathFrom(category.seoUrls);
      const query = pageQuery(page);
      return categoryMetadata(
        category,
        seoContext(
          locale,
          `${seoPath ?? fallbackPath}${query}`,
          siteUrl,
          await alternates(category.id, seoPath, query),
        ),
      );
    }
    case "frontend.detail.page": {
      const { product } = await readProductDetail(route.foreignKey, languageId);
      const seoPath = seoPathFrom(product.seoUrls);
      return productMetadata(
        product,
        seoContext(
          locale,
          seoPath ?? technicalPath(route.routeName, product.id),
          siteUrl,
          await alternates(product.id, seoPath),
        ),
      );
    }
    case "frontend.landing.page": {
      const landingPage = await readLandingPage(route.foreignKey, languageId);
      const seoPath = seoPathFrom(landingPage.seoUrls);
      return landingPageMetadata(
        landingPage,
        seoContext(
          locale,
          seoPath ?? fallbackPath,
          siteUrl,
          await alternates(landingPage.id, seoPath),
        ),
      );
    }
    case "frontend.account.customer-group-registration.page": {
      const group = await readCustomerGroupRegistration(
        route.foreignKey,
        languageId,
      );
      const path = seoPathFrom([{ seoPathInfo: route.seoPathInfo }]);
      return customerGroupRegistrationMetadata(
        group,
        path ? seoContext(locale, path, siteUrl) : null,
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
  const siteUrl = getSiteUrl();
  const context = await readSalesChannelContext(languageId);
  const category = await readCategory(
    context.salesChannel.navigationCategoryId,
    languageId,
  );
  const query = pageQuery(page);
  const languages = await buildLanguageAlternates({
    target: { kind: "home" },
    locale,
    seoPath: "/",
    query,
    siteUrl,
  });
  return homeMetadata(
    category,
    seoContext(locale, `/${query}`, siteUrl, languages),
  );
}
