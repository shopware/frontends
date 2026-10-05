"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import Link from "next/link";
import { useState } from "react";

import { Price } from "@/components/Price";
import { CheckoutProductTile } from "@/features/cart/components/CheckoutProductTile";
import { useLineItemActions } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";
import { errorMessages } from "@/features/session/errorMessages";

const t = {
  "cart.title": "My cart",
  "cart.emptyCartLabel": "Your cart is empty",
  "cart.proceedToCheckout": "Check out",
  "cart.continueShopping": "Continue Shopping",
  "cart.miniCart.subtotal": "Subtotal",
  "cart.miniCart.taxEstimation": "Taxes & shipping estimated at checkout.",
  "errors.message-default": errorMessages.errors["message-default"],
  "listing.retry": "Try again",
};

const PRIMARY_LINK_CLASS =
  "rounded-md bg-brand-primary px-4 py-3 text-center leading-6 font-bold text-brand-on-primary hover:bg-brand-primary-hover";

export function CartPageContent() {
  const { status, cart, lineItems, isEmpty, subtotal, refresh } = useCart();
  const { remove, updateQuantity } = useLineItemActions();
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
      <h1 className="my-10 font-serif text-[40px]">{t["cart.title"]}</h1>
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
                {t["errors.message-default"]}
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
                {t["listing.retry"]}
              </BaseButton>
            </>
          ) : (
            <p className="mb-6 text-lg text-surface-on-surface">
              {t["cart.emptyCartLabel"]}
            </p>
          )}
          <Link href="/" className={PRIMARY_LINK_CLASS}>
            {t["cart.continueShopping"]}
          </Link>
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
          <div className="mb-20 ml-auto block w-fit">
            <div className="mb-2 flex items-center justify-between gap-8">
              <span className="text-surface-on-surface">
                {t["cart.miniCart.subtotal"]}
              </span>
              <Price
                className="leading-6 font-bold text-surface-on-surface"
                value={subtotal}
              />
            </div>
            <p className="mb-6 text-right text-sm leading-6 text-surface-on-surface-variant">
              {t["cart.miniCart.taxEstimation"]}
            </p>
            <Link
              href="/checkout"
              className={`${PRIMARY_LINK_CLASS} mb-2 ml-auto block w-fit`}
            >
              {t["cart.proceedToCheckout"]}
            </Link>
          </div>
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
