"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { SearchSmallIcon } from "@/components/icons";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

import { isSearchable, normalizeSearchTerm, searchPath } from "../searchTerm";
import { useSearchSuggest } from "../useSearchSuggest";
import type { SearchSuggestState } from "../useSearchSuggest";
import { SearchSuggestBox } from "./SearchSuggestBox";

export type HeaderSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
};

function suggestStatus(
  t: Translate,
  open: boolean,
  state: SearchSuggestState,
): string {
  if (!open) return "";
  if (state.status === "error") return t("search.suggest.unavailable");
  if (state.status !== "ready") return "";
  const { total } = state.result;
  return total > 0
    ? t("search.suggest.status", undefined, total)
    : t("search.noResults");
}

export function HeaderSearch({
  value,
  onValueChange,
  className,
  autoFocus,
}: HeaderSearchProps) {
  const t = useTranslations();
  const localePath = useLocalePath();
  const router = useRouter();
  const { state, request } = useSearchSuggest();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxId = useId();
  const term = normalizeSearchTerm(value);
  const boxOpen = open && isSearchable(term);
  const statusText = suggestStatus(t, boxOpen, state);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!boxOpen || !root) return;

    const isInside = (target: EventTarget | null) =>
      target instanceof Node && root.contains(target);

    const handleMouseDown = (event: MouseEvent) => {
      if (!isInside(event.target)) close();
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (event.relatedTarget && !isInside(event.relatedTarget)) close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const input = inputRef.current;
      if (event.key === "Escape") {
        event.preventDefault();
        input?.focus();
        close();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const links = [...root.querySelectorAll<HTMLAnchorElement>("a[href]")];
      const active = document.activeElement;
      const index = links.findIndex((link) => link === active);
      if (event.key === "ArrowDown") {
        if (active === input && links[0]) {
          event.preventDefault();
          links[0].focus();
        } else if (index >= 0) {
          event.preventDefault();
          links[index + 1]?.focus();
        }
        return;
      }
      if (index === 0) {
        event.preventDefault();
        input?.focus();
      } else if (index > 0) {
        event.preventDefault();
        links[index - 1]?.focus();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    root.addEventListener("focusout", handleFocusOut);
    root.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      root.removeEventListener("focusout", handleFocusOut);
      root.removeEventListener("keydown", handleKeyDown);
    };
  }, [boxOpen, close]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    onValueChange(next);
    setOpen(true);
    request(normalizeSearchTerm(next));
  }

  function handleFocus() {
    if (!isSearchable(term)) return;
    setOpen(true);
    request(term, { immediate: true });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSearchable(term)) return;
    setOpen(false);
    router.push(localePath(searchPath(term)));
  }

  return (
    <search ref={rootRef} className={cx("relative", className)}>
      <form method="get" action={localePath("/search")} onSubmit={handleSubmit}>
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
          autoCapitalize="off"
          enterKeyHint="search"
          value={value}
          aria-controls={boxOpen ? boxId : undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full rounded-full border border-transparent bg-shell-sand py-2.5 pr-4 pl-11 text-sm text-shell-ink transition-colors placeholder:text-surface-on-surface-variant hover:border-shell-line focus-visible:border-shell-ink focus-visible:ring-1 focus-visible:ring-shell-ink focus-visible:outline-hidden"
        />
        <SearchSmallIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-shell-ink" />
        <output className="sr-only">{statusText}</output>
        {boxOpen ? (
          <SearchSuggestBox
            id={boxId}
            term={term}
            state={state}
            onNavigate={close}
            onClose={close}
          />
        ) : null}
      </form>
    </search>
  );
}
