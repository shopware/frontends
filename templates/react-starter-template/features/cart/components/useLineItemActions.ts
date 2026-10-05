"use client";

import {
  getCmsTranslate,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useCallback, useRef } from "react";

import type { CartActionResult } from "@/features/cart/types";
import { useCart } from "@/features/cart/useCart";
import { errorMessages } from "@/features/session/errorMessages";

const CART_ERROR_MESSAGES: Record<string, string> = errorMessages.errors;

export function cartResultMessages(result: CartActionResult): string[] {
  const errors = result.errors ?? [];
  const messages = errors.flatMap(({ messageKey, params }) => {
    const fallback = params?.message;
    const text =
      CART_ERROR_MESSAGES[messageKey] ??
      (typeof fallback === "string" ? fallback : undefined);
    return text ? [getCmsTranslate(text, params)] : [];
  });
  if (errors.length === 0 && !result.ok && result.message) {
    messages.push(result.message);
  }
  return messages;
}

export function useLineItemActions() {
  const { removeItem, changeQuantity } = useCart();
  const { notify } = useCmsActions();
  const removing = useRef(new Set<string>());

  const report = useCallback(
    (result: CartActionResult) => {
      for (const message of cartResultMessages(result)) {
        notify({ type: "error", message });
      }
    },
    [notify],
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
