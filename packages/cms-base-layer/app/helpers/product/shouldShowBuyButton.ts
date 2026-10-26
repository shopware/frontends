export function shouldShowBuyButton(
  product: { childCount?: number } | undefined,
  displayFrom = false,
): boolean {
  return !displayFrom && (product?.childCount ?? 0) <= 0;
}
