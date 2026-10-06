import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";

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

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (isSkipped(pathname)) return NextResponse.next();

  const segment = pathname.split("/")[1] ?? "";

  if (segment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(segment)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next(?:/|$)|.*\\.(?:ico|png|jpe?g|gif|svg|webp|avif|txt|xml|webmanifest|json|js|css|map|woff2?|ttf|otf)$).*)",
  ],
};
