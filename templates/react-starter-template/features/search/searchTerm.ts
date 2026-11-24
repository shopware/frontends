import { stripLocale } from "@/i18n/config";

export const SEARCH_MIN_LENGTH = 3;

export const SEARCH_TERM_MAX_LENGTH = 300;

export const SUGGEST_DEBOUNCE_MS = 300;

export const SUGGEST_LIMIT = 10;

export function normalizeSearchTerm(
  value: string | string[] | null | undefined,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  const collapsed = (raw ?? "").trim().replace(/\s+/g, " ");
  return Array.from(collapsed)
    .slice(0, SEARCH_TERM_MAX_LENGTH)
    .join("")
    .trimEnd();
}

export function isSearchable(term: string): boolean {
  return term.length >= SEARCH_MIN_LENGTH;
}

export function searchPath(term: string): string {
  return `/search?search=${encodeURIComponent(term)}`;
}

export function isSearchPagePath(pathname: string): boolean {
  const path = stripLocale(pathname).pathname;
  return path === "/search" || path === "/search/";
}

export function searchTermFromLocation({
  pathname,
  search,
}: Pick<Location, "pathname" | "search">): string {
  if (!isSearchPagePath(pathname)) return "";
  return normalizeSearchTerm(new URLSearchParams(search).get("search"));
}
