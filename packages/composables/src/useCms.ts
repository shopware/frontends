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
  // loading: Ref<boolean>;
  search: (path: string, query?: any) => Promise<void>;
  // error: Ref<any>;
  metaTitle: ComputedRef<string>;
  metaDescription: ComputedRef<string>;
  metaKeywords: ComputedRef<string>;
  pageTitle: ComputedRef<string>;
} {
  // Handle CMS context
  const cmsContext = inject("swCmsContext", ref(null));
  provide("swCmsContext", cmsContext);

  const { apiInstance } = useShopwareContext();

  // const cacheKey = cmsContext
  //   ? `${contextName}(cms-${cmsContext})`
  //   : contextName;

  // const { sharedRef } = useSharedState();
  const _searchPath = inject("swCmsSearchPath", ref("")); // sharedRef<string>(`${cacheKey}-searchPath`);
  provide("swCmsSearchPath", _searchPath);
  // const _cmsError = sharedRef<any>(`${cacheKey}-cmsError`, null);
  // const _cmsLoading = sharedRef(`${cacheKey}-cmsLoading`, false);

  const _storePage = ref(); // sharedRef<CmsPageResponse>(`${cacheKey}-page`);

  // const { getDefaults } = useDefaults({ defaultsKey: COMPOSABLE_NAME });
  // const { setBreadcrumbs } = useBreadcrumbs();
  const page = computed(() => _storePage.value);

  const resourceIdentifier = computed(() => {
    // each cms page is in relation one-to-one with categoryId (resourceIdentifier)
    return page.value?.resourceIdentifier || null;
  });

  const getEntityObject = computed(
    () => getCmsEntityByType(unref(_storePage)) || ({} as any)
  );
  const pageTitle = computed(() => getEntityObject.value.translated?.name);
  const metaTitle = computed(() => getEntityObject.value.translated?.metaTitle);
  const metaDescription = computed(
    () => getEntityObject.value.translated?.metaDescription
  );
  const metaKeywords = computed(
    () => getEntityObject.value.translated?.keywords
  );

  /**
   * @beta
   */
  const search = async (path: string, query?: any): Promise<any> => {
    console.error("SEARCH INVOKED");
    // _cmsLoading.value = true;
    // _cmsError.value = null;
    _searchPath.value = path;

    const criteria: SearchCriteria = _parseUrlQuery(query);
    // const searchCriteria = merge({}, getDefaults(), criteria);
    const searchCriteria = {}; // getDefaults();

    try {
      // const result = await getCmsPage(path, searchCriteria, apiInstance);

      // _storePage.value = result;
      // result?.breadcrumb && setBreadcrumbs(Object.values(result.breadcrumb));
      return searchCms(path, searchCriteria, apiInstance);
    } catch (e) {
      console.error("CMS ERROR", e);
      const err = e as ClientApiError;
      // _cmsError.value = err;
      _storePage.value = null;
    } finally {
      // _cmsLoading.value = false;
    }
  };

  return {
    page,
    // loading: computed(() => _cmsLoading.value || false),
    search,
    currentSearchPathKey: computed(() => _searchPath.value),
    // error: computed(() => _cmsError.value),
    resourceType: computed(() => page.value?.resourceType || null),
    resourceIdentifier,
    metaTitle,
    metaDescription,
    metaKeywords,
    pageTitle,
  };
}
