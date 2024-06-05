import { computed, ref, onMounted, inject, provide } from "vue";
import type { ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseCountriesReturn = {
  mountedCallback(): Promise<void>;
  getCountries: ComputedRef<Schemas["Country"][]>;
  fetchCountries(): Promise<void>;
  getStatesForCountry(countryId: string): Schemas["CountryState"][] | null;
};

/**
 * Composable to manage countries
 * @public
 * @category Context & Language
 */
export function useCountries(): UseCountriesReturn {
  const { apiClient } = useShopwareContext();

  const _sharedCountried = inject("swCountries", ref());
  provide("swCountries", _sharedCountried);

  async function fetchCountries() {
    const result = await apiClient.invoke("readCountry post /country", {
      body: {
        associations: {
          states: {},
        },
      },
    });
    _sharedCountried.value = result.data.elements;
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
      getCountries.value.find((element: Schemas["Country"]) => {
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
