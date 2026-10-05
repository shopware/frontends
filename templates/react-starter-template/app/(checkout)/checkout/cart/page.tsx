import type { Metadata } from "next";

import { CartPageContent } from "@/features/cart/components/CartPageContent";

export const metadata: Metadata = {
  title: "My cart",
};

export default function CartPage() {
  return <CartPageContent />;
}
