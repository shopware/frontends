import { connection } from "next/server";
import { Suspense } from "react";

import { NavigationPage } from "@/features/cms/components/NavigationPage";
import { PageSkeleton } from "@/features/cms/components/PageSkeleton";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";

async function HomeContent() {
  await connection();
  const context = await readSalesChannelContext();
  return (
    <NavigationPage
      navigationId={context.salesChannel.navigationCategoryId}
      searchParams={{}}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
