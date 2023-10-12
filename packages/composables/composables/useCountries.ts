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
import { Country, CountryState } from "@shopware-pwa/types";

export type UseCountriesReturn = {
  mountedCallback(): Promise<void>;
  getCountries: ComputedRef<Country[]>;
  fetchCountries(): Promise<void>;
  getStatesForCountry(countryId: string): CountryState[] | null;
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

  const getStatesForCountry = (countryId: string) => {
    return (
      getCountries.value.find((element: Country) => {
        return element.id === countryId;
      })?.states || null
    );
  };

  onMounted(mountedCallback);

  return {
    mountedCallback,
    fetchCountries,
    getStatesForCountry,
    getCountries,
  };
}
