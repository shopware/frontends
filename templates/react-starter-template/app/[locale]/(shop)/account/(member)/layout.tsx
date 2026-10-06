import type { ReactNode } from "react";

import { AccountShell } from "@/features/account/components/AccountShell";

export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AccountShell>{children}</AccountShell>;
}
