import { NextResponse } from "next/server";

import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { createTranslator } from "@/i18n/translate";

export const MAINTENANCE_RETRY_AFTER_SECONDS = 300;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function maintenancePage(locale: Locale): string {
  const t = createTranslator(locale, getMessages(locale));
  const title = escapeHtml(t("errors.maintenance.title"));
  const message = escapeHtml(t("errors.maintenance.message"));
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><style>body{margin:0;font-family:system-ui,sans-serif;color:#0f2a2e;background:#f4f1ea}main{max-width:40rem;margin:6rem auto;padding:0 1rem;text-align:center}h1{font-size:3rem;margin:0 0 1rem}h2{font-size:1.25rem;font-weight:400;margin:0}</style></head><body><main><h1>503</h1><h2>${message}</h2></main></body></html>`;
}

export function maintenanceResponse(locale: Locale): NextResponse {
  return new NextResponse(maintenancePage(locale), {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": String(MAINTENANCE_RETRY_AFTER_SECONDS),
    },
  });
}
