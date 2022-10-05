import { Ref, computed, ComputedRef, provide, inject, ref } from "vue";
import {
  SearchCriteria,
  ClientApiError,
  CmsPageResponse,
  CmsResourceType,
  CmsPage,
} from "@shopware-pwa/types";
import { _parseUrlQuery } from "@shopware-pwa/helpers-next";
import { searchCms } from "./searchLogic";
import { useShopwareContext } from "./useShopwareContext";

export type UseCmsReturn = {
  page: ComputedRef<CmsPage>;
  resourceType: ComputedRef<CmsResourceType | null>;
  resourceIdentifier: ComputedRef<string | null>;
  currentSearchPathKey: ComputedRef<string | null>;
  search: (path: string, query?: any) => Promise<CmsPageResponse | null>;
  cmsContent: ComputedRef<CmsPageResponse>;
};

export function useCms(): UseCmsReturn {
  // Handle CMS context
  const cmsContext: Ref<any> = inject("swCmsContext", ref(null));
  provide("swCmsContext", cmsContext);

  const { apiInstance } = useShopwareContext();

  const _searchPath = inject("swCmsSearchPath", ref(""));
  provide("swCmsSearchPath", _searchPath);

  const page: ComputedRef<CmsPage> = computed(() => cmsContext.value?.cmsPage);

  const resourceIdentifier = computed(() => {
    // each cms page is in relation one-to-one with categoryId (resourceIdentifier)
    return (
      cmsContext.value?.category?.id ||
      (page.value as any)?.resourceIdentifier ||
      null
    );
  });

  const search = async (
    path: string,
    query?: any
  ): Promise<CmsPageResponse | null> => {
    _searchPath.value = path;

    const criteria: SearchCriteria = _parseUrlQuery(query);
    // const searchCriteria = merge({}, getDefaults(), criteria);
    const searchCriteria = {}; // getDefaults();

    try {
      cmsContext.value = await searchCms(path, searchCriteria, apiInstance);
      return cmsContext.value;
    } catch (e) {
      const err = e as ClientApiError;
      cmsContext.value = null;
      return null;
    }
  };

  return {
    page,
    search,
    currentSearchPathKey: computed(() => _searchPath.value),
    resourceType: computed(() => (page.value as any)?.resourceType || null),
    resourceIdentifier,
    cmsContent: computed(() => cmsContext.value),
  };
}
