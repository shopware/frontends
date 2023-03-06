import {
  computed,
  Ref,
  ref,
  onMounted,
  ComputedRef,
  inject,
  provide,
} from "vue";
import { getAvailableCountries } from "@shopware-pwa/api-client";
import { Country } from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";

export type UseCountriesReturn = {
  mountedCallback: () => Promise<void>;
  getCountries: ComputedRef<Country[]>;
  fetchCountries: () => Promise<void>;
};

/**
 * Composable to manage countries
 * @public
 * @category Context & Language
 */
export function useCountries(): UseCountriesReturn {
  const { apiInstance } = useShopwareContext();

  const _sharedCountried = inject("swCountries", ref());
  provide("swCountries", _sharedCountried);

  async function fetchCountries() {
    const { elements } = await getAvailableCountries(apiInstance);
    _sharedCountried.value = elements;
  }

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
  };
}
