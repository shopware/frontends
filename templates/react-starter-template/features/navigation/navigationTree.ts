import { getCategoryUrl, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";
import { defaultLocale, withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export type NavigationNode = {
  id: string;
  name: string;
  href: string;
  external: boolean;
  lang?: string;
  children: NavigationNode[];
};

export function buildNavigationTree(
  categories: Schemas["Category"][] | undefined,
  locale: Locale = defaultLocale,
  contentLang?: string,
): NavigationNode[] {
  return (categories ?? []).map((category) => ({
    id: category.id,
    name: getTranslatedProperty(category, "name"),
    href: withLocale(getCategoryUrl(category), locale),
    external: Boolean(category.externalLink || category.linkNewTab),
    ...(contentLang ? { lang: contentLang } : {}),
    children: buildNavigationTree(category.children ?? [], locale, contentLang),
  }));
}
