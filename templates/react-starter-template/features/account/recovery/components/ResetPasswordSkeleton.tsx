"use client";

import { useTranslations } from "@/i18n/I18nProvider";

const PLACEHOLDER = "rounded bg-surface-surface-container";

export function ResetPasswordSkeleton() {
  const t = useTranslations();
  return (
    <div
      aria-busy="true"
      data-testid="account-reset-password-skeleton"
      className="flex max-w-md animate-pulse flex-col gap-4 motion-reduce:animate-none"
    >
      <output className="sr-only">{t("form.loading")}</output>
      <div className={`h-5 w-64 ${PLACEHOLDER}`} />
      {[0, 1].map((field) => (
        <div key={field} className="flex flex-col gap-1">
          <div className={`h-5 w-48 ${PLACEHOLDER}`} />
          <div className={`h-12 w-full ${PLACEHOLDER}`} />
        </div>
      ))}
      <div className={`h-12 w-44 ${PLACEHOLDER}`} />
    </div>
  );
}
