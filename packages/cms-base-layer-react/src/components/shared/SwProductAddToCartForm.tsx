"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { BaseButton } from "../ui/BaseButton";
import { SwQuantitySelect } from "./SwQuantitySelect";
import { useAddToCart } from "./useAddToCart";

export type SwProductAddToCartFormProps = {
  productId: string;
  productName: string;
  productNumber: string;
  available: boolean;
  minPurchase?: number;
  maxPurchase?: number;
  purchaseSteps?: number;
  cartLink: string;
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
  cartLink,
  translations: translationsInput,
  children,
  className,
  style,
}: SwProductAddToCartFormProps) {
  const translations = withTranslationDefaults(
    translationsInput,
    translationDefaults,
  );
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isAdding } = useAddToCart({
    productId,
    productName,
    cartLink,
    messages: {
      addedToCart: translations.product.addedToCart,
      viewCart: translations.product.viewCart,
      errors: translations.errors,
    },
  });

  async function handleAddToCart() {
    if (await addToCart(quantity)) setQuantity(1);
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
          loading={isAdding}
          block
          data-testid="add-to-cart-button"
          data-product-id={productId}
          onClick={() => {
            void handleAddToCart();
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
