"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

import { ACCOUNT_MENU_LINKS, isCurrentAccountPage } from "./accountMenuLinks";
import { useAccountLogout } from "./useAccountLogout";

const ITEM_CLASS =
  "block w-full rounded-md px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent-strong";

const LINK_CLASS = `${ITEM_CLASS} text-surface-on-surface hover:bg-shell-sand-strong`;

const CURRENT_LINK_CLASS = `${ITEM_CLASS} bg-shell-ink text-shell-on-ink`;

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
    <ul className="flex flex-col gap-1">
      {ACCOUNT_MENU_LINKS.map(({ href, labelKey }) => {
        const current = isCurrentAccountPage(pathname, href);
        return (
          <li key={href}>
            <LocaleLink
              href={href}
              className={current ? CURRENT_LINK_CLASS : LINK_CLASS}
              aria-current={current ? "page" : undefined}
            >
              {t(labelKey)}
            </LocaleLink>
          </li>
        );
      })}
      <li className="mt-3 border-t border-shell-line pt-3">
        <button
          type="button"
          aria-busy={pending}
          aria-disabled={pending || undefined}
          className={`${ITEM_CLASS} bg-transparent font-semibold text-shell-accent-strong hover:bg-shell-sand-strong aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
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
