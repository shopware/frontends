"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef } from "react";
import type { RefObject } from "react";

import { CloseIcon } from "@/components/icons";
import { LocaleLink } from "@/components/LocaleLink";
import { Price } from "@/components/Price";
import { CheckoutProductTile } from "@/features/cart/components/CheckoutProductTile";
import { useLineItemActions } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";
import {
  SHELL_BUTTON_PRIMARY_CLASS,
  SHELL_BUTTON_SECONDARY_CLASS,
} from "@/features/layout/shellButton";
import { useTranslations } from "@/i18n/I18nProvider";

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
  const t = useTranslations();
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
      className={cx(
        "z-40 flex w-full max-w-[500px] flex-col rounded-lg shadow-xl lg:max-h-[calc(100dvh_-_var(--sticky-header-height)_+_2rem)]",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between rounded-t-lg border border-shell-line bg-shell-sand px-6 py-3">
        <h2
          id={titleId}
          className="text-xl leading-8 font-semibold text-shell-ink"
        >
          {t("cart.miniCart.title")}
        </h2>
        <button
          type="button"
          className="rounded-full p-2 text-shell-ink transition-colors hover:bg-shell-sand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-ink"
          data-testid="mini-cart-close-button"
          aria-label={t("cart.miniCart.close")}
          onClick={() => {
            triggerRef?.current?.focus();
            onClose();
          }}
        >
          <CloseIcon className="size-3" />
        </button>
      </div>
      <ul className="max-h-[365px] min-h-0 divide-y divide-shell-line overflow-y-auto overscroll-contain border border-t-0 border-shell-line bg-surface-surface px-6 py-3">
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
      <div className="shrink-0 rounded-b-lg border border-t-0 border-shell-line bg-surface-surface px-6 pt-3 pb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-surface-on-surface">
            {t("cart.miniCart.subtotal")}
          </span>
          <Price
            className="leading-6 font-bold text-surface-on-surface"
            value={subtotal}
          />
        </div>
        <p className="mb-6 text-right leading-6 text-surface-on-surface-variant">
          {t("cart.miniCart.taxEstimation")}
        </p>
        <LocaleLink
          href="/checkout"
          data-testid="checkout-cart-link"
          className={cx(
            SHELL_BUTTON_PRIMARY_CLASS,
            "mb-2 block py-2.5 text-center leading-6",
          )}
        >
          {t("cart.miniCart.proceedToCheckout")}
        </LocaleLink>
        <LocaleLink
          href="/checkout/cart"
          className={cx(
            SHELL_BUTTON_SECONDARY_CLASS,
            "block py-2.5 text-center leading-6",
          )}
        >
          {t("cart.miniCart.goToShoppingCart")}
        </LocaleLink>
      </div>
    </section>
  );
}
