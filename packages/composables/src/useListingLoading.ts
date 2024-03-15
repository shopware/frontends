import { ref } from "vue";
import { createSharedComposable } from "@vueuse/core";

function useListingLoadingFunction() {
  const loading = ref(false);
  return {
    loading,
  };
}

export const useListingLoading = createSharedComposable(
  useListingLoadingFunction,
);
