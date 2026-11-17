export type PriceFormatOptions = {
  locale: string;
  currencyCode: string;
};

export function formatPrice(
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
    }).format(amount);
  } catch {
    return amount.toFixed(2);
  }
}
