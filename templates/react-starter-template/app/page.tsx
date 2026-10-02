import { Suspense } from "react";

import { MainCategories } from "@/features/navigation/components/MainCategories";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-semibold text-brand-primary">
        Shopware Frontends
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        React starter template
      </h1>
      <p className="text-lg text-surface-on-surface-variant">
        A Next.js App Router storefront for Shopware 6. This is the skeleton:
        routing, the session and CMS rendering follow in the next stages.
      </p>
      <section
        aria-labelledby="main-categories"
        className="flex flex-col gap-3"
      >
        <h2
          id="main-categories"
          className="text-sm font-semibold text-surface-on-surface-variant"
        >
          Main navigation from the Store API
        </h2>
        <Suspense
          fallback={
            <p className="text-sm text-surface-on-surface-variant">
              Loading categories…
            </p>
          }
        >
          <MainCategories />
        </Suspense>
      </section>
    </main>
  );
}
