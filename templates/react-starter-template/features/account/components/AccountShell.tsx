"use client";

import type { ReactNode } from "react";

import { CustomerProvider } from "@/features/account/customer/CustomerProvider";
import { useTranslations } from "@/i18n/I18nProvider";

import { AccountGuard } from "./AccountGuard";
import { AccountMenuList } from "./AccountMenuList";

export function AccountShell({ children }: { children: ReactNode }) {
  const t = useTranslations();
  return (
    <div className="container mx-auto mt-5 flex w-full max-w-screen-2xl items-start gap-10 px-4 md:mt-12 lg:gap-16">
      <nav
        aria-label={t("layout.ariaLabels.accountNavigation")}
        className="hidden min-w-56 shrink-0 flex-col gap-4 rounded-lg bg-shell-sand p-6 text-nowrap md:flex"
      >
        <h2 className="px-3 text-base leading-normal font-bold text-shell-ink">
          {t("account.menu.header")}
        </h2>
        <AccountMenuList />
      </nav>
      <div className="w-full min-w-0">
        <AccountGuard>
          <CustomerProvider>{children}</CustomerProvider>
        </AccountGuard>
      </div>
    </div>
  );
}
