"use client";

import { cx, useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";

import { SearchSmallIcon } from "@/components/icons";
import { INPUT_CLASS } from "@/components/input";
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
        className={cx(
          INPUT_CLASS,
          "pr-10 pl-3 focus-visible:ring-brand-primary/20",
        )}
      />
      <SearchSmallIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-surface-on-surface-variant" />
    </div>
  );
}
