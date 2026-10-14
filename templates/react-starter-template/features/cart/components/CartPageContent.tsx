"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { useState } from "react";

import { LocaleLink } from "@/components/LocaleLink";
import { CartTotals } from "@/features/cart/components/CartTotals";
import { CheckoutProductTile } from "@/features/cart/components/CheckoutProductTile";
import { PromotionCodeForm } from "@/features/cart/components/PromotionCodeForm";
import { useCartLoadNotices } from "@/features/cart/components/useCartLoadNotices";
import { useLineItemActions } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";
import { useTranslations } from "@/i18n/I18nProvider";

const PRIMARY_LINK_CLASS =
  "rounded-md bg-brand-primary px-4 py-3 text-center leading-6 font-bold text-brand-on-primary hover:bg-brand-primary-hover";

export function CartPageContent() {
  const { status, cart, lineItems, isEmpty, refresh } = useCart();
  const { remove, updateQuantity } = useLineItemActions();
  useCartLoadNotices();
  const t = useTranslations();
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    setRetrying(true);
    try {
      await refresh();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <h1 className="my-10 font-serif text-[40px]">{t("cart.title")}</h1>
      {status === "loading" ? (
        <CartPageSkeleton />
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20">
          {status === "error" && !cart ? (
            <>
              <p
                role="alert"
                className="mb-6 max-w-xl text-center text-lg text-surface-on-surface"
              >
                {t("errors.message-default")}
              </p>
              <BaseButton
                variant="secondary"
                className="mb-4"
                disabled={retrying}
                aria-busy={retrying || undefined}
                onClick={() => {
                  void retry();
                }}
              >
                {t("listing.retry")}
              </BaseButton>
            </>
          ) : (
            <p className="mb-6 text-lg text-surface-on-surface">
              {t("cart.emptyCartLabel")}
            </p>
          )}
          <LocaleLink href="/" className={PRIMARY_LINK_CLASS}>
            {t("cart.continueShopping")}
          </LocaleLink>
        </div>
      ) : (
        <>
          <ul className="mb-10">
            {lineItems.map((item) => (
              <li
                key={item.id}
                className="flex border-b border-outline-outline-variant py-6"
              >
                <CheckoutProductTile
                  item={item}
                  className="w-full"
                  onRemove={(id) => {
                    void remove(id);
                  }}
                  onChangeQuantity={updateQuantity}
                />
              </li>
            ))}
          </ul>
          <section
            aria-labelledby="cart-summary-heading"
            className="mb-20 ml-auto w-full max-w-md"
          >
            <h2
              id="cart-summary-heading"
              className="mb-4 text-xl font-semibold text-surface-on-surface"
            >
              {t("checkout.summary")}
            </h2>
            <CartTotals withShippingMethod withShippingEstimate />
            <PromotionCodeForm id="cart-promotion-code" className="mt-6" />
            <LocaleLink
              href="/checkout"
              className={`${PRIMARY_LINK_CLASS} mt-6 block`}
            >
              {t("cart.proceedToCheckout")}
            </LocaleLink>
          </section>
        </>
      )}
    </div>
  );
}

function CartPageSkeleton() {
  return (
    <div aria-busy="true" data-testid="cart-page-skeleton" className="mb-10">
      {[0, 1].map((row) => (
        <div
          key={row}
          className="flex animate-pulse gap-4 border-b border-outline-outline-variant py-6"
        >
          <div className="size-24 shrink-0 bg-surface-surface-container sm:size-37.5" />
          <div className="flex grow flex-col gap-3 py-2.5">
            <div className="h-5 w-2/3 rounded-sm bg-surface-surface-container" />
            <div className="h-5 w-1/4 rounded-sm bg-surface-surface-container" />
          </div>
        </div>
      ))}
    </div>
  );
}
