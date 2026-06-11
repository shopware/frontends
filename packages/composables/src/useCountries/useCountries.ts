import { encodeForQuery } from "@shopware/api-client/helpers";
import { computed, inject, onMounted, provide, ref } from "vue";
import type { ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

export type UseCountriesReturn = {
  mountedCallback(): Promise<void>;
  getCountries: ComputedRef<Schemas["Country"][]>;
  fetchCountries(): Promise<
    operations["readCountry post /country"]["response"]
  >;
  getStatesForCountry(countryId: string): Schemas["CountryState"][] | null;
  getCountriesOptions: ComputedRef<
    {
      label: string;
      value: string;
    }[]
  >;
};

/**
 * Composable to manage countries
 * @public
 * @category Context & Language
 */
export function useCountries(): UseCountriesReturn {
  const { apiClient, cacheableReads } = useShopwareContext();

  const _sharedCountries = inject("swCountries", ref());
  provide("swCountries", _sharedCountries);

  async function fetchCountries() {
    const criteria = {
      associations: {
        states: {},
      },
    };
    const result = cacheableReads
      ? await apiClient.invoke("readCountryGet get /country", {
          query: { _criteria: encodeForQuery(criteria) },
        })
      : await apiClient.invoke("readCountry post /country", {
          body: criteria,
        });
    _sharedCountries.value = result.data.elements;
    return result.data;
  }

  const getCountries = computed(() => {
    return _sharedCountries.value ?? [];
  });

  const getCountriesOptions = computed(() => {
    return (
      _sharedCountries.value?.map((element: Schemas["Country"]) => ({
        label: element.translated.name,
        value: element.id,
      })) ?? []
    );
  });

  const mountedCallback = async () => {
    if (!_sharedCountries.value) {
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
    getCountriesOptions,
  };
}
