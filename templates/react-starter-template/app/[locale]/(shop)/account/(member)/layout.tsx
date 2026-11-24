import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AccountShell } from "@/features/account/components/AccountShell";
import { PRIVATE_PAGE_ROBOTS } from "@/platform/seo/robots";

export const metadata: Metadata = { robots: PRIVATE_PAGE_ROBOTS };

export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AccountShell>{children}</AccountShell>;
}
