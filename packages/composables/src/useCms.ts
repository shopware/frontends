import { Ref, computed, ComputedRef, provide, inject, unref, ref } from "vue";
import {
  SearchCriteria,
  ClientApiError,
  CmsPageResponse,
  CmsResourceType,
} from "@shopware-pwa/commons";
import { _parseUrlQuery, getCmsEntityByType } from "@shopware-pwa/helpers";
import { searchCms } from "./searchLogic";
import { useShopwareContext } from ".";
// import {
//   getApplicationContext,
//   useDefaults,
//   useBreadcrumbs,
//   useSharedState,
// } from "@shopware-pwa/composables";
// import merge from "lodash/merge";

/**
 * @beta
 */
export function useCms(): {
  page: ComputedRef<CmsPageResponse | null>;
  resourceType: ComputedRef<CmsResourceType | null>;
  resourceIdentifier: ComputedRef<string | null>;
  currentSearchPathKey: ComputedRef<string | null>;
  search: (path: string, query?: any) => Promise<void>;
  cmsContent: ComputedRef<CmsPageResponse>;
} {
  // Handle CMS context
  const cmsContext: Ref<any> = inject("swCmsContext", ref(null));
  provide("swCmsContext", cmsContext);

  const { apiInstance } = useShopwareContext();

  const _searchPath = inject("swCmsSearchPath", ref(""));
  provide("swCmsSearchPath", _searchPath);
  const page = computed(() => cmsContext.value.cmsPage);

  const resourceIdentifier = computed(() => {
    // each cms page is in relation one-to-one with categoryId (resourceIdentifier)
    return (
      cmsContext.value?.category?.afterCategoryId ||
      page.value?.resourceIdentifier ||
      null
    );
  });

  const search = async (path: string, query?: any): Promise<any> => {
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
    }
  };

  return {
    page,
    search,
    currentSearchPathKey: computed(() => _searchPath.value),
    resourceType: computed(() => page.value?.resourceType || null),
    resourceIdentifier,
    cmsContent: computed(() => cmsContext.value),
  };
}
