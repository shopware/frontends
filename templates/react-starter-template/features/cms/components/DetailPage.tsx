import { CmsPage } from "@shopware/cms-base-layer-react";

import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { notFoundOn404 } from "@/platform/shopware/errors";
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
  const ctx = await createStorefrontCmsContext({
    locale,
    languageId,
    routeName: "frontend.detail.page",
    foreignKey: productId,
    product,
  });

  if (!product.cmsPage) {
    return (
      <p className="container mx-auto bg-white px-4 py-8 text-surface-on-surface-variant">
        {getTranslator(locale)("cms.noLayout.product")}
      </p>
    );
  }

  return (
    <div className="container mx-auto bg-white flex flex-col p-6 md:p-0">
      <CmsPage content={product.cmsPage} ctx={ctx} />
    </div>
  );
}
