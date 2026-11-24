"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { LocaleLink } from "@/components/LocaleLink";
import {
  ACCOUNT_MENU_LINKS,
  isCurrentAccountPage,
} from "@/features/account/components/accountMenuLinks";
import { useAccountLogout } from "@/features/account/components/useAccountLogout";
import { useTranslations } from "@/i18n/I18nProvider";

export type AccountMenuProps = {
  id: string;
  customerName: string | null;
  triggerRef: RefObject<HTMLElement | null>;
  onClose(): void;
};

export function AccountMenu({
  id,
  customerName,
  triggerRef,
  onClose,
}: AccountMenuProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const { pending, logout } = useAccountLogout();
  const panelRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef(pathname);

  useEffect(() => {
    if (pathname !== openedAt.current) onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    const isInside = (target: EventTarget | null) =>
      target instanceof Node &&
      (panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      if (!active || active === document.body || isInside(active)) {
        triggerRef.current?.focus();
      }
      onClose();
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!isInside(event.target)) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [triggerRef, onClose]);

  async function handleLogout() {
    if (!(await logout())) return;
    triggerRef.current?.focus();
    onClose();
  }

  return (
    <div
      ref={panelRef}
      id={id}
      data-testid="header-account-menu"
      className="absolute top-full right-0 z-20 mt-2 flex w-max max-w-44 flex-col gap-0.5 overflow-hidden rounded-lg border border-shell-line bg-surface-surface py-2 shadow-lg sm:max-w-xs"
    >
      {customerName ? (
        <p className="-mt-2 mb-2 border-b border-shell-line bg-shell-sand px-5 py-3 text-sm wrap-break-word text-shell-ink">
          {t("layout.header.signedInAs", { name: customerName })}
        </p>
      ) : null}
      {ACCOUNT_MENU_LINKS.map(({ href, labelKey }) => (
        <LocaleLink
          key={href}
          href={href}
          data-testid={
            href === "/account" ? "header-my-account-link" : undefined
          }
          aria-current={
            isCurrentAccountPage(pathname, href) ? "page" : undefined
          }
          className="mx-2 rounded-md px-3 py-2 text-nowrap text-surface-on-surface transition-colors hover:bg-shell-sand focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shell-ink aria-[current=page]:bg-shell-sand aria-[current=page]:font-semibold"
          onClick={onClose}
        >
          {t(labelKey)}
        </LocaleLink>
      ))}
      <button
        type="button"
        data-testid="header-account-logout-button"
        aria-busy={pending}
        aria-disabled={pending || undefined}
        className="mx-2 rounded-md bg-transparent px-3 py-2 text-left font-medium text-shell-accent-strong transition-colors hover:bg-shell-sand focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shell-accent-strong aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        onClick={() => {
          void handleLogout();
        }}
      >
        {t("account.menu.logout")}
      </button>
    </div>
  );
}
