import { CmsPage } from "@shopware/cms-base-layer-react";

import { createStorefrontCmsContext } from "@/platform/cms/context";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readProductDetail } from "@/platform/shopware/reads/product";

export type DetailPageProps = {
  productId: string;
};

export async function DetailPage({ productId }: DetailPageProps) {
  const { product } = await readProductDetail(productId).catch(notFoundOn404);
  const ctx = await createStorefrontCmsContext({
    routeName: "frontend.detail.page",
    foreignKey: productId,
    product,
  });

  if (!product.cmsPage) {
    return (
      <p className="container mx-auto bg-white px-4 py-8 text-surface-on-surface-variant">
        This product has no layout assigned.
      </p>
    );
  }

  return (
    <div className="container mx-auto bg-white flex flex-col p-6 md:p-0">
      <CmsPage content={product.cmsPage} ctx={ctx} />
    </div>
  );
}
