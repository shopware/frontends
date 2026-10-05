import { PaymentResult } from "./PaymentResult";

export function orderDetailsHref(orderId: string): string {
  return `/checkout/success/${encodeURIComponent(orderId)}`;
}

export async function UnpaidPaymentResult({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PaymentResult status="unpaid" href={orderDetailsHref(id)} />;
}
