"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

export function NotFoundContent() {
  const t = useTranslations();
  const message = t("errors.message-404");
  return (
    <div
      className="mx-auto my-24 w-full max-w-3xl px-4 text-center"
      data-testid="not-found"
    >
      <title>{message}</title>
      <h1 className="mb-4 font-serif text-6xl leading-none text-surface-on-surface md:text-7xl">
        404
      </h1>
      <h2 className="mb-12 text-2xl leading-tight font-bold text-surface-on-surface md:text-3xl">
        {message}
      </h2>
      <LocaleLink
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-center text-base font-medium text-brand-on-primary hover:bg-brand-primary-hover focus-visible:ring-4 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden"
      >
        {t("layout.notFound.backToHomepage")}
      </LocaleLink>
    </div>
  );
}
