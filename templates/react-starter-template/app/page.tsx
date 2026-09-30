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
        the data layer, routing and CMS rendering follow in the next stages.
      </p>
    </main>
  );
}
