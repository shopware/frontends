"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { CartTotals } from "@/features/cart/components/CartTotals";
import { CheckoutProductTile } from "@/features/cart/components/CheckoutProductTile";
import { PromotionCodeForm } from "@/features/cart/components/PromotionCodeForm";
import { useLineItemActions } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";
import { useTranslations } from "@/i18n/I18nProvider";

export function SummaryBox({ className }: { className?: string }) {
  const { lineItems } = useCart();
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

        <CartTotals />
        <PromotionCodeForm
          id="checkout-promotion-code"
          className="mt-6 border-t border-outline-outline-variant pt-4"
        />
      </div>
    </section>
  );
}
