import { connection } from "next/server";
import { Suspense } from "react";

import { LocaleLink } from "@/components/LocaleLink";
import { buildNavigationTree } from "@/features/navigation/navigationTree";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";
import { readNavigation } from "@/platform/shopware/reads/navigation";

import { FooterColumns } from "./FooterColumns";
import { NewsletterBox } from "./NewsletterBox";

export type FooterProps = { locale: Locale };

async function FooterNavigation({ locale }: FooterProps) {
  await connection();

  const { languageId, contentLang } = await resolveContentLanguage(locale);
  const categories = await readNavigation(
    "footer-navigation",
    1,
    languageId,
  ).catch((error: unknown) => {
    console.error("[Footer] reading the footer navigation failed", error);
    return [];
  });

  return (
    <FooterColumns
      tree={buildNavigationTree(categories, locale, contentLang)}
    />
  );
}

export function Footer({ locale }: FooterProps) {
  const t = getTranslator(locale);
  return (
    <footer className="bg-brand-primary">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <LocaleLink href="/" className="mb-4 md:mb-0">
            <img
              src="/logo-white.svg"
              alt={t("layout.logo")}
              className="h-16 w-auto sm:h-20"
              width={93}
              height={39}
            />
          </LocaleLink>
          <Suspense fallback={null}>
            <FooterNavigation locale={locale} />
          </Suspense>
          <NewsletterBox className="col-span-1 sm:col-span-2 md:col-span-1" />
        </div>
      </div>
    </footer>
  );
}
