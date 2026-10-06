// Same rule as the Twig storefront product card.
export function shouldShowBuyButton(
  product: { childCount?: number } | undefined,
  fromPrice?: number,
): boolean {
  return !fromPrice && (product?.childCount ?? 0) <= 0;
}
