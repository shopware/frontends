import type { Metadata } from "next";

import { RecoverPasswordForm } from "@/features/account/recovery/components/RecoverPasswordForm";
import { RecoveryPageLayout } from "@/features/account/recovery/components/RecoveryPageLayout";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { PRIVATE_PAGE_ROBOTS } from "@/platform/seo/robots";

type RecoverPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: RecoverPasswordPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return {
    title: t("account.recoverPassword.header"),
    robots: PRIVATE_PAGE_ROBOTS,
  };
}

export default async function RecoverPasswordPage({
  params,
}: RecoverPasswordPageProps) {
  const t = getTranslator(await localeFromParams(params));
  return (
    <RecoveryPageLayout title={t("account.recoverPassword.header")}>
      <RecoverPasswordForm />
    </RecoveryPageLayout>
  );
}
