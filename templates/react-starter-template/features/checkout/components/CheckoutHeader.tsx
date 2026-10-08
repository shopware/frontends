import { cx } from "@shopware/cms-base-layer-react/client";

import { LocaleLink } from "@/components/LocaleLink";
import { MetaNavigation } from "@/features/layout/components/MetaNavigation";
import { SHELL_BUTTON_SECONDARY_CLASS } from "@/features/layout/shellButton";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";

export type CheckoutHeaderProps = { locale: Locale };

export function CheckoutHeader({ locale }: CheckoutHeaderProps) {
  const t = getTranslator(locale);
  return (
    <header className="border-b border-shell-line bg-surface-surface">
      <MetaNavigation />
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-3">
        <LocaleLink
          href="/"
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shell-ink"
        >
          <img
            src="/logo.svg"
            alt={t("layout.logo")}
            width={93}
            height={39}
            className="h-10 w-auto sm:h-12"
          />
        </LocaleLink>
        <LocaleLink
          href="/"
          className={cx(
            SHELL_BUTTON_SECONDARY_CLASS,
            "inline-flex items-center gap-1 px-5 py-2 text-sm leading-6",
          )}
        >
          {t("cart.continueShopping")}
        </LocaleLink>
      </div>
    </header>
  );
}
