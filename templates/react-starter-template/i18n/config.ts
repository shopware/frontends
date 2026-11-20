export const locales = ["en-GB", "pl-PL", "de-DE"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en-GB";

export const localeNames: Record<Locale, string> = {
  "en-GB": "English",
  "pl-PL": "Polski",
  "de-DE": "Deutsch",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePrefix(locale: Locale): "" | Locale {
  return locale === defaultLocale ? "" : locale;
}

function firstSegment(path: string): string {
  return path.slice(1).split(/[/?#]/, 1)[0] ?? "";
}

function isInternalAbsolutePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function withLocale(path: string, locale: Locale): string {
  const prefix = localePrefix(locale);
  if (!prefix || !isInternalAbsolutePath(path)) return path;
  if (isLocale(firstSegment(path))) return path;
  const rest = path.slice(1);
  if (rest === "" || rest.startsWith("?") || rest.startsWith("#")) {
    return `/${prefix}${rest}`;
  }
  return `/${prefix}${path}`;
}

export function stripLocale(pathname: string): {
  locale: Locale;
  pathname: string;
} {
  const segment = firstSegment(pathname);
  if (!isInternalAbsolutePath(pathname) || !isLocale(segment)) {
    return { locale: defaultLocale, pathname };
  }
  const rest = pathname.slice(segment.length + 1);
  return {
    locale: segment,
    pathname: rest.startsWith("/") ? rest : `/${rest}`,
  };
}
