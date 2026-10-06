import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { loadAddressReferences } from "@/features/account/address/addressReferences";
import { AddressFormSkeleton } from "@/features/account/address/components/AddressSkeletons";
import { EditAddressContent } from "@/features/account/address/components/EditAddressContent";
import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";

export const instant = false;

const t = {
  account: {
    address: {
      edit: {
        header: "Edit address",
        subHeader: "Edit your address.",
        personalDataSectionHeader: "Personal data",
      },
    },
  },
};

export const metadata: Metadata = {
  title: t.account.address.edit.header,
};

type EditAddressPageProps = {
  params: Promise<{ id: string }>;
};

async function EditAddressSection({ params }: EditAddressPageProps) {
  await connection();
  const references = await loadAddressReferences();
  return <EditAddressContent params={params} {...references} />;
}

export default function EditAddressPage({ params }: EditAddressPageProps) {
  const copy = t.account.address.edit;
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
          <EditAddressSection params={params} />
        </Suspense>
      </div>
    </div>
  );
}
