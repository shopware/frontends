"use client";

import { useRef, useState } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import { notifyCartErrors } from "./cartNotifications";

export type AddToCartMessages = {
  addedToCart: string;
  viewCart: string;
  errors: Record<string, string>;
};

export type UseAddToCartOptions = {
  productId: string;
  productName: string;
  cartLink: string;
  messages: AddToCartMessages;
};

export function useAddToCart({
  productId,
  productName,
  cartLink,
  messages,
}: UseAddToCartOptions) {
  const actions = useCmsActions();
  const [isAdding, setIsAdding] = useState(false);
  const inFlight = useRef(false);

  async function addToCart(quantity?: number): Promise<boolean> {
    if (inFlight.current) return false;
    inFlight.current = true;
    setIsAdding(true);
    try {
      const result = await actions.addToCart(
        quantity === undefined ? { productId } : { productId, quantity },
      );
      if (notifyCartErrors(actions, result.errors, messages.errors)) {
        return false;
      }
      if (!result.ok) {
        if (result.message) {
          actions.notify({ type: "error", message: result.message });
        }
        return false;
      }
      actions.notify({
        type: "success",
        message: `${productName} ${messages.addedToCart}`,
        action: { label: messages.viewCart, href: cartLink },
      });
      return true;
    } catch (error) {
      actions.notify({
        type: "error",
        message: error instanceof Error ? error.message : String(error),
      });
      return false;
    } finally {
      inFlight.current = false;
      setIsAdding(false);
    }
  }

  return { addToCart, isAdding };
}
