import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { buildNavigationTree } from "@/features/navigation/navigationTree";
import { readNavigation } from "@/platform/shopware/reads/navigation";

import { FooterColumns } from "./FooterColumns";
import { NewsletterBox } from "./NewsletterBox";

async function FooterNavigation() {
  await connection();

  const categories = await readNavigation("footer-navigation", 1).catch(
    (error: unknown) => {
      console.error("[Footer] reading the footer navigation failed", error);
      return [];
    },
  );

  return <FooterColumns tree={buildNavigationTree(categories)} />;
}

export function Footer() {
  return (
    <footer className="bg-brand-primary">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Link href="/" className="mb-4 md:mb-0">
            <img
              src="/logo-white.svg"
              alt="Shopware Frontends Demo Store"
              className="h-16 w-auto sm:h-20"
              width={93}
              height={39}
            />
          </Link>
          <Suspense fallback={null}>
            <FooterNavigation />
          </Suspense>
          <NewsletterBox className="col-span-1 sm:col-span-2 md:col-span-1" />
        </div>
      </div>
    </footer>
  );
}
