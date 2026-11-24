"use client";

import { useState } from "react";

import { BaseButton } from "@/cms/client";
import { useTranslations } from "@/i18n/I18nProvider";

export function CustomerUnavailable({
  onRetry,
  retryTestId,
}: {
  onRetry: () => Promise<void>;
  retryTestId?: string;
}) {
  const t = useTranslations();
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    if (retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <p role="alert" className="text-sm text-states-error">
        {t("errors.message-default")}
      </p>
      <BaseButton
        variant="secondary"
        size="small"
        data-testid={retryTestId}
        aria-busy={retrying}
        aria-disabled={retrying || undefined}
        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        onClick={() => {
          void retry();
        }}
      >
        {t("listing.retry")}
      </BaseButton>
    </div>
  );
}
