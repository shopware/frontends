"use client";

import type { ReactNode } from "react";

import { CustomerProvider } from "@/features/account/customer/CustomerProvider";

import { AccountGuard } from "./AccountGuard";
import { AccountMenuList } from "./AccountMenuList";

const t = {
  "layout.ariaLabels.accountNavigation": "Account navigation",
  "account.menu.header": "Your account",
};

export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto mt-5 flex w-full max-w-screen-2xl gap-20 px-4 md:mt-20">
      <nav
        aria-label={t["layout.ariaLabels.accountNavigation"]}
        className="hidden flex-col gap-3 text-nowrap md:flex"
      >
        <h2 className="text-base leading-normal font-bold text-brand-primary">
          {t["account.menu.header"]}
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
