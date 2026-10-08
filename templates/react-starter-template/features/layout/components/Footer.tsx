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
    <footer className="bg-shell-ink text-shell-on-ink">
      <div className="bg-shell-sand text-shell-ink">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 md:py-14">
          <NewsletterBox />
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-screen-2xl gap-10 px-4 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-16">
        <div>
          <LocaleLink
            href="/"
            className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shell-accent"
          >
            <img
              src="/logo-white.svg"
              alt={t("layout.logo")}
              className="h-12 w-auto"
              width={93}
              height={39}
            />
          </LocaleLink>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          <Suspense fallback={null}>
            <FooterNavigation locale={locale} />
          </Suspense>
        </div>
      </div>
      <div className="border-t border-shell-on-ink/15">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-5">
          <p className="text-sm text-shell-on-ink-muted">
            {t("layout.footer.builtWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
