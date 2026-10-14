import type { Metadata } from "next";

import { NewsletterConfirmPageContent } from "@/features/emailLinks/components/NewsletterConfirmPageContent";
import { EMAIL_LINK_ROBOTS } from "@/features/emailLinks/metadata";
import { getTranslator, localeFromParams } from "@/i18n/server";

type NewsletterSubscribePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: NewsletterSubscribePageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return {
    title: t("newsletter.subscriptionHeader"),
    robots: EMAIL_LINK_ROBOTS,
  };
}

export default function NewsletterSubscribePage() {
  return <NewsletterConfirmPageContent />;
}
