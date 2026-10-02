import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type SwVariantOption = {
  id: string;
  name: string;
};

export type SwVariantOptionGroup = {
  id: string;
  name: string;
  options: SwVariantOption[];
};

export function getVariantOptionGroups(
  groups: Schemas["PropertyGroup"][] | null | undefined,
): SwVariantOptionGroup[] {
  return (groups ?? []).map((group) => ({
    id: group.id,
    name: getTranslatedProperty(group, "name"),
    options: (group.options ?? []).map((option) => ({
      id: option.id,
      name: getTranslatedProperty(option, "name"),
    })),
  }));
}
