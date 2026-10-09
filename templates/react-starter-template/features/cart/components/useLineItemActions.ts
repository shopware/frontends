"use client";

import {
  getCmsTranslate,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useCallback, useRef } from "react";

import type { CartActionResult } from "@/features/cart/types";
import { useCart } from "@/features/cart/useCart";
import { useTranslations } from "@/i18n/I18nProvider";
import { hasTranslation } from "@/i18n/translate";
import type { Translate } from "@/i18n/translate";

export function cartResultMessages(
  result: CartActionResult,
  t: Translate,
): string[] {
  const errors = result.errors ?? [];
  const messages = errors.flatMap(({ messageKey, params }) => {
    const key = `errors.${messageKey}`;
    if (hasTranslation(t, key)) return [t(key, params)];
    const fallback = params?.message;
    return typeof fallback === "string" && fallback
      ? [getCmsTranslate(fallback, params)]
      : [];
  });
  if (errors.length === 0 && !result.ok && result.message) {
    messages.push(result.message);
  }
  return messages;
}

export function useLineItemActions() {
  const { removeItem, changeQuantity } = useCart();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const removing = useRef(new Set<string>());

  const report = useCallback(
    (result: CartActionResult) => {
      for (const message of cartResultMessages(result, t)) {
        notify({ type: "error", message });
      }
    },
    [notify, t],
  );

  const remove = useCallback(
    async (id: string) => {
      if (removing.current.has(id)) return;
      removing.current.add(id);
      try {
        report(await removeItem(id));
      } finally {
        removing.current.delete(id);
      }
    },
    [removeItem, report],
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      report(await changeQuantity(id, quantity));
    },
    [changeQuantity, report],
  );

  return { remove, updateQuantity };
}
