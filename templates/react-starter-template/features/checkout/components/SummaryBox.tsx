"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { Price } from "@/components/Price";
import { CheckoutProductTile } from "@/features/cart/components/CheckoutProductTile";
import { useLineItemActions } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";
import { useTranslations } from "@/i18n/I18nProvider";

export function SummaryBox({ className }: { className?: string }) {
  const { lineItems, subtotal, totalPrice, shippingCosts } = useCart();
  const { remove, updateQuantity } = useLineItemActions();
  const t = useTranslations();

  function handleRemove(id: string) {
    void remove(id);
  }

  return (
    <section
      className={cx("sticky top-2 border border-outline-outline", className)}
      aria-labelledby="checkout-summary-heading"
    >
      <div className="border-b border-outline-outline-variant">
        <h2
          id="checkout-summary-heading"
          className="px-6 font-serif text-[40px] text-surface-on-surface"
        >
          {t("checkout.summary")}
        </h2>
      </div>
      <div className="p-6 pt-10">
        <ul className="divide-y divide-outline-outline-variant">
          {lineItems.map((item) => (
            <li key={item.id}>
              <CheckoutProductTile
                item={item}
                className="py-4"
                onRemove={handleRemove}
                onChangeQuantity={updateQuantity}
              />
            </li>
          ))}
        </ul>

        <dl className="flex flex-col gap-1 border-t border-outline-outline-variant py-4">
          <div className="flex justify-between">
            <dt className="text-sm font-normal text-surface-on-surface-variant">
              {t("checkout.subtotal")}
            </dt>
            <dd>
              <Price
                value={subtotal}
                className="text-sm font-normal text-surface-on-surface"
                data-testid="cart-subtotal"
              />
            </dd>
          </div>
          {shippingCosts.map((delivery, index) => (
            <div
              key={delivery.shippingMethod?.id ?? index}
              className="flex justify-between"
            >
              <dt className="text-sm font-normal text-surface-on-surface-variant">
                {t("checkout.shippingCosts")}
              </dt>
              <dd>
                <Price
                  value={delivery.shippingCosts?.totalPrice}
                  className="text-sm font-normal text-surface-on-surface"
                />
              </dd>
            </div>
          ))}
        </dl>
        <dl className="flex justify-between border-t border-outline-outline-variant pt-4">
          <dt className="text-base leading-normal font-normal text-surface-on-surface">
            {t("checkout.total")}
          </dt>
          <dd>
            <Price
              value={totalPrice}
              className="text-right text-base leading-normal font-normal text-surface-on-surface"
              data-testid="cart-total"
            />
          </dd>
        </dl>
      </div>
    </section>
  );
}
