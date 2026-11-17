import { CmsPage } from "@/cms";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { readCmsPage } from "@/platform/shopware/reads/cmsPage";

export type CmsLayoutPageProps = {
  cmsPageId: string;
};

export async function CmsLayoutPage({ cmsPageId }: CmsLayoutPageProps) {
  const cmsPage = await readCmsPage(cmsPageId);
  const ctx = await createStorefrontCmsContext({
    routeName: "frontend.cms.page.full",
    foreignKey: cmsPageId,
  });

  return <CmsPage content={cmsPage} ctx={ctx} />;
}
