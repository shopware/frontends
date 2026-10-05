import type { ReactNode } from "react";

import { Footer } from "@/features/layout/components/Footer";
import { Header } from "@/features/layout/components/Header";

export default function ShopLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1" aria-label="Main content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
