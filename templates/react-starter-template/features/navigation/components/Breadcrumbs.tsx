import Link from "next/link";

import { ChevronRightSmallIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { buildBreadcrumbListJsonLd } from "@/platform/seo/jsonLd";

import type { BreadcrumbItem } from "../breadcrumbs";

const LINK_CLASS =
  "rounded-sm underline-offset-2 hover:text-surface-on-surface hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus";

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  locale: Locale;
  contentLang?: string;
  siteUrl: URL | null;
};

function Crumb({
  item,
  current,
  contentLang,
}: {
  item: BreadcrumbItem;
  current: boolean;
  contentLang?: string;
}) {
  const ariaCurrent = current ? "page" : undefined;
  if (item.href && item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener"
        lang={contentLang}
        aria-current={ariaCurrent}
        className={LINK_CLASS}
      >
        {item.name}
      </a>
    );
  }
  if (item.href) {
    return (
      <Link
        href={item.href}
        lang={contentLang}
        aria-current={ariaCurrent}
        className={LINK_CLASS}
      >
        {item.name}
      </Link>
    );
  }
  return (
    <span lang={contentLang} aria-current={ariaCurrent}>
      {item.name}
    </span>
  );
}

export function Breadcrumbs({
  items,
  locale,
  contentLang,
  siteUrl,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;
  const t = getTranslator(locale);
  const home = withLocale("/", locale);
  return (
    <>
      <nav
        aria-label={t("layout.ariaLabels.breadcrumb")}
        className="mx-auto hidden w-full max-w-screen-2xl px-4 pt-8 pb-4 lg:block"
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm text-surface-on-surface-variant">
          <li className="flex items-center">
            <Link href={home} className={LINK_CLASS}>
              {t("home")}
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.key} className="flex items-center gap-2">
              <ChevronRightSmallIcon aria-hidden="true" className="size-2" />
              <Crumb
                item={item}
                current={index === items.length - 1}
                contentLang={contentLang}
              />
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={buildBreadcrumbListJsonLd(
          items.filter((item) => !item.external),
          siteUrl,
        )}
      />
    </>
  );
}
