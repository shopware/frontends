import type { Metadata } from "next";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { BackToProfileLink } from "@/features/account/profile/components/BackToProfileLink";
import { ChangeEmailForm } from "@/features/account/profile/components/ChangeEmailForm";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type ChangeEmailPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ChangeEmailPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.changeEmail.header") };
}

export default async function ChangeEmailPage({
  params,
}: ChangeEmailPageProps) {
  const t = getTranslator(await localeFromParams(params));
  return (
    <div className="mb-10">
      <BackToProfileLink />
      <AccountPageHeader
        className="mb-14"
        title={t("account.changeEmail.header")}
      />
      <AccountSectionHeader
        className="mb-8"
        title={t("account.changeEmail.subHeader")}
      />
      <ChangeEmailForm />
    </div>
  );
}
