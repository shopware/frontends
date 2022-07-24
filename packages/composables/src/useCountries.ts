import {
  computed,
  Ref,
  ref,
  onMounted,
  ComputedRef,
  inject,
  provide,
} from "vue";
import { getAvailableCountries } from "@shopware-pwa/shopware-6-client";
import { ClientApiError, Country } from "@shopware-pwa/commons/interfaces";
import { useShopwareContext } from "./useShopwareContext";
// import {
//   useSharedState,
//   getApplicationContext,
// } from "@shopware-pwa/composables";

/**
 * @beta
 */
export interface IUseCountries {
  mountedCallback: () => Promise<void>;
  getCountries: ComputedRef<Country[]>;
  fetchCountries: () => Promise<void>;
  error: Ref<any>;
}

/**
 * @beta
 */
export function useCountries(): IUseCountries {
  const COMPOSABLE_NAME = "useCountries";
  const contextName = COMPOSABLE_NAME;

  const { apiInstance } = useShopwareContext();
  // const { sharedRef } = useSharedState();
  // const _sharedCountried: Ref<Country[] | null> = sharedRef(
  //   `sw-${contextName}-countries`
  // );
  const _sharedCountried = inject("swCountries", ref());
  provide("swCountries", _sharedCountried);
  const error: Ref<any> = ref(null);

  const fetchCountries = async (): Promise<void> => {
    try {
      const { elements } = await getAvailableCountries(apiInstance);
      _sharedCountried.value = elements;
    } catch (e) {
      const err = e as ClientApiError;
      error.value = err.messages;
    }
  };

  const getCountries = computed(() => {
    return _sharedCountried.value ?? [];
  });

  const mountedCallback = async () => {
    if (!_sharedCountried.value) {
      await fetchCountries();
    }
  };

  onMounted(mountedCallback);

  return {
    mountedCallback,
    fetchCountries,
    getCountries,
    error,
  };
}
