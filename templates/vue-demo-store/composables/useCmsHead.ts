import {
  getCategoryImageUrl,
  getSmallestThumbnailUrl,
  isLandingPage,
  isProduct,
} from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";

export type UseCmsHeadReturn = void;

type CmsPageEntity =
  | Schemas["Category"]
  | Schemas["LandingPage"]
  | Schemas["Product"];

type MetaEntry = {
  name: string;
  content: string;
};
export function useCmsHead(
  entity: Ref<CmsPageEntity> | ComputedRef<CmsPageEntity>,
  options?: {
    mainShopTitle?: string;
  },
): UseCmsHeadReturn {
  const unrefEntity = unref(entity) as CmsPageEntity;
  // get title and meta tags available in the Shopware instance
  const { title: metaTitle, meta } = useCmsMeta(unrefEntity);

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
      })),
  );

  // access to image varies depending on the type of the entity
  const ogImage = computed(() => {
    if (isLandingPage(unrefEntity)) {
      return {};
    }

    return {
      name: "og:image",
      content: isProduct(unrefEntity)
        ? getSmallestThumbnailUrl(unrefEntity.media)
        : getCategoryImageUrl(unrefEntity as Schemas["Category"]),
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
      content: title.value,
    },
  ]);

  // set head internally
  useHead({
    title,
    meta: enhancedMeta,
  });
}
