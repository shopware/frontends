"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

import { SUGGEST_LIMIT, searchPath } from "../searchTerm";
import type { SearchSuggestState } from "../useSearchSuggest";
import { SearchSuggestItem } from "./SearchSuggestItem";

export type SearchSuggestBoxProps = {
  id: string;
  term: string;
  state: SearchSuggestState;
  onNavigate(): void;
  onClose(): void;
};

function shownProducts(state: SearchSuggestState) {
  if (state.status === "ready") return state.result.products;
  if (state.status === "loading") return state.previous?.products ?? [];
  return [];
}

function SuggestFooter({
  term,
  state,
  onNavigate,
}: Pick<SearchSuggestBoxProps, "term" | "state" | "onNavigate">) {
  const t = useTranslations();
  if (state.status === "error") {
    return <p>{t("search.suggest.unavailable")}</p>;
  }
  if (state.status !== "ready") {
    return (
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
      />
    );
  }
  const { total } = state.result;
  if (total === 0) {
    return (
      <div data-testid="layout-search-result-box-no-result">
        {t("search.noResults")}
      </div>
    );
  }
  const label = [
    t("search.see"),
    total !== 1 ? t("search.all") : null,
    String(total),
    t("search.result", undefined, total),
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <LocaleLink
      href={searchPath(term)}
      prefetch={false}
      data-testid="layout-search-result-box-more-link"
      onClick={onNavigate}
      className="rounded-sm underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-ink"
    >
      {label}
    </LocaleLink>
  );
}

export function SearchSuggestBox({
  id,
  term,
  state,
  onNavigate,
  onClose,
}: SearchSuggestBoxProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const openedAt = useRef(pathname);
  const products = shownProducts(state).slice(0, SUGGEST_LIMIT);
  const loading = state.status !== "ready" && state.status !== "error";

  useEffect(() => {
    if (pathname !== openedAt.current) onClose();
  }, [pathname, onClose]);

  return (
    <div
      id={id}
      data-testid="layout-search-result-box"
      className="absolute top-full left-0 z-40 mt-2 w-full overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-outline-outline-variant bg-surface-surface shadow-lg lg:max-h-[calc(100dvh_-_var(--sticky-header-height)_+_2rem)]"
    >
      {products.length > 0 ? (
        <ul
          aria-label={t("search.suggest.label")}
          inert={state.status === "loading"}
        >
          {products.map((product) => (
            <li key={product.id}>
              <SearchSuggestItem product={product} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      ) : null}
      <div
        className={cx(
          "flex h-11 items-center justify-center p-3 text-center text-sm transition-colors",
          products.length > 0 && "border-t border-outline-outline-variant",
          loading
            ? "bg-surface-surface-container text-surface-on-surface-variant"
            : "text-surface-on-surface",
        )}
      >
        <SuggestFooter term={term} state={state} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
