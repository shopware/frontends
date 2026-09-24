import { computed, ref } from "vue";
import type { ComputedRef, Ref } from "vue";

type MediaOption = { media: { filename: string; id: string } };
type CustomizedProductTemplate = { id: string; options?: unknown[] };

export type UseProductCustomizedProductConfiguratorReturn = {
  customizedProduct: ComputedRef<CustomizedProductTemplate | undefined>;
  state: Ref<Record<string, string | MediaOption>>;
  isActive: ComputedRef<boolean>;
  addToCart: () => Promise<void>;
  handleFileUpload: (event: Event, optionId: string) => Promise<void>;
};

export function useProductCustomizedProductConfigurator(): UseProductCustomizedProductConfiguratorReturn {
  return {
    customizedProduct: computed(() => undefined),
    state: ref({}),
    isActive: computed(() => false),
    addToCart: async () => {},
    handleFileUpload: async () => {},
  };
}
