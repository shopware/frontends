import { getCategoryUrl, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type NavigationNode = {
  id: string;
  name: string;
  href: string;
  newTab: boolean;
  children: NavigationNode[];
};

export function buildNavigationTree(
  categories: Schemas["Category"][] | undefined,
): NavigationNode[] {
  return (categories ?? []).map((category) => ({
    id: category.id,
    name: getTranslatedProperty(category, "name"),
    href: getCategoryUrl(category),
    newTab: Boolean(category.externalLink || category.linkNewTab),
    children: buildNavigationTree(category.children ?? []),
  }));
}
