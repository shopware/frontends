"use client";

import { SwQuantitySelect, cx } from "@shopware/cms-base-layer-react/client";
import type { CmsTranslations } from "@shopware/cms-base-layer-react/client";
import { getSmallestThumbnailUrl } from "@shopware/helpers";
import { useRef, useState } from "react";

import type { Schemas } from "#shopware";
import { Price } from "@/components/Price";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useMessages, useTranslations } from "@/i18n/I18nProvider";

export type CheckoutProductTileProps = {
  item: Schemas["LineItem"];
  onRemove: (id: string) => void;
  onChangeQuantity: (id: string, quantity: number) => void | Promise<unknown>;
  className?: string;
};

type QuantityRules = { min: number; max: number; step: number };

type QuantityDraft = {
  quantity: number;
  base: number | undefined;
  awaiting: boolean;
};

type LineItemOption = { group: string; option: string };

function quantityRules(item: Schemas["LineItem"]): QuantityRules {
  const { minPurchase, maxPurchase, purchaseSteps } =
    item.quantityInformation ?? {};
  const min = Math.max(1, Math.ceil(minPurchase ?? 1));
  const step = Math.max(1, Math.floor(purchaseSteps ?? 1));
  const highest =
    maxPurchase === undefined || !Number.isFinite(maxPurchase)
      ? Number.POSITIVE_INFINITY
      : min + step * Math.floor((maxPurchase - min) / step);
  return { min, max: Math.max(min, highest), step };
}

function normalizeQuantity(
  next: number,
  current: number,
  { min, max, step }: QuantityRules,
): number {
  if (!Number.isFinite(next)) return current;
  const offset = (next - min) / step;
  const snapped =
    min + step * (next >= current ? Math.ceil(offset) : Math.floor(offset));
  return Math.min(Math.max(snapped, min), max);
}

function lineItemOptions(item: Schemas["LineItem"]): LineItemOption[] {
  if (item.type !== "product") return [];
  const options: unknown = (item.payload as { options?: unknown } | undefined)
    ?.options;
  if (!Array.isArray(options)) return [];
  return options.flatMap((entry: unknown) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { group, option } = entry as { group?: unknown; option?: unknown };
    return typeof group === "string" && typeof option === "string"
      ? [{ group, option }]
      : [];
  });
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

export function CheckoutProductTile({
  item,
  onRemove,
  onChangeQuantity,
  className,
}: CheckoutProductTileProps) {
  const t = useTranslations();
  const messages = useMessages();
  const contentLang = useContentLang();
  const [draft, setDraft] = useState<QuantityDraft | null>(null);
  const changeTicket = useRef(0);

  const cover = item.cover ? getSmallestThumbnailUrl(item.cover) : undefined;
  const label = item.label || item.payload?.name || "";
  const options = lineItemOptions(item);
  const adjustable = item.type === "product" && item.stackable === true;
  const rules = quantityRules(item);
  const activeDraft =
    draft && (draft.awaiting || draft.base === item.quantity) ? draft : null;
  const quantity = activeDraft?.quantity ?? item.quantity ?? rules.min;

  function changeQuantity(next: number) {
    const normalized = normalizeQuantity(next, quantity, rules);
    if (normalized === quantity) return;
    changeTicket.current += 1;
    const ticket = changeTicket.current;
    const pending = onChangeQuantity(item.id, normalized);
    const awaiting = isThenable(pending);
    setDraft({ quantity: normalized, base: item.quantity, awaiting });
    if (!awaiting) return;
    const settle = () => {
      if (ticket === changeTicket.current) setDraft(null);
    };
    pending.then(settle, settle);
  }

  return (
    <div
      className={cx("flex gap-4", className)}
      data-testid="checkout-product-tile-item"
      data-product-id={item.referencedId}
    >
      <div className="size-24 shrink-0 overflow-hidden sm:size-37.5">
        {cover ? (
          <img
            data-testid="checkout-product-tile-image"
            src={cover}
            alt={t("cart.itemImageAlt", { label })}
            className="size-full object-cover object-center"
          />
        ) : (
          <div
            data-testid="checkout-product-tile-image-placeholder"
            className="size-full bg-surface-surface-container"
          />
        )}
      </div>
      <div className="grid grow grid-cols-2 justify-between gap-y-2 py-2.5">
        <div className="text-surface-on-surface">
          <div className="line-clamp-2" lang={contentLang}>
            {item.label}
          </div>
          {options.length > 0 ? (
            <p
              data-testid="cart-product-options"
              lang={contentLang}
              className="mt-1 text-sm text-surface-on-surface-variant"
            >
              {options.map(({ group, option }, index) => (
                <span key={`${index}-${group}-${option}`} className="mr-2">
                  {group}: {option}
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <Price
          className="ml-auto justify-start text-right text-surface-on-surface"
          value={item.price?.totalPrice}
        />
        <div className="content-end">
          {adjustable ? (
            <SwQuantitySelect
              value={quantity}
              onChange={changeQuantity}
              size="small"
              min={rules.min}
              max={Number.isFinite(rules.max) ? rules.max : undefined}
              steps={rules.step}
              translations={messages as CmsTranslations}
            />
          ) : null}
        </div>
        <div className="content-end text-right">
          {item.removable ? (
            <button
              type="button"
              data-testid="checkout-product-tile-remove-button"
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
