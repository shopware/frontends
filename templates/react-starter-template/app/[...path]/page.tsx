import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import { getTranslatedProperty } from "@shopware/helpers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DetailPage } from "@/features/cms/components/DetailPage";
import { LandingPage } from "@/features/cms/components/LandingPage";
import { NavigationPage } from "@/features/cms/components/NavigationPage";
import { PageSkeleton } from "@/features/cms/components/PageSkeleton";
import { readCategory } from "@/platform/shopware/reads/category";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";
import { readProductDetail } from "@/platform/shopware/reads/product";
import { resolveSeoPath } from "@/platform/shopware/reads/seoUrl";

type CatchAllPageProps = {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<ListingSearchParams>;
};

function toPathname(segments: string[]): string {
  return `/${segments.join("/")}`;
}

async function ResolvedPage({ params, searchParams }: CatchAllPageProps) {
  const [{ path }, query] = await Promise.all([params, searchParams]);
  const route = await resolveSeoPath(toPathname(path));

  if (!route) notFound();

  switch (route.routeName) {
    case "frontend.navigation.page":
      return (
        <NavigationPage navigationId={route.foreignKey} searchParams={query} />
      );
    case "frontend.detail.page":
      return <DetailPage productId={route.foreignKey} />;
    case "frontend.landing.page":
      return <LandingPage landingPageId={route.foreignKey} />;
    default:
      notFound();
  }
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { path } = await params;
  const route = await resolveSeoPath(toPathname(path)).catch(() => null);
  if (!route) return {};

  try {
    if (route.routeName === "frontend.navigation.page") {
      const category = await readCategory(route.foreignKey);
      return {
        title:
          getTranslatedProperty(category, "metaTitle") ||
          getTranslatedProperty(category, "name"),
        description: getTranslatedProperty(category, "metaDescription"),
      };
    }
    if (route.routeName === "frontend.detail.page") {
      const { product } = await readProductDetail(route.foreignKey);
      return {
        title:
          getTranslatedProperty(product, "metaTitle") ||
          getTranslatedProperty(product, "name"),
        description: getTranslatedProperty(product, "metaDescription"),
      };
    }
    if (route.routeName === "frontend.landing.page") {
      const landingPage = await readLandingPage(route.foreignKey);
      return {
        title:
          getTranslatedProperty(landingPage, "metaTitle") ||
          getTranslatedProperty(landingPage, "name"),
        description: getTranslatedProperty(landingPage, "metaDescription"),
      };
    }
  } catch {
    return {};
  }
  return {};
}

export default function CatchAllPage(props: CatchAllPageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ResolvedPage {...props} />
    </Suspense>
  );
}
