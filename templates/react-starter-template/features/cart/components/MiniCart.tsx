"use client";

import { IconButton, cx } from "@shopware/cms-base-layer-react/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef } from "react";
import type { RefObject } from "react";

import { CloseIcon } from "@/components/icons";
import { Price } from "@/components/Price";
import { CheckoutProductTile } from "@/features/cart/components/CheckoutProductTile";
import { useLineItemActions } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";

const t = {
  "cart.miniCart.title": "My cart",
  "cart.miniCart.subtotal": "Subtotal",
  "cart.miniCart.taxEstimation": "Taxes & shipping estimated at checkout.",
  "cart.miniCart.proceedToCheckout": "Proceed to checkout",
  "cart.miniCart.goToShoppingCart": "Go to shopping cart",
  close: "Close",
};

export type MiniCartProps = {
  id: string;
  onClose(): void;
  triggerRef?: RefObject<HTMLElement | null>;
  className?: string;
};

export function MiniCart({
  id,
  onClose,
  triggerRef,
  className,
}: MiniCartProps) {
  const { status, lineItems, subtotal } = useCart();
  const { remove, updateQuantity } = useLineItemActions();
  const pathname = usePathname();
  const openedAt = useRef(pathname);
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const isEmpty = status !== "loading" && lineItems.length === 0;

  const isInside = useCallback(
    (target: EventTarget | null) =>
      target instanceof Node &&
      Boolean(
        panelRef.current?.contains(target) ||
        triggerRef?.current?.contains(target),
      ),
    [triggerRef],
  );

  const returnFocus = useCallback(() => {
    const active = document.activeElement;
    if (!active || active === document.body || isInside(active)) {
      triggerRef?.current?.focus();
    }
  }, [isInside, triggerRef]);

  useEffect(() => {
    if (pathname !== openedAt.current) onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!isEmpty) return;
    returnFocus();
    onClose();
  }, [isEmpty, returnFocus, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      returnFocus();
      onClose();
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!isInside(event.target)) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isInside, returnFocus, onClose]);

  return (
    <section
      ref={panelRef}
      id={id}
      data-testid="mini-cart-container"
      aria-labelledby={titleId}
      className={cx("z-40 w-full max-w-[500px]", className)}
    >
      <div className="flex items-center justify-between border border-outline-outline-variant bg-surface-surface px-6 pt-4 pb-3">
        <h2
          id={titleId}
          className="font-serif text-2xl leading-9 font-normal text-surface-on-surface"
        >
          {t["cart.miniCart.title"]}
        </h2>
        <IconButton
          variant="ghost"
          className="rounded-full p-2"
          data-testid="mini-cart-close-button"
          aria-label={t.close}
          onClick={() => {
            triggerRef?.current?.focus();
            onClose();
          }}
        >
          <CloseIcon className="size-3" />
        </IconButton>
      </div>
      <ul className="max-h-[365px] divide-y divide-outline-outline-variant overflow-y-auto border border-t-0 border-outline-outline-variant bg-surface-surface px-6 py-3">
        {lineItems.map((item) => (
          <li key={item.id} className="py-8 first:pt-3">
            <CheckoutProductTile
              item={item}
              onRemove={(lineItemId) => {
                void remove(lineItemId);
              }}
              onChangeQuantity={updateQuantity}
            />
          </li>
        ))}
      </ul>
      <div className="border border-t-0 border-outline-outline-variant bg-surface-surface-container-low px-6 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-surface-on-surface">
            {t["cart.miniCart.subtotal"]}
          </span>
          <Price
            className="leading-6 font-bold text-surface-on-surface"
            value={subtotal}
          />
        </div>
        <p className="mb-6 text-right leading-6 text-surface-on-surface-variant">
          {t["cart.miniCart.taxEstimation"]}
        </p>
        <Link
          href="/checkout"
          data-testid="checkout-cart-link"
          className="mb-2 block rounded-md bg-brand-primary py-1.5 text-center leading-6 font-bold text-brand-on-primary hover:bg-brand-primary-hover"
        >
          {t["cart.miniCart.proceedToCheckout"]}
        </Link>
        <Link
          href="/checkout/cart"
          className="block rounded-md bg-brand-secondary py-1.5 text-center leading-6 font-bold text-brand-on-secondary hover:bg-brand-secondary-hover"
        >
          {t["cart.miniCart.goToShoppingCart"]}
        </Link>
      </div>
    </section>
  );
}
