import type { Metadata } from "next";

import { OrdersPageContent } from "@/features/account/orders/components/OrdersPageContent";

export const instant = false;

const t = {
  account: {
    order: {
      header: "Orders",
    },
  },
};

export const metadata: Metadata = {
  title: t.account.order.header,
};

export default function AccountOrdersPage() {
  return <OrdersPageContent />;
}
