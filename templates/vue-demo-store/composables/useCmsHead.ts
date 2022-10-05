import type { CmsPageResponse, Product } from "@shopware-pwa/types";
import {
  getCmsEntityObject,
  getCategoryImageUrl,
  getProductThumbnailUrl,
  isCategory,
  isLandingPage,
  isProduct,
} from "@shopware-pwa/helpers-next";

export type UseCmsHeadReturn = void;

type MetaEntry = {
  name: string;
  content: string;
};
export function useCmsHead(
  cmsPage: CmsPageResponse,
  options?: {
    mainShopTitle?: string;
  }
): UseCmsHeadReturn {
  // get title and meta tags available in the Shopware instance
  const { title: metaTitle, meta } = useCmsMeta(cmsPage);

  const title = computed(() => {
    const title = metaTitle.value;
    if (options?.mainShopTitle) {
      return `${title} | ${options.mainShopTitle}`;
    }
    return title;
  });

  // Add metadata according to Open Graph protocol: https://ogp.me
  const ogMetaAllowedKeys = ["title", "description"];
  const ogMeta = computed(() =>
    meta.value
      .filter((meta: MetaEntry) => ogMetaAllowedKeys.includes(meta.name))
      .map((meta: MetaEntry) => ({
        name: `og:${meta.name}`,
        content: meta.content,
      }))
  );

  const entity = getCmsEntityObject(cmsPage);
  // access to image varies depending on the type of the entity
  const ogImage = computed(() => {
    if (isLandingPage(entity)) {
      return {};
    }

    return {
      name: "og:image",
      content: isProduct(entity)
        ? getProductThumbnailUrl(entity)
        : getCategoryImageUrl(entity),
    };
  });

  const enhancedMeta = computed(() => [
    ...meta.value,
    ...ogMeta.value,
    ogImage.value,
    {
      name: "og:type",
      content: "website",
    },
    {
      name: "og:site_name",
      content: "Shopware Frontends",
    },
  ]);

  // set head internally
  useHead({
    title,
    meta: enhancedMeta,
  });
}
