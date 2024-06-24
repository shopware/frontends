import type { Schemas } from "#shopware";
import type { ElementConfig } from "../types";

/**
 * Composable to get cms element config
 *
 * @category CMS (Shopping Experiences)
 */
export function useCmsElementConfig<
  T extends Schemas["CmsSlot"] & {
    config: T["config"] extends {
      [key in infer X extends keyof T["config"]]: ElementConfig<unknown>;
    }
      ? { [key in X]: ElementConfig<T["config"][key]["value"]> }
      : never;
  },
>(element: T) {
  const getConfigValue = <ELEMENT_CONFIG extends keyof T["config"]>(
    key: ELEMENT_CONFIG,
  ): (typeof element.config)[ELEMENT_CONFIG]["value"] => {
    return (
      element.config[key]?.source !== "mapped" && element.config[key]?.value
    );
  };

  return {
    getConfigValue,
  };
}
