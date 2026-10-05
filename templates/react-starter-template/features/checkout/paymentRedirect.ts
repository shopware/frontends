export const PAYMENT_REDIRECT_DELAY_MS = 5000;

const PAYMENT_PROTOCOLS = new Set(["http:", "https:"]);

export function parsePaymentUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    return PAYMENT_PROTOCOLS.has(new URL(value).protocol) ? value : null;
  } catch {
    return null;
  }
}

export function paymentReturnUrls(
  origin: string,
  orderId: string,
): { finishUrl: string; errorUrl: string } {
  const successPage = `${origin}/checkout/success/${encodeURIComponent(orderId)}`;
  return {
    finishUrl: `${successPage}/paid`,
    errorUrl: `${successPage}/unpaid`,
  };
}

export function redirectToPayment(url: string): void {
  window.location.assign(url);
}
