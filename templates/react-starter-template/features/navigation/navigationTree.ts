import { getCategoryUrl, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type NavigationNode = {
  id: string;
  name: string;
  href: string;
  external: boolean;
  children: NavigationNode[];
};

export function buildNavigationTree(
  categories: Schemas["Category"][] | undefined,
): NavigationNode[] {
  return (categories ?? []).map((category) => ({
    id: category.id,
    name: getTranslatedProperty(category, "name"),
    href: getCategoryUrl(category),
    external: Boolean(category.externalLink || category.linkNewTab),
    children: buildNavigationTree(category.children ?? []),
  }));
}
