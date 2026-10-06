import type { Metadata } from "next";
import Link from "next/link";

import { SECONDARY_BUTTON_CLASS } from "@/features/account/address/components/addressButtonClasses";
import { AddressesPageContent } from "@/features/account/address/components/AddressesPageContent";
import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";

export const instant = false;

const t = {
  account: {
    address: {
      header: "Addresses",
      subHeader: "View your current default addresses or add new ones.",
      addAddressButton: "Add new address",
    },
  },
};

export const metadata: Metadata = {
  title: t.account.address.header,
};

export default function AddressesPage() {
  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={t.account.address.header}
        subtitle={t.account.address.subHeader}
      />
      <Link
        href="/account/address/new"
        className={`mb-14 ${SECONDARY_BUTTON_CLASS}`}
      >
        + {t.account.address.addAddressButton}
      </Link>
      <AddressesPageContent />
    </div>
  );
}
