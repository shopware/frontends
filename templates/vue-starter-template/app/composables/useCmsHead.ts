import {
  getCategoryImageUrl,
  getCmsMeta,
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

export function useCmsHead(
  entity: Ref<CmsPageEntity> | ComputedRef<CmsPageEntity>,
  options?: {
    mainShopTitle?: string;
  },
): void {
  const unrefEntity = unref(entity);
  const route = useRoute();
  const requestUrl = useRequestURL();
  const canonicalUrl = computed(() => {
    const url = new URL(route.fullPath, requestUrl.origin);
    url.hash = "";
    return url.href;
  });
  // get title and meta tags available in the Shopware instance
  const cmsMeta = getCmsMeta(unrefEntity);

  const title = computed(() => {
    const title = cmsMeta.title;
    if (options?.mainShopTitle) {
      return `${title} | ${options.mainShopTitle}`;
    }
    return title;
  });

  const description = computed(() => cmsMeta.metaDescription || undefined);

  const ogTitle = computed(() =>
    isProduct(unrefEntity)
      ? getTranslatedProperty(unrefEntity, "ogTitle") ||
        cmsMeta.metaTitle ||
        title.value
      : cmsMeta.metaTitle || undefined,
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

    return isProduct(unrefEntity)
      ? getSmallestThumbnailUrl(unrefEntity.openGraphMedia) ||
          getSmallestThumbnailUrl(unrefEntity.cover?.media)
      : getCategoryImageUrl(unrefEntity as Schemas["Category"]);
  });

  const additionalMeta = computed(() =>
    cmsMeta.keywords ? [{ name: "keywords", content: cmsMeta.keywords }] : [],
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

  useHead(() => ({
    link: [
      {
        rel: "canonical",
        href: canonicalUrl.value,
      },
    ],
  }));
}
