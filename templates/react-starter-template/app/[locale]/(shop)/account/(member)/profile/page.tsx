import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { LoginData } from "@/features/account/profile/components/LoginData";
import { PersonalDataForm } from "@/features/account/profile/components/PersonalDataForm";
import { PersonalDataFormSkeleton } from "@/features/account/profile/components/PersonalDataFormSkeleton";
import { loadProfileReferences } from "@/features/account/profile/profileReferences";
import type { Locale } from "@/i18n/config";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.profile.header") };
}

async function PersonalDataSection({ locale }: { locale: Locale }) {
  await connection();
  const references = await loadProfileReferences(locale);
  return <PersonalDataForm {...references} />;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const locale = await localeFromParams(params);
  const t = getTranslator(locale);
  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={t("account.profile.header")}
        subtitle={t("account.profile.subHeader")}
      />
      <div className="mb-10">
        <AccountSectionHeader
          className="mb-4"
          title={t("account.profile.personalDataSectionHeader")}
        />
        <Suspense fallback={<PersonalDataFormSkeleton />}>
          <PersonalDataSection locale={locale} />
        </Suspense>
      </div>
      <div className="mb-10">
        <AccountSectionHeader
          className="mb-4"
          title={t("account.profile.loginDataSectionHeader")}
        />
        <LoginData />
      </div>
    </div>
  );
}
