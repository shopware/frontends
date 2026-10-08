"use client";

import { cx, useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";

import { SearchSmallIcon } from "@/components/icons";
import { NOT_WIRED_MESSAGE_KEYS } from "@/features/storefront/notWired";
import { useTranslations } from "@/i18n/I18nProvider";

export function HeaderSearch({
  className,
  autoFocus,
}: {
  className?: string;
  autoFocus?: boolean;
}) {
  const { notify } = useCmsActions();
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    if (!event.currentTarget.value.trim()) return;
    event.preventDefault();
    notify({ type: "info", message: t(NOT_WIRED_MESSAGE_KEYS.search) });
  }

  return (
    <div className={cx("relative", className)}>
      <label htmlFor="search-input" className="sr-only">
        {t("layout.header.search")}
      </label>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        name="search"
        data-testid="header-search-input"
        placeholder={t("search.placeholder")}
        autoComplete="off"
        onKeyDown={handleKeyDown}
        className="w-full rounded-full border border-transparent bg-shell-sand py-2.5 pr-4 pl-11 text-sm text-shell-ink transition-colors placeholder:text-surface-on-surface-variant hover:border-shell-line focus-visible:border-shell-ink focus-visible:ring-1 focus-visible:ring-shell-ink focus-visible:outline-hidden"
      />
      <SearchSmallIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-shell-ink" />
    </div>
  );
}
