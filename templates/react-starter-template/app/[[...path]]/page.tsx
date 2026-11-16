import {
  getCategoryImageUrl,
  getCmsMeta,
  getSmallestThumbnailUrl,
} from "@shopware/helpers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import type { Schemas } from "#shopware";
import type { ListingSearchParams } from "@/cms";
import { CmsLayoutPage } from "@/features/cms/components/CmsLayoutPage";
import { DetailPage } from "@/features/cms/components/DetailPage";
import { LandingPage } from "@/features/cms/components/LandingPage";
import { NavigationPage } from "@/features/cms/components/NavigationPage";
import { PageSkeleton } from "@/features/cms/components/PageSkeleton";
import { readCategory } from "@/platform/shopware/reads/category";
import { readCmsPage } from "@/platform/shopware/reads/cmsPage";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";
import { readProductDetail } from "@/platform/shopware/reads/product";
import { resolveSeoPath } from "@/platform/shopware/reads/seoUrl";
import type { ResolvedRoute } from "@/platform/shopware/reads/seoUrl";

type CatchAllPageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<ListingSearchParams>;
};

type CmsPageEntity =
  | Schemas["Category"]
  | Schemas["CmsPage"]
  | Schemas["LandingPage"]
  | Schemas["Product"];

function toPathname(segments: string[] = []): string {
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
    case "frontend.cms.page.full":
      return <CmsLayoutPage cmsPageId={route.foreignKey} />;
    default:
      notFound();
  }
}

async function readRouteEntity(
  route: ResolvedRoute,
): Promise<CmsPageEntity | null> {
  switch (route.routeName) {
    case "frontend.navigation.page":
      return readCategory(route.foreignKey);
    case "frontend.detail.page":
      return (await readProductDetail(route.foreignKey)).product;
    case "frontend.landing.page":
      return readLandingPage(route.foreignKey);
    case "frontend.cms.page.full":
      return readCmsPage(route.foreignKey);
    default:
      return null;
  }
}

function getOpenGraphImage(entity: CmsPageEntity): string | undefined {
  if (entity.apiAlias === "product") {
    return (
      getSmallestThumbnailUrl(entity.openGraphMedia) ||
      getSmallestThumbnailUrl(entity.cover?.media)
    );
  }
  if (entity.apiAlias === "category") {
    return getCategoryImageUrl(entity) || undefined;
  }
  return undefined;
}

function toMetadata(entity: CmsPageEntity): Metadata {
  const meta = getCmsMeta(entity);
  const title = meta.metaTitle || meta.title;
  const description = meta.metaDescription || undefined;
  const image = getOpenGraphImage(entity);
  return {
    title,
    description,
    keywords: meta.keywords || undefined,
    robots: entity.apiAlias === "cms_page" ? { index: false } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { path } = await params;
  if (!path?.length) return {};

  try {
    const route = await resolveSeoPath(toPathname(path));
    const entity = route && (await readRouteEntity(route));
    return entity ? toMetadata(entity) : {};
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
