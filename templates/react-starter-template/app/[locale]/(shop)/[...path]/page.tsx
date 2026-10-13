import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CustomerGroupRegistrationPage } from "@/features/account/customerGroup/CustomerGroupRegistrationPage";
import { DetailPage } from "@/features/cms/components/DetailPage";
import { LandingPage } from "@/features/cms/components/LandingPage";
import { NavigationPage } from "@/features/cms/components/NavigationPage";
import { PageSkeleton } from "@/features/cms/components/PageSkeleton";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { buildRouteMetadata } from "@/platform/seo/routeMetadata";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { resolveSeoPath } from "@/platform/shopware/reads/seoUrl";

type CatchAllPageProps = {
  params: Promise<{ locale: string; path: string[] }>;
  searchParams: Promise<ListingSearchParams>;
};

function toPathname(segments: string[]): string {
  return `/${segments.join("/")}`;
}

async function ResolvedPage({ params, searchParams }: CatchAllPageProps) {
  const [locale, { path }, query] = await Promise.all([
    localeFromParams(params),
    params,
    searchParams,
  ]);
  const languageId = await resolveLanguageId(locale);
  const route = await resolveSeoPath(toPathname(path), languageId);

  if (!route) notFound();

  switch (route.routeName) {
    case "frontend.navigation.page":
      return (
        <NavigationPage
          navigationId={route.foreignKey}
          searchParams={query}
          locale={locale}
          languageId={languageId}
        />
      );
    case "frontend.detail.page":
      return (
        <DetailPage
          productId={route.foreignKey}
          locale={locale}
          languageId={languageId}
        />
      );
    case "frontend.landing.page":
      return (
        <LandingPage
          landingPageId={route.foreignKey}
          locale={locale}
          languageId={languageId}
        />
      );
    case "frontend.account.customer-group-registration.page":
      return (
        <CustomerGroupRegistrationPage
          customerGroupId={route.foreignKey}
          locale={locale}
          languageId={languageId}
        />
      );
    default:
      notFound();
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: CatchAllPageProps): Promise<Metadata> {
  const [locale, { path }, query] = await Promise.all([
    localeFromParams(params),
    params,
    searchParams,
  ]);
  const languageId = await resolveLanguageId(locale);
  const route = await resolveSeoPath(toPathname(path), languageId).catch(
    () => null,
  );
  const notFoundMetadata = {
    title: getTranslator(locale)("errors.message-404"),
  };
  if (!route) return notFoundMetadata;

  try {
    return (
      (await buildRouteMetadata(route, {
        locale,
        languageId,
        page: query.p,
      })) ?? notFoundMetadata
    );
  } catch {
    return {};
  }
}

export default function CatchAllPage(props: CatchAllPageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ResolvedPage {...props} />
    </Suspense>
  );
}
