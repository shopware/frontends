import type { Translate } from "@/i18n/translate";

export type PaymentResultStatus = "paid" | "unpaid";

export function paymentResultTitle(
  status: PaymentResultStatus,
  t: Translate,
): string {
  const result = t(
    status === "paid" ? "checkout.orderPaid" : "checkout.orderUnpaid",
  );
  return `${t("checkout.yourOrder")} ${result}`;
}
