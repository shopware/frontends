import { Ref, computed, ComputedRef } from "vue";
import { RouteName, SeoUrl } from "@shopware-pwa/types";
import { _parseUrlQuery } from "@shopware-pwa/helpers-next";
import { _useContext } from "./internal/_useContext";

export type UseNavigationContextReturn = {
  navigationContext: ComputedRef<SeoUrl | null>;
  routeName: ComputedRef<RouteName | undefined>;
  foreignKey: ComputedRef<string>;
};

export function useNavigationContext(
  context?: Ref<SeoUrl | null>
): UseNavigationContextReturn {
  const _context = _useContext("navigation", context);

  const routeName = computed(() => _context.value?.routeName);
  const foreignKey = computed(() => _context.value?.foreignKey || "");

  return {
    navigationContext: computed(() => _context.value),
    routeName,
    foreignKey,
  };
}
