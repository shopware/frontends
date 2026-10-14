import type { Metadata } from "next";

import { RegistrationConfirmPageContent } from "@/features/emailLinks/components/RegistrationConfirmPageContent";
import { EMAIL_LINK_ROBOTS } from "@/features/emailLinks/metadata";
import { getTranslator, localeFromParams } from "@/i18n/server";

type RegistrationConfirmPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: RegistrationConfirmPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return {
    title: t("account.registrationConfirm.title"),
    robots: EMAIL_LINK_ROBOTS,
  };
}

export default function RegistrationConfirmPage() {
  return <RegistrationConfirmPageContent />;
}
