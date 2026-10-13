import { CmsPage } from "@shopware/cms-base-layer-react";
import { getProductName } from "@shopware/helpers";

import { JsonLd } from "@/components/JsonLd";
import { toBreadcrumbItems } from "@/features/navigation/breadcrumbs";
import { Breadcrumbs } from "@/features/navigation/components/Breadcrumbs";
import { withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { catalogNow } from "@/platform/seo/clock";
import { buildProductJsonLd } from "@/platform/seo/jsonLd";
import { getSiteUrl } from "@/platform/seo/siteUrl";
import { seoPathFrom, technicalPath } from "@/platform/seo/urls";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readBreadcrumbOrNothing } from "@/platform/shopware/reads/breadcrumb";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";
import { readProductDetail } from "@/platform/shopware/reads/product";

export type DetailPageProps = {
  productId: string;
  locale: Locale;
  languageId: string | null;
};

export async function DetailPage({
  productId,
  locale,
  languageId,
}: DetailPageProps) {
  const { product } = await readProductDetail(productId, languageId).catch(
    notFoundOn404,
  );
  const [ctx, breadcrumbs, { contentLang }, now] = await Promise.all([
    createStorefrontCmsContext({
      locale,
      languageId,
      routeName: "frontend.detail.page",
      foreignKey: productId,
      product,
    }),
    readBreadcrumbOrNothing(product.id, "product", languageId),
    resolveContentLanguage(locale),
    catalogNow(),
  ]);
  const siteUrl = getSiteUrl();
  const path = withLocale(
    seoPathFrom(product.seoUrls) ??
      technicalPath("frontend.detail.page", product.id),
    locale,
  );
  const trail = (
    <Breadcrumbs
      items={[
        ...toBreadcrumbItems(breadcrumbs, locale),
        {
          key: product.id,
          name: getProductName({ product }) ?? "",
          href: path,
        },
      ]}
      locale={locale}
      contentLang={contentLang}
      siteUrl={siteUrl}
    />
  );
  const jsonLd = (
    <JsonLd
      data={buildProductJsonLd({
        product,
        path,
        siteUrl,
        currencyCode: ctx.currencyCode,
        now,
      })}
    />
  );

  if (!product.cmsPage) {
    return (
      <>
        {trail}
        {jsonLd}
        <p className="container mx-auto bg-white px-4 py-8 text-surface-on-surface-variant">
          {getTranslator(locale)("cms.noLayout.product")}
        </p>
      </>
    );
  }

  return (
    <>
      {trail}
      {jsonLd}
      <div className="container mx-auto bg-white flex flex-col p-6 md:p-0">
        <CmsPage content={product.cmsPage} ctx={ctx} />
      </div>
    </>
  );
}
