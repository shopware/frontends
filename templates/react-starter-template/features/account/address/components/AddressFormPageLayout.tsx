"use client";

import type { ReactNode } from "react";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { useTranslations } from "@/i18n/I18nProvider";

const COPY = {
  new: {
    header: "account.address.new.header",
    subHeader: "account.address.new.subHeader",
    personalDataSectionHeader: "account.address.new.personalDataSectionHeader",
  },
  edit: {
    header: "account.address.edit.header",
    subHeader: "account.address.edit.subHeader",
    personalDataSectionHeader: "account.address.edit.personalDataSectionHeader",
  },
} as const;

export type AddressFormPageVariant = keyof typeof COPY;

export function AddressFormPageLayout({
  variant,
  children,
}: {
  variant: AddressFormPageVariant;
  children: ReactNode;
}) {
  const t = useTranslations();
  const copy = COPY[variant];
  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={t(copy.header)}
        subtitle={t(copy.subHeader)}
      />
      <div className="mb-10">
        <AccountSectionHeader
          className="mb-4"
          title={t(copy.personalDataSectionHeader)}
        />
        {children}
      </div>
    </div>
  );
}
