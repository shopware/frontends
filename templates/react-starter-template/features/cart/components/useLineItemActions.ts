"use client";

import {
  getCmsTranslate,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import type {
  CmsActionError,
  CmsNotification,
} from "@shopware/cms-base-layer-react/client";
import { useCallback, useRef } from "react";

import type { Schemas } from "#shopware";
import { useCart } from "@/features/cart/useCart";
import { useTranslations } from "@/i18n/I18nProvider";
import { hasTranslation } from "@/i18n/translate";
import type { Translate } from "@/i18n/translate";

export type CartNotificationError = CmsActionError & { level?: number };

export type CartNotificationSource = {
  ok: boolean;
  message?: string;
  errors?: readonly CartNotificationError[];
};

type FocusAnchor = { item: Element; list: Element; index: number };

const HTML_TAG = /<[^>]*>/g;
const REMOVE_BUTTON = "[data-line-item-remove]";
const PROMOTION_CODE_INPUT = 'input[name="promoCode"]';

function notificationType(level: number | undefined): CmsNotification["type"] {
  if (level === 0) return "info";
  if (level === 10) return "warning";
  return "error";
}

function translatedText(
  messageKey: string,
  translated: unknown,
): string | null {
  if (typeof translated !== "string") return null;
  const text = translated.replace(HTML_TAG, "").trim();
  return text && text !== `checkout.${messageKey}` ? text : null;
}

function errorMessage(
  { messageKey, params }: CartNotificationError,
  t: Translate,
): string | null {
  const key = `errors.${messageKey}`;
  if (hasTranslation(t, key)) return t(key, params);
  const translated = translatedText(messageKey, params?.translatedMessage);
  if (translated) return translated;
  const fallback = params?.message;
  return typeof fallback === "string" && fallback
    ? getCmsTranslate(fallback, params)
    : null;
}

export function cartNotifications(
  result: CartNotificationSource,
  t: Translate,
): CmsNotification[] {
  const errors = result.errors ?? [];
  const notifications = errors.flatMap((error): CmsNotification[] => {
    const message = errorMessage(error, t);
    return message ? [{ type: notificationType(error.level), message }] : [];
  });
  if (errors.length === 0 && !result.ok && result.message) {
    notifications.push({ type: "error", message: result.message });
  }
  return notifications;
}

export function cartResultMessages(
  result: CartNotificationSource,
  t: Translate,
): string[] {
  return cartNotifications(result, t).map(({ message }) => message);
}

export function useCartNotifier(): (result: CartNotificationSource) => void {
  const { notify } = useCmsActions();
  const t = useTranslations();
  return useCallback(
    (result: CartNotificationSource) => {
      for (const notification of cartNotifications(result, t)) {
        notify(notification);
      }
    },
    [notify, t],
  );
}

function removalMessage(
  item: Schemas["LineItem"] | undefined,
  t: Translate,
): string | null {
  if (item?.type === "promotion") return t("cart.promotionCode.removed");
  return item?.label ? t("cart.lineItemRemoved", { name: item.label }) : null;
}

function focusAnchor(): FocusAnchor | null {
  const item = document.activeElement?.closest("li");
  const list = item?.parentElement;
  if (!item || !list) return null;
  return { item, list, index: Array.from(list.children).indexOf(item) };
}

function restoreFocus({ item, list, index }: FocusAnchor): void {
  const active = document.activeElement;
  if (item.isConnected || !list.isConnected) return;
  if (active && active !== document.body) return;
  const items = Array.from(list.children);
  const neighbours = [
    ...items.slice(index),
    ...items.slice(0, index).reverse(),
  ];
  const target =
    neighbours
      .map((candidate) => candidate.querySelector<HTMLElement>(REMOVE_BUTTON))
      .find((button) => button !== null) ??
    list.parentElement?.querySelector<HTMLElement>(PROMOTION_CODE_INPUT);
  target?.focus();
}

export function useLineItemActions() {
  const { lineItems, removeItem, changeQuantity } = useCart();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const report = useCartNotifier();
  const removing = useRef(new Set<string>());

  const remove = useCallback(
    async (id: string) => {
      if (removing.current.has(id)) return;
      removing.current.add(id);
      const anchor = focusAnchor();
      const item = lineItems.find((lineItem) => lineItem.id === id);
      try {
        const result = await removeItem(id);
        if (result.ok) {
          const message = removalMessage(item, t);
          if (message) notify({ type: "success", message });
          if (anchor) setTimeout(() => restoreFocus(anchor), 0);
        }
        report(result);
      } finally {
        removing.current.delete(id);
      }
    },
    [lineItems, notify, removeItem, report, t],
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      report(await changeQuantity(id, quantity));
    },
    [changeQuantity, report],
  );

  return { remove, updateQuantity };
}
