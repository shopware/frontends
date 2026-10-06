import { CmsPage } from "@shopware/cms-base-layer-react";

import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";

export type LandingPageProps = {
  landingPageId: string;
  locale: Locale;
  languageId: string | null;
};

export async function LandingPage({
  landingPageId,
  locale,
  languageId,
}: LandingPageProps) {
  const landingPage = await readLandingPage(landingPageId, languageId).catch(
    notFoundOn404,
  );
  const ctx = await createStorefrontCmsContext({
    locale,
    languageId,
    routeName: "frontend.landing.page",
    foreignKey: landingPageId,
    landingPage,
  });

  if (!landingPage.cmsPage) {
    return (
      <p className="container mx-auto bg-white px-4 py-8 text-surface-on-surface-variant">
        {getTranslator(locale)("cms.noLayout.landingPage")}
      </p>
    );
  }

  return <CmsPage content={landingPage.cmsPage} ctx={ctx} />;
}
