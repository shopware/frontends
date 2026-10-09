import { connection } from "next/server";
import { Suspense, cache } from "react";

import { HeaderBar } from "@/features/layout/components/HeaderBar";
import { HEADER_ACTION_CLASS } from "@/features/layout/headerAction";
import {
  MobileMenu,
  MobileMenuPending,
} from "@/features/navigation/components/MobileMenu";
import {
  TopNavigation,
  TopNavigationPlaceholder,
} from "@/features/navigation/components/TopNavigation";
import { buildNavigationTree } from "@/features/navigation/navigationTree";
import { readNavigation } from "@/platform/shopware/reads/navigation";

const loadMainNavigation = cache(async () => {
  await connection();

  const categories = await readNavigation("main-navigation", 2).catch(
    (error: unknown) => {
      console.error("[Header] reading the main navigation failed", error);
      return [];
    },
  );

  return buildNavigationTree(categories);
});

export function Header() {
  return (
    <header className="bg-surface-surface">
      <div className="border-b border-outline-outline-variant">
        <HeaderBar
          menu={
            <Suspense
              fallback={<MobileMenuPending className={HEADER_ACTION_CLASS} />}
            >
              <HeaderMobileMenu />
            </Suspense>
          }
        />
      </div>
      <div className="max-lg:hidden">
        <Suspense fallback={<TopNavigationPlaceholder />}>
          <HeaderTopNavigation />
        </Suspense>
      </div>
    </header>
  );
}

async function HeaderMobileMenu() {
  const tree = await loadMainNavigation();

  return <MobileMenu tree={tree} className={HEADER_ACTION_CLASS} />;
}

async function HeaderTopNavigation() {
  const tree = await loadMainNavigation();

  return <TopNavigation tree={tree} />;
}
