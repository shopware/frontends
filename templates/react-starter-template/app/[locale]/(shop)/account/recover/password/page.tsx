import type { Metadata } from "next";

import { RecoveryPageLayout } from "@/features/account/recovery/components/RecoveryPageLayout";
import { ResetPasswordPageContent } from "@/features/account/recovery/components/ResetPasswordPageContent";
import { EMAIL_LINK_ROBOTS } from "@/features/emailLinks/metadata";
import { getTranslator, localeFromParams } from "@/i18n/server";

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ResetPasswordPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return {
    title: t("account.resetPassword.header"),
    robots: EMAIL_LINK_ROBOTS,
    referrer: "no-referrer",
  };
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const t = getTranslator(await localeFromParams(params));
  return (
    <RecoveryPageLayout title={t("account.resetPassword.header")}>
      <ResetPasswordPageContent />
    </RecoveryPageLayout>
  );
}
