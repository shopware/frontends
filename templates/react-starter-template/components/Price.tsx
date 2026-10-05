"use client";

import { formatPrice } from "@shopware/cms-base-layer-react/client";

import { useSession } from "@/features/session/components/SessionProvider";

const LOCALE = "en-GB";
const DEFAULT_CURRENCY = "EUR";

export type PriceProps = {
  value: number | null | undefined;
  className?: string;
  "data-testid"?: string;
};

export function Price({ value, className, "data-testid": testId }: PriceProps) {
  const { context } = useSession();
  if (value === null || value === undefined) return null;
  return (
    <span className={className} data-testid={testId}>
      {formatPrice(value, {
        locale: LOCALE,
        currencyCode: context?.currency?.isoCode ?? DEFAULT_CURRENCY,
      })}
    </span>
  );
}
