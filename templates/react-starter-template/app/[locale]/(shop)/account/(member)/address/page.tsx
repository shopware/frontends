import type { Metadata } from "next";
import Link from "next/link";

import { SECONDARY_BUTTON_CLASS } from "@/features/account/address/components/addressButtonClasses";
import { AddressesPageContent } from "@/features/account/address/components/AddressesPageContent";
import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { withLocale } from "@/i18n/config";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type AddressesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AddressesPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.address.header") };
}

export default async function AddressesPage({ params }: AddressesPageProps) {
  const locale = await localeFromParams(params);
  const t = getTranslator(locale);
  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={t("account.address.header")}
        subtitle={t("account.address.subHeader")}
      />
      <Link
        href={withLocale("/account/address/new", locale)}
        className={`mb-14 ${SECONDARY_BUTTON_CLASS}`}
      >
        + {t("account.address.addAddressButton")}
      </Link>
      <AddressesPageContent />
    </div>
  );
}
