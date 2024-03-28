import { ref } from "vue";
import { createSharedComposable } from "@vueuse/core";

function useListingSharedLoadingFunction() {
  const sharedLoading = ref(false);
  return {
    sharedLoading,
  };
}

export const useListingSharedLoading = createSharedComposable(
  useListingSharedLoadingFunction,
);
