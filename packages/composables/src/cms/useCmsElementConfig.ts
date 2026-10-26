import { toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

import type { Schemas } from "#shopware";

import type { ElementConfig } from "../types";

/**
 * Composable to get cms element config
 *
 * `getConfigValue` reads the element on every call, so it follows a `ref` or
 * getter passed as `element`.
 *
 * @category CMS (Shopping Experiences)
 */
export function useCmsElementConfig<
  T extends Omit<Schemas["CmsSlot"], "config"> & {
    config: Record<string, ElementConfig<unknown> | undefined>;
  },
>(element: MaybeRefOrGetter<T>) {
  const getConfigValue = <ELEMENT_CONFIG extends keyof T["config"]>(
    key: ELEMENT_CONFIG,
  ): NonNullable<T["config"][ELEMENT_CONFIG]>["value"] => {
    const config = toValue(element)?.config;
    if (!config) {
      return undefined as NonNullable<T["config"][ELEMENT_CONFIG]>["value"];
    }
    return config[key]?.source !== "mapped" && config[key]?.value;
  };

  return {
    getConfigValue,
  };
}
