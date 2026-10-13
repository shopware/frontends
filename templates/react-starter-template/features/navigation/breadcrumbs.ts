import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";
import { withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export type BreadcrumbItem = {
  key: string;
  name: string;
  href?: string;
  external?: boolean;
};

export function toBreadcrumbItems(
  breadcrumbs: Schemas["Breadcrumb"][],
  locale: Locale,
): BreadcrumbItem[] {
  return breadcrumbs.map((breadcrumb, index) => {
    const key = breadcrumb.categoryId || String(index);
    const name = getTranslatedProperty(breadcrumb, "name");
    const externalLink =
      breadcrumb.type === "link" ? breadcrumb.translated?.externalLink : "";
    if (externalLink) return { key, name, href: externalLink, external: true };
    const path = breadcrumb.path?.replace(/^\/+/, "");
    return path
      ? { key, name, href: withLocale(`/${path}`, locale) }
      : { key, name };
  });
}
