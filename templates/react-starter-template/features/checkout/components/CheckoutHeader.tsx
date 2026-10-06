import { LocaleLink } from "@/components/LocaleLink";
import { MetaNavigation } from "@/features/layout/components/MetaNavigation";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";

export type CheckoutHeaderProps = { locale: Locale };

export function CheckoutHeader({ locale }: CheckoutHeaderProps) {
  const t = getTranslator(locale);
  return (
    <header className="border-b border-outline-outline-variant bg-surface-surface">
      <MetaNavigation />
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4">
        <div className="py-3.5">
          <LocaleLink href="/">
            <img
              src="/logo.svg"
              alt={t("layout.logo")}
              width={93}
              height={39}
              className="h-20 w-auto max-sm:h-10"
            />
          </LocaleLink>
        </div>
        <LocaleLink
          href="/"
          className="inline-flex items-center gap-1 rounded-sm bg-surface-surface px-4 py-3 leading-6 font-bold text-brand-primary outline-2 -outline-offset-2 outline-brand-primary outline-solid"
        >
          {t("cart.continueShopping")}
        </LocaleLink>
      </div>
    </header>
  );
}
