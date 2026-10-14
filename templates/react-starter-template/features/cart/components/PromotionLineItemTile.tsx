"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useId } from "react";

import type { Schemas } from "#shopware";
import { TagIcon } from "@/components/icons";
import { Price } from "@/components/Price";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useTranslations } from "@/i18n/I18nProvider";

export type PromotionLineItemTileProps = {
  item: Schemas["LineItem"];
  onRemove: (id: string) => void;
  className?: string;
};

export function PromotionLineItemTile({
  item,
  onRemove,
  className,
}: PromotionLineItemTileProps) {
  const t = useTranslations();
  const contentLang = useContentLang();
  const labelId = useId();

  return (
    <div
      className={cx("flex gap-4", className)}
      data-testid="checkout-product-tile-item"
      data-product-id={item.referencedId}
      data-line-item-type="promotion"
    >
      <div className="flex size-24 shrink-0 items-center justify-center bg-surface-surface-container sm:size-37.5">
        <TagIcon className="size-8 text-brand-primary" />
      </div>
      <div className="grid grow grid-cols-2 justify-between gap-y-2 py-2.5">
        <div
          id={labelId}
          data-testid="cart-promotion-name"
          className="text-surface-on-surface"
        >
          <span lang={contentLang}>{item.label}</span>
          <span className="ml-2 inline-block rounded-full bg-states-success-container px-2.5 py-0.5 text-xs font-medium text-states-on-success-container">
            {t("cart.promotion")}
          </span>
        </div>
        <Price
          data-testid="cart-promotion-price"
          className="ml-auto justify-start text-right text-surface-on-surface"
          value={item.price?.totalPrice}
        />
        <div className="col-span-2 content-end text-right">
          {item.removable ? (
            <button
              type="button"
              data-testid="promotion-remove-button"
              data-line-item-remove
              aria-describedby={labelId}
              className="inline-flex items-center gap-1 border-b border-brand-primary bg-transparent text-sm text-brand-primary hover:border-transparent"
              onClick={() => onRemove(item.id)}
            >
              {t("cart.remove")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
