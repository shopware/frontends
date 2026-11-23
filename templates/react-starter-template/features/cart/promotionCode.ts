import type { Schemas } from "#shopware";

export function normalizePromotionCode(input: string): string {
  return input.trim();
}

export function promotionLineItems(
  lineItems: Schemas["LineItem"][],
): Schemas["LineItem"][] {
  return lineItems.filter((item) => item.type === "promotion");
}

export function isPromotionCodeApplied(
  lineItems: Schemas["LineItem"][],
  code: string,
): boolean {
  const wanted = normalizePromotionCode(code).toLowerCase();
  if (!wanted) return false;
  return promotionLineItems(lineItems).some(
    (item) => item.referencedId?.toLowerCase() === wanted,
  );
}
