import type {
  CmsAdapter,
  CmsPage,
  CmsRouteContext,
} from "./recommended-architecture";

type ExternalCmsPage = Partial<CmsPage>;

async function fetchFromYourCms(
  _context: CmsRouteContext,
): Promise<ExternalCmsPage | null> {
  return null;
}

function normalizeCmsPage(rawPage: ExternalCmsPage): CmsPage {
  return {
    blocks: rawPage.blocks ?? [],
    seo: rawPage.seo,
    title: rawPage.title,
  };
}

const cmsAdapter: CmsAdapter = {
  async resolvePage(context) {
    const rawPage = await fetchFromYourCms(context);

    if (!rawPage) return null;

    return normalizeCmsPage(rawPage);
  },
};
