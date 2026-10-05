import type { ReactNode } from "react";

import { CheckoutHeader } from "@/features/checkout/components/CheckoutHeader";

export default function CheckoutLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <CheckoutHeader />
      <main className="mb-20 flex-1" aria-label="Checkout">
        {children}
      </main>
    </div>
  );
}
