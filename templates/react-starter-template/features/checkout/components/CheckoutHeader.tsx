import Link from "next/link";

const t = {
  "cart.continueShopping": "Continue Shopping",
  logo: "Shopware Frontends Demo Store",
};

export function CheckoutHeader() {
  return (
    <header className="border-b border-outline-outline-variant bg-surface-surface">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4">
        <div className="py-3.5">
          <Link href="/">
            <img
              src="/logo.svg"
              alt={t.logo}
              width={93}
              height={39}
              className="h-20 w-auto max-sm:h-10"
            />
          </Link>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-sm bg-surface-surface px-4 py-3 leading-6 font-bold text-brand-primary outline-2 -outline-offset-2 outline-brand-primary outline-solid"
        >
          {t["cart.continueShopping"]}
        </Link>
      </div>
    </header>
  );
}
