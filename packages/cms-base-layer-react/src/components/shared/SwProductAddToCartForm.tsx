"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { BaseButton } from "../ui/BaseButton";
import { notifyCartErrors } from "./cartNotifications";
import { SwQuantitySelect } from "./SwQuantitySelect";

export type SwProductAddToCartFormProps = {
  productId: string;
  productName: string;
  productNumber: string;
  available: boolean;
  minPurchase?: number;
  maxPurchase?: number;
  purchaseSteps?: number;
  translations?: CmsTranslations;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  product: {
    addedToCart: "has been added to cart.",
    viewCart: "View cart",
    qty: "Qty",
    addToCart: "Add to cart",
    productNumber: "Product number",
  },
  errors: {
    "product-stock-reached":
      "The product {name} is only available {quantity} times",
  },
};

export function SwProductAddToCartForm({
  productId,
  productName,
  productNumber,
  available,
  minPurchase,
  maxPurchase,
  purchaseSteps,
  translations: translationsInput,
  children,
  className,
  style,
}: SwProductAddToCartFormProps) {
  const translations = withTranslationDefaults(
    translationsInput,
    translationDefaults,
  );
  const actions = useCmsActions();
  const [quantity, setQuantity] = useState(1);

  async function addToCart() {
    try {
      const result = await actions.addToCart({ productId, quantity });
      setQuantity(1);
      const hasCartErrors = notifyCartErrors(
        actions,
        result.errors,
        translations.errors,
      );
      if (hasCartErrors) return;
      if (!result.ok) {
        if (result.message) {
          actions.notify({ type: "error", message: result.message });
        }
        return;
      }
      actions.notify({
        type: "success",
        message: `${productName} ${translations.product.addedToCart}`,
        action: {
          label: translations.product.viewCart,
          href: "/checkout/cart",
        },
      });
    } catch (error) {
      actions.notify({
        type: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <div
      className={cx(
        "w-full inline-flex flex-col justify-start items-start gap-8",
        className,
      )}
      style={style}
    >
      <SwQuantitySelect
        value={quantity}
        onChange={setQuantity}
        min={minPurchase}
        max={maxPurchase}
        steps={purchaseSteps}
        translations={translationsInput}
      />
      {children}
      <div className="self-stretch flex flex-col justify-start items-start gap-1">
        <BaseButton
          variant="primary"
          size="medium"
          disabled={!available}
          block
          data-testid="add-to-cart-button"
          data-product-id={productId}
          onClick={() => {
            void addToCart();
          }}
        >
          {translations.product.addToCart}
        </BaseButton>
        <div className="self-stretch text-surface-on-surface text-xs font-normal leading-none">
          {translations.product.productNumber}: {productNumber}
        </div>
      </div>
    </div>
  );
}
