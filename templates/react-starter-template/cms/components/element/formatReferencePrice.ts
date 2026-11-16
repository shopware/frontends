import type { PriceFormatOptions } from "../../helpers/formatPrice";

export function formatReferencePrice(
  value: number | string | undefined | null,
  options: PriceFormatOptions,
): string {
  if (value === undefined || value === null) return "";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  try {
    return new Intl.NumberFormat(options.locale, {
      style: "currency",
      currency: options.currencyCode,
      maximumFractionDigits: 4,
    }).format(amount);
  } catch {
    return String(amount);
  }
}
