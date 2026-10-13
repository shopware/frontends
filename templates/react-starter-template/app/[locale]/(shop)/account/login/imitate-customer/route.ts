import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  CONTEXT_TOKEN_COOKIE,
  contextTokenCookieAttributes,
  contextTokenExpiry,
} from "@/features/session/contextTokenCookie";
import {
  imitateCustomer,
  parseImitationForm,
} from "@/features/session/imitateCustomer";
import { defaultLocale, isLocale, withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { createShopwareClient } from "@/platform/shopware/client";

type ImitateCustomerContext = {
  params: Promise<{ locale: string }>;
};

function seeOther(location: string): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: location, "Cache-Control": "no-store" },
  });
}

function isHttps(request: NextRequest): boolean {
  if (request.nextUrl.protocol === "https:") return true;
  const forwarded = request.headers.get("x-forwarded-proto") ?? "";
  return forwarded.split(",")[0]?.trim().toLowerCase() === "https";
}

async function readForm(request: NextRequest): Promise<FormData | null> {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: ImitateCustomerContext,
): Promise<NextResponse> {
  const { locale: param } = await params;
  const locale: Locale = isLocale(param) ? param : defaultLocale;

  const credentials = parseImitationForm(await readForm(request));
  const contextToken = credentials
    ? await imitateCustomer(createShopwareClient(), credentials)
    : null;
  if (!contextToken) return seeOther(withLocale("/", locale));

  const response = seeOther(withLocale("/account", locale));
  response.cookies.set({
    name: CONTEXT_TOKEN_COOKIE,
    value: contextToken,
    expires: contextTokenExpiry(),
    httpOnly: false,
    ...contextTokenCookieAttributes(isHttps(request)),
  });
  return response;
}
