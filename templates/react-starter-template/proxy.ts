import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { defaultLocale, isLocale, withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { WaitUntil } from "@/platform/routing/maintenance";
import { maintenanceResponse } from "@/platform/routing/maintenancePage";
import { isAppRoute } from "@/platform/routing/paths";
import {
  maintenanceMonitor,
  resolveProxyLanguageId,
  seoResolver,
} from "@/platform/routing/shopwareRouting";

export const INTERNAL_NOT_FOUND_PATH = "/sw/not-found";
export const NOT_FOUND_CACHE_CONTROL = "public, max-age=0, s-maxage=60";
export const REDIRECT_CACHE_CONTROL = "public, max-age=300, s-maxage=300";

const STATIC_FILE =
  /\.(?:ico|png|jpe?g|gif|svg|webp|avif|txt|xml|webmanifest|json|js|css|map|woff2?|ttf|otf)$/;

function isSkipped(pathname: string): boolean {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname === "/_next" ||
    pathname.startsWith("/_next/") ||
    STATIC_FILE.test(pathname)
  );
}

function rewriteTo(request: NextRequest, pathname: string, search?: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  if (search !== undefined) url.search = search;
  return NextResponse.rewrite(url);
}

function withCacheControl(response: NextResponse, value: string): NextResponse {
  response.headers.set("Cache-Control", value);
  return response;
}

export async function proxy(
  request: NextRequest,
  event?: NextFetchEvent,
): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  if (isSkipped(pathname)) return NextResponse.next();

  const segment = pathname.split("/")[1] ?? "";

  if (segment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const prefixed = isLocale(segment);
  const locale: Locale = prefixed ? segment : defaultLocale;
  const rest = prefixed ? pathname.slice(segment.length + 1) || "/" : pathname;
  const waitUntil: WaitUntil | undefined = event
    ? (promise) => event.waitUntil(promise)
    : undefined;

  if (await maintenanceMonitor.isActive(waitUntil)) {
    return maintenanceResponse(locale);
  }

  const render = () =>
    prefixed
      ? NextResponse.next()
      : rewriteTo(
          request,
          pathname === "/"
            ? `/${defaultLocale}`
            : `/${defaultLocale}${pathname}`,
        );

  if (rest === "/" || isAppRoute(rest)) return render();

  const language = await resolveProxyLanguageId(locale);
  if (language.status === "unavailable") return render();
  const resolution = await seoResolver.resolve(rest, language.languageId, {
    waitUntil,
  });

  switch (resolution.type) {
    case "maintenance":
      return maintenanceResponse(locale);
    case "redirect": {
      const target = new URL(
        `${withLocale(resolution.path, locale)}${search}`,
        request.url,
      );
      if (target.origin !== request.nextUrl.origin) return render();
      return withCacheControl(
        NextResponse.redirect(target, 301),
        REDIRECT_CACHE_CONTROL,
      );
    }
    case "not-found":
      return withCacheControl(
        rewriteTo(request, `/${locale}${INTERNAL_NOT_FOUND_PATH}`, ""),
        NOT_FOUND_CACHE_CONTROL,
      );
    default:
      return render();
  }
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next(?:/|$)|.*\\.(?:ico|png|jpe?g|gif|svg|webp|avif|txt|xml|webmanifest|json|js|css|map|woff2?|ttf|otf)$).*)",
  ],
};
