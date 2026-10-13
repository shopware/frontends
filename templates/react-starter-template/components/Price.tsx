"use client";

import { formatPrice } from "@shopware/cms-base-layer-react/client";

import { useSession } from "@/features/session/components/SessionProvider";
import { useLocale } from "@/i18n/I18nProvider";

const DEFAULT_CURRENCY = "EUR";

export type PriceProps = {
  value: number | null | undefined;
  currencyCode?: string | null;
  className?: string;
  "data-testid"?: string;
};

export function Price({
  value,
  currencyCode,
  className,
  "data-testid": testId,
}: PriceProps) {
  const { context } = useSession();
  const locale = useLocale();
  if (value === null || value === undefined) return null;
  return (
    <span className={className} data-testid={testId}>
      {formatPrice(value, {
        locale,
        currencyCode:
          currencyCode ?? context?.currency?.isoCode ?? DEFAULT_CURRENCY,
      })}
    </span>
  );
}
