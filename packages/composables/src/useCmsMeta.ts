import { computed, ComputedRef } from "vue";
import {
  getTranslatedProperty,
  getCmsEntityObject,
} from "@shopware-pwa/helpers-next";
import type { CmsPageResponse } from "@shopware-pwa/types";

export type UseCmsMetaReturn = {
  title: ComputedRef<string>;
  meta: ComputedRef<{ name: string; content: string }[]>;
};

/**
 * TODO: remove parameter and use reactive state of cmsResponse provided by useCms composable
 */
export function useCmsMeta(page: CmsPageResponse): UseCmsMetaReturn {
  const entityObject = getCmsEntityObject(page);

  const meta = computed(() => {
    let entries = [];
    const keywords = getTranslatedProperty(entityObject, "keywords");
    const description = getTranslatedProperty(entityObject, "metaDescription");
    const title = getTranslatedProperty(entityObject, "metaTitle");
    if (keywords) {
      entries.push({ name: "keywords", content: keywords });
    }
    if (description) {
      entries.push({ name: "description", content: description });
    }
    if (title) {
      entries.push({ name: "title", content: title });
    }

    return entries;
  });

  return {
    title: computed(() => getTranslatedProperty(entityObject, "name")),
    meta,
  };
}
