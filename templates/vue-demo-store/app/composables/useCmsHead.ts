import {
  getCategoryImageUrl,
  getSmallestThumbnailUrl,
  getTranslatedProperty,
  isLandingPage,
  isProduct,
} from "@shopware/helpers";
import type { Schemas } from "#shopware";

export type UseCmsHeadReturn = ReturnType<typeof useCmsHead>;

type CmsPageEntity =
  | Schemas["Category"]
  | Schemas["LandingPage"]
  | Schemas["Product"];

type MetaEntry = {
  name: string;
  content: string;
};

function getMetaContent(meta: MetaEntry[], name: string) {
  return meta.find((entry) => entry.name === name)?.content;
}

export function useCmsHead(
  entity: Ref<CmsPageEntity> | ComputedRef<CmsPageEntity>,
  options?: {
    mainShopTitle?: string;
  },
): void {
  const unrefEntity = unref(entity);
  // get title and meta tags available in the Shopware instance
  const { title: metaTitle, meta } = useCmsMeta(unrefEntity);

  const title = computed(() => {
    const title = metaTitle.value;
    if (options?.mainShopTitle) {
      return `${title} | ${options.mainShopTitle}`;
    }
    return title;
  });

  const description = computed(() => getMetaContent(meta.value, "description"));

  const ogTitle = computed(() =>
    isProduct(unrefEntity)
      ? getTranslatedProperty(unrefEntity, "ogTitle") ||
        getMetaContent(meta.value, "title") ||
        title.value
      : getMetaContent(meta.value, "title"),
  );

  const ogDescription = computed(() =>
    isProduct(unrefEntity)
      ? getTranslatedProperty(unrefEntity, "ogDescription") || description.value
      : description.value,
  );

  // access to image varies depending on the type of the entity
  const ogImage = computed(() => {
    if (isLandingPage(unrefEntity)) {
      return;
    }

    if (isProduct(unrefEntity)) {
      return (
        getSmallestThumbnailUrl(unrefEntity.openGraphMedia) ||
        getSmallestThumbnailUrl(unrefEntity.cover?.media)
      );
    }
    const url = getCategoryImageUrl(unrefEntity as Schemas["Category"]);
    return url || undefined;
  });

  const additionalMeta = computed(() =>
    meta.value.filter((entry: MetaEntry) => entry.name !== "description"),
  );

  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogType: "website",
    ogSiteName: title,
  });

  useHead({
    meta: additionalMeta,
  });
}
