import { connection } from "next/server";
import { Suspense, cache } from "react";

import { HeaderBar } from "@/features/layout/components/HeaderBar";
import { MetaNavigation } from "@/features/layout/components/MetaNavigation";
import { HEADER_ACTION_CLASS } from "@/features/layout/headerAction";
import {
  MobileMenu,
  MobileMenuPending,
} from "@/features/navigation/components/MobileMenu";
import {
  TopNavigation,
  TopNavigationPlaceholder,
} from "@/features/navigation/components/TopNavigation";
import { buildNavigationTree } from "@/features/navigation/navigationTree";
import type { Locale } from "@/i18n/config";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";
import { readNavigation } from "@/platform/shopware/reads/navigation";

const loadMainNavigation = cache(async (locale: Locale) => {
  await connection();

  const { languageId, contentLang } = await resolveContentLanguage(locale);
  const categories = await readNavigation(
    "main-navigation",
    2,
    languageId,
  ).catch((error: unknown) => {
    console.error("[Header] reading the main navigation failed", error);
    return [];
  });

  return buildNavigationTree(categories, locale, contentLang);
});

export type HeaderProps = { locale: Locale };

export function Header({ locale }: HeaderProps) {
  return (
    <header className="bg-surface-surface">
      <MetaNavigation />
      <div className="border-b border-outline-outline-variant">
        <HeaderBar
          menu={
            <Suspense
              fallback={<MobileMenuPending className={HEADER_ACTION_CLASS} />}
            >
              <HeaderMobileMenu locale={locale} />
            </Suspense>
          }
        />
      </div>
      <div className="max-lg:hidden">
        <Suspense fallback={<TopNavigationPlaceholder />}>
          <HeaderTopNavigation locale={locale} />
        </Suspense>
      </div>
    </header>
  );
}

async function HeaderMobileMenu({ locale }: HeaderProps) {
  const tree = await loadMainNavigation(locale);

  return <MobileMenu tree={tree} className={HEADER_ACTION_CLASS} />;
}

async function HeaderTopNavigation({ locale }: HeaderProps) {
  const tree = await loadMainNavigation(locale);

  return <TopNavigation tree={tree} />;
}
