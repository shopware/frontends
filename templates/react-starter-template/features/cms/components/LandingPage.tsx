import { CmsPage } from "@shopware/cms-base-layer-react";
import { getTranslatedProperty } from "@shopware/helpers";

import { Breadcrumbs } from "@/features/navigation/components/Breadcrumbs";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { createStorefrontCmsContext } from "@/platform/cms/context";
import { getSiteUrl } from "@/platform/seo/siteUrl";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";

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
  const [ctx, { contentLang }] = await Promise.all([
    createStorefrontCmsContext({
      locale,
      languageId,
      routeName: "frontend.landing.page",
      foreignKey: landingPageId,
      landingPage,
    }),
    resolveContentLanguage(locale),
  ]);
  const name = getTranslatedProperty(landingPage, "name");
  const trail = (
    <Breadcrumbs
      items={name ? [{ key: landingPage.id, name }] : []}
      locale={locale}
      contentLang={contentLang}
      siteUrl={getSiteUrl()}
    />
  );

  if (!landingPage.cmsPage) {
    return (
      <>
        {trail}
        <p className="container mx-auto bg-white px-4 py-8 text-surface-on-surface-variant">
          {getTranslator(locale)("cms.noLayout.landingPage")}
        </p>
      </>
    );
  }

  return (
    <>
      {trail}
      <CmsPage content={landingPage.cmsPage} ctx={ctx} />
    </>
  );
}
