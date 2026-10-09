import type { Metadata } from "next";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { BackToProfileLink } from "@/features/account/profile/components/BackToProfileLink";
import { ChangePasswordForm } from "@/features/account/profile/components/ChangePasswordForm";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type ChangePasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ChangePasswordPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.changePassword.header") };
}

export default async function ChangePasswordPage({
  params,
}: ChangePasswordPageProps) {
  const t = getTranslator(await localeFromParams(params));
  return (
    <div className="mb-10">
      <BackToProfileLink />
      <AccountPageHeader
        className="mb-14"
        title={t("account.changePassword.header")}
      />
      <AccountSectionHeader
        className="mb-8"
        title={t("account.changePassword.subHeader")}
      />
      <ChangePasswordForm />
    </div>
  );
}
