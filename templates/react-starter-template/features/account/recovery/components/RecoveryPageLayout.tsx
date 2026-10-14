import type { ReactNode } from "react";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";

export function RecoveryPageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto my-10 w-full max-w-2xl px-4 sm:px-6 lg:my-16">
      <AccountPageHeader title={title} className="mb-6" />
      {children}
    </div>
  );
}
