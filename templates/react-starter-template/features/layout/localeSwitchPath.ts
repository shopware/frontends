import { encodeForQuery } from "@shopware/api-client/helpers";
import { isTechnicalPath } from "@shopware/helpers";

import type { ApiClient, Schemas } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import { stripLocale, withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export type LocationParts = Pick<Location, "pathname" | "search" | "hash">;

export type LocaleSwitch = {
  locale: Locale;
  fromLanguageId: string;
  toLanguageId: string;
};

type SeoClient = Pick<ApiClient, "invoke">;

type SeoRoute = { routeName: string; foreignKey: string };

type SeoUrlFilter =
  | { type: "equals"; field: string; value: string }
  | { type: "equalsAny"; field: string; value: string[] };

const TECHNICAL_PREFIXES: Record<string, string> = {
  "frontend.navigation.page": "/navigation/",
  "frontend.detail.page": "/detail/",
  "frontend.landing.page": "/landingPage/",
};

const APP_ROUTE = /^\/(?:account|checkout)(?:\/|$)/;

export function pathForLocale(
  { pathname, search, hash }: LocationParts,
  locale: Locale,
): string {
  return `${withLocale(stripLocale(pathname).pathname, locale)}${search}${hash}`;
}

export function isCatalogPath(pathname: string): boolean {
  return (
    pathname !== "/" && !APP_ROUTE.test(pathname) && !isTechnicalPath(pathname)
  );
}

function decodePath(pathname: string): string {
  return pathname
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
}

async function readSeoUrl(
  client: SeoClient,
  languageId: string,
  filter: SeoUrlFilter[],
  signal?: AbortSignal,
): Promise<Schemas["SeoUrl"] | undefined> {
  const { data } = await client.invoke("readSeoUrlGet get /seo-url", {
    headers: { "sw-language-id": languageId },
    query: { _criteria: encodeForQuery({ filter, limit: 1 }) },
    fetchOptions: { timeout: READ_TIMEOUT_MS, signal },
  });
  return data.elements?.[0];
}

async function readRoute(
  client: SeoClient,
  pathname: string,
  languageId: string,
  signal?: AbortSignal,
): Promise<SeoRoute | null> {
  const seoPath = decodePath(pathname).replace(/^\/+/, "").replace(/\/+$/, "");
  const seoUrl = await readSeoUrl(
    client,
    languageId,
    [
      {
        type: "equalsAny",
        field: "seoPathInfo",
        value: [seoPath, `${seoPath}/`],
      },
    ],
    signal,
  );
  return seoUrl?.routeName && seoUrl.foreignKey
    ? { routeName: seoUrl.routeName, foreignKey: seoUrl.foreignKey }
    : null;
}

async function targetPath(
  client: SeoClient,
  route: SeoRoute,
  languageId: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const seoUrl = await readSeoUrl(
    client,
    languageId,
    [
      { type: "equals", field: "foreignKey", value: route.foreignKey },
      { type: "equals", field: "routeName", value: route.routeName },
    ],
    signal,
  );
  if (seoUrl?.seoPathInfo) return `/${seoUrl.seoPathInfo.replace(/^\/+/, "")}`;
  const prefix = TECHNICAL_PREFIXES[route.routeName];
  return prefix ? `${prefix}${route.foreignKey}` : null;
}

export async function resolveLocaleSwitchPath(
  getClient: () => Promise<SeoClient>,
  location: LocationParts,
  { locale, fromLanguageId, toLanguageId }: LocaleSwitch,
  signal?: AbortSignal,
): Promise<string> {
  const { pathname } = stripLocale(location.pathname);
  if (!isCatalogPath(pathname)) return pathForLocale(location, locale);
  try {
    const client = await getClient();
    const route = await readRoute(client, pathname, fromLanguageId, signal);
    if (!route) return pathForLocale(location, locale);
    const target = await targetPath(client, route, toLanguageId, signal);
    if (!target) return withLocale("/", locale);
    return `${withLocale(target, locale)}${location.search}${location.hash}`;
  } catch (error) {
    if (signal?.aborted) return pathForLocale(location, locale);
    console.error(
      "[MetaNavigation] resolving the page in the chosen language failed",
      error,
    );
    return withLocale("/", locale);
  }
}
