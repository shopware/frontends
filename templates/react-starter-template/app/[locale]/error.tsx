"use client";

import { useEffect } from "react";

import { useTranslations } from "@/i18n/I18nProvider";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-4 px-4 py-16"
    >
      <h1 className="text-2xl font-bold text-surface-on-surface">
        {t("messages.error")}
      </h1>
      <p className="text-surface-on-surface-variant">
        {t("errors.message-default")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-hover"
      >
        {t("listing.retry")}
      </button>
    </div>
  );
}
