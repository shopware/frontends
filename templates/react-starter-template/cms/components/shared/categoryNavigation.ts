import {
  getCategoryUrl,
  getTranslatedProperty,
  urlIsAbsolute,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";

import { prefixUrl } from "../../helpers/resolveUrl";

export type CategoryNavigationItem = {
  id: string;
  name: string;
  href: string;
  external: boolean;
  newTab: boolean;
  children: CategoryNavigationItem[];
};

export function toCategoryNavigationItems(
  categories: Schemas["Category"][],
  urlPrefix: string,
): CategoryNavigationItem[] {
  return categories.map((category) => {
    const href = prefixUrl(getCategoryUrl(category), urlPrefix);
    return {
      id: category.id,
      name: getTranslatedProperty(category, "name"),
      href,
      external: urlIsAbsolute(href),
      newTab: !!(category.externalLink || category.linkNewTab),
      children: toCategoryNavigationItems(category.children ?? [], urlPrefix),
    };
  });
}
