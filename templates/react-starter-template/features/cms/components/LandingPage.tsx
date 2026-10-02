import { CmsPage } from "@shopware/cms-base-layer-react";

import { createStorefrontCmsContext } from "@/platform/cms/context";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { readLandingPage } from "@/platform/shopware/reads/landingPage";

export type LandingPageProps = {
  landingPageId: string;
};

export async function LandingPage({ landingPageId }: LandingPageProps) {
  const landingPage = await readLandingPage(landingPageId).catch(notFoundOn404);
  const ctx = await createStorefrontCmsContext({
    routeName: "frontend.landing.page",
    foreignKey: landingPageId,
    landingPage,
  });

  if (!landingPage.cmsPage) {
    return (
      <p className="container mx-auto bg-white px-4 py-8 text-surface-on-surface-variant">
        This landing page has no layout assigned.
      </p>
    );
  }

  return <CmsPage content={landingPage.cmsPage} ctx={ctx} />;
}
