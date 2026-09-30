import type { Schemas } from "#shopware";

import type { ElementConfig } from "../types";

/**
 * Composable to get cms element config
 *
 * @category CMS (Shopping Experiences)
 */
export function useCmsElementConfig<
  T extends Omit<Schemas["CmsSlot"], "config"> & {
    config: Record<string, ElementConfig<unknown> | undefined>;
  },
>(element: T) {
  const getConfigValue = <ELEMENT_CONFIG extends keyof T["config"]>(
    key: ELEMENT_CONFIG,
  ): NonNullable<T["config"][ELEMENT_CONFIG]>["value"] => {
    if (!element?.config) {
      return undefined as NonNullable<T["config"][ELEMENT_CONFIG]>["value"];
    }
    return (
      element.config[key]?.source !== "mapped" && element.config[key]?.value
    );
  };

  return {
    getConfigValue,
  };
}
