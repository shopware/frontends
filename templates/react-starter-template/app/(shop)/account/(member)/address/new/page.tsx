import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { loadAddressReferences } from "@/features/account/address/addressReferences";
import { AddressFormSkeleton } from "@/features/account/address/components/AddressSkeletons";
import { NewAddressForm } from "@/features/account/address/components/NewAddressForm";
import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";

export const instant = false;

const t = {
  account: {
    address: {
      new: {
        header: "New address",
        subHeader: "Add a new address to your account.",
        personalDataSectionHeader: "Personal data",
      },
    },
  },
};

export const metadata: Metadata = {
  title: t.account.address.new.header,
};

async function NewAddressSection() {
  await connection();
  const references = await loadAddressReferences();
  return <NewAddressForm {...references} />;
}

export default function NewAddressPage() {
  const copy = t.account.address.new;
  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={copy.header}
        subtitle={copy.subHeader}
      />
      <div className="mb-10">
        <AccountSectionHeader
          className="mb-4"
          title={copy.personalDataSectionHeader}
        />
        <Suspense fallback={<AddressFormSkeleton />}>
          <NewAddressSection />
        </Suspense>
      </div>
    </div>
  );
}
