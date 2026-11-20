import type { Metadata } from "next";

import { AccountOverview } from "@/features/account/components/AccountOverview";
import { getTranslator, localeFromParams } from "@/i18n/server";

export const instant = false;

type AccountOverviewPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AccountOverviewPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.overview.header") };
}

export default function AccountOverviewPage() {
  return <AccountOverview />;
}
