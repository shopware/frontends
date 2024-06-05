import { ref, computed, onMounted, inject, provide } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";
import { ApiClientError } from "@shopware/api-client";

export type UseSalutationsReturn = {
  /**
   * All available salutations
   */
  getSalutations: ComputedRef<Schemas["Salutation"][]>;
  /**
   * Fetches the salutations list and assigns the result to the `salutations` property
   */
  fetchSalutations(): Promise<void>;
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

  const error: Ref<any> = ref(null);

  const fetchSalutations = async (): Promise<void> => {
    try {
      const result = await apiClient.invoke("readSalutation post /salutation");
      _salutations.value = result.data.elements;
    } catch (e) {
      if (e instanceof ApiClientError) {
        error.value = e.message;
      } else {
        console.error("[useSalutations][fetchSalutations]", e);
      }
    }
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
