"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

import { ACCOUNT_MENU_LINKS, isCurrentAccountPage } from "./accountMenuLinks";
import { useAccountLogout } from "./useAccountLogout";

const LINK_CLASS =
  "-mt-px border-b border-transparent text-surface-on-surface hover:border-surface-on-surface aria-[current=page]:border-surface-on-surface";

export function AccountMenuList() {
  return (
    <Suspense fallback={<AccountMenuItems pathname={null} />}>
      <CurrentAccountMenuItems />
    </Suspense>
  );
}

function CurrentAccountMenuItems() {
  const pathname = usePathname();
  return <AccountMenuItems pathname={pathname} />;
}

function AccountMenuItems({ pathname }: { pathname: string | null }) {
  const { pending, logout } = useAccountLogout();
  const t = useTranslations();

  return (
    <ul className="flex flex-col gap-3">
      {ACCOUNT_MENU_LINKS.map(({ href, labelKey }) => (
        <li key={href}>
          <LocaleLink
            href={href}
            className={LINK_CLASS}
            aria-current={
              isCurrentAccountPage(pathname, href) ? "page" : undefined
            }
          >
            {t(labelKey)}
          </LocaleLink>
        </li>
      ))}
      <li>
        <button
          type="button"
          aria-busy={pending}
          aria-disabled={pending || undefined}
          className="-mt-px border-b border-transparent bg-transparent text-left text-other-sale hover:border-other-sale aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          onClick={() => {
            void logout();
          }}
        >
          {t("account.menu.logout")}
        </button>
      </li>
    </ul>
  );
}
