import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { loadAddressReferences } from "@/features/account/address/addressReferences";
import { AddressFormPageLayout } from "@/features/account/address/components/AddressFormPageLayout";
import { AddressFormSkeleton } from "@/features/account/address/components/AddressSkeletons";
import { NewAddressForm } from "@/features/account/address/components/NewAddressForm";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type NewAddressPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: NewAddressPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.address.new.header") };
}

async function NewAddressSection({ params }: NewAddressPageProps) {
  await connection();
  const references = await loadAddressReferences(
    await localeFromParams(params),
  );
  return <NewAddressForm {...references} />;
}

export default function NewAddressPage({ params }: NewAddressPageProps) {
  return (
    <AddressFormPageLayout variant="new">
      <Suspense fallback={<AddressFormSkeleton />}>
        <NewAddressSection params={params} />
      </Suspense>
    </AddressFormPageLayout>
  );
}
