import { ref, computed, onMounted, inject, provide } from "vue";
import type { ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

export type UseSalutationsReturn = {
  /**
   * All available salutations
   */
  getSalutations: ComputedRef<Schemas["Salutation"][]>;
  /**
   * Fetches the salutations list and assigns the result to the `salutations` property
   */
  fetchSalutations(): Promise<
    operations["readSalutation post /salutation"]["response"]
  >;
};

/**
 * Composable for fetching the salutations list.
 * @public
 * @category Context & Language
 */
export function useSalutations(): UseSalutationsReturn {
  const { apiClient } = useShopwareContext();

  const _salutations = inject("swSalutations", ref());
  provide("swSalutations", _salutations);

  const fetchSalutations = async (): Promise<
    operations["readSalutation post /salutation"]["response"]
  > => {
    const result = await apiClient.invoke("readSalutation post /salutation");
    _salutations.value = result.data.elements;
    return result.data;
  };

  // created separate function for testing proposes
  const mountedCallback = async () => {
    if (!_salutations.value) {
      await fetchSalutations();
    }
  };

  const getSalutations = computed(() => {
    return _salutations.value || [];
  });

  onMounted(mountedCallback);

  return {
    fetchSalutations,
    getSalutations,
  };
}
