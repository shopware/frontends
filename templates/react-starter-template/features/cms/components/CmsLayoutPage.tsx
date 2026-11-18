import { CmsPage } from "@/cms";
import type { Locale } from "@/i18n/config";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { readCmsPage } from "@/platform/shopware/reads/cmsPage";

export type CmsLayoutPageProps = {
  cmsPageId: string;
  locale: Locale;
  languageId: string | null;
};

export async function CmsLayoutPage({
  cmsPageId,
  locale,
  languageId,
}: CmsLayoutPageProps) {
  const cmsPage = await readCmsPage(cmsPageId, languageId);
  const ctx = await createStorefrontCmsContext({
    locale,
    languageId,
    routeName: "frontend.cms.page.full",
    foreignKey: cmsPageId,
  });

  return <CmsPage content={cmsPage} ctx={ctx} />;
}
