"use client";

import { useId } from "react";

import type { Schemas } from "#shopware";
import type { Locale } from "@/i18n/config";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";

import { DownloadIcon } from "./OrderIcons";

const documentDateFormats = new Map<Locale, Intl.DateTimeFormat>();

function documentDateFormat(locale: Locale): Intl.DateTimeFormat {
  let format = documentDateFormats.get(locale);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    documentDateFormats.set(locale, format);
  }
  return format;
}

export function formatDocumentDate(
  document: Schemas["Document"],
  locale: Locale,
): string {
  const value = document.updatedAt ?? document.createdAt;
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : documentDateFormat(locale).format(date);
}

export type OrderDocumentsProps = {
  documents: Schemas["Document"][];
  onDownload: (document: Schemas["Document"]) => void;
  className?: string;
};

export function OrderDocuments({
  documents,
  onDownload,
  className,
}: OrderDocumentsProps) {
  const headingId = useId();
  const t = useTranslations();
  const locale = useLocale();
  if (documents.length === 0) return null;
  return (
    <section className={className} aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="mb-3 leading-normal font-bold text-surface-on-surface"
      >
        {t("account.documentsLabel")}
      </h3>
      <ul className="flex flex-col gap-2">
        {documents.map((document) => {
          const date = formatDocumentDate(document, locale);
          return (
            <li key={document.id}>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 border-b border-brand-primary text-left text-brand-primary transition-all duration-200 hover:border-transparent"
                data-testid="order-document-download"
                onClick={() => onDownload(document)}
              >
                <DownloadIcon className="size-4" />
                {document.config.title || document.config.name}
                {date ? (
                  <span className="text-surface-on-surface-variant">
                    ({date})
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
