import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { loadAddressReferences } from "@/features/account/address/addressReferences";
import { AddressFormPageLayout } from "@/features/account/address/components/AddressFormPageLayout";
import { AddressFormSkeleton } from "@/features/account/address/components/AddressSkeletons";
import { EditAddressContent } from "@/features/account/address/components/EditAddressContent";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type EditAddressPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: EditAddressPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.address.edit.header") };
}

async function EditAddressSection({ params }: EditAddressPageProps) {
  await connection();
  const references = await loadAddressReferences(
    await localeFromParams(params),
  );
  return <EditAddressContent params={params} {...references} />;
}

export default function EditAddressPage({ params }: EditAddressPageProps) {
  return (
    <AddressFormPageLayout variant="edit">
      <Suspense fallback={<AddressFormSkeleton />}>
        <EditAddressSection params={params} />
      </Suspense>
    </AddressFormPageLayout>
  );
}
