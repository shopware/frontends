"use client";

import { useState, useSyncExternalStore } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type { CmsActions } from "../../actions/CmsActionsContext";
import { BaseButton } from "../ui/BaseButton";
import { IconButton } from "../ui/IconButton";
import { WishlistIcon } from "../ui/WishlistIcon";
import { notifyCartErrors } from "./cartNotifications";

export type SwProductCardWishlistTranslations = {
  addedToWishlist: string;
  removedFromTheWishlist: string;
  reason: string;
  cannotAddToWishlist: string;
  addToWishlist: string;
  removeFromWishlist: string;
};

export type SwProductCardWishlistButtonProps = {
  productId: string;
  productName: string;
  translations: SwProductCardWishlistTranslations;
};

type WishlistToggle = {
  actions: CmsActions;
  value: boolean;
};

const subscribeToNothing = () => () => {};

function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

export function SwProductCardWishlistButton({
  productId,
  productName,
  translations,
}: SwProductCardWishlistButtonProps) {
  const actions = useCmsActions();
  const mounted = useMounted();
  const [isLoading, setIsLoading] = useState(false);
  const [toggled, setToggled] = useState<WishlistToggle | null>(null);

  if (!mounted) return null;

  const isInWishlist =
    toggled?.actions === actions
      ? toggled.value
      : actions.isInWishlist(productId);

  function notifyFailure(detail?: string) {
    const reason = detail ? `${translations.reason}: ${detail}` : "";
    actions.notify({
      type: "error",
      message: `${productName} ${translations.cannotAddToWishlist}\n${reason}`,
      timeout: 5000,
    });
  }

  async function toggleWishlist() {
    setIsLoading(true);
    try {
      const result = await actions.toggleWishlist(productId);
      if (!result.ok) {
        notifyFailure(result.message);
        return;
      }
      const nextValue = result.inWishlist ?? !isInWishlist;
      setToggled({ actions, value: nextValue });
      actions.notify({
        type: "success",
        message: `${productName} ${
          nextValue
            ? translations.addedToWishlist
            : translations.removedFromTheWishlist
        }`,
      });
    } catch (error) {
      notifyFailure(error instanceof Error ? error.message : undefined);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <IconButton
      variant="secondary"
      aria-label={
        isInWishlist
          ? translations.removeFromWishlist
          : translations.addToWishlist
      }
      disabled={isLoading}
      className="w-10 h-10 right-4 top-4 absolute bg-brand-secondary rounded-full flex items-center justify-center"
      data-testid="product-box-toggle-wishlist-button"
      onClick={() => {
        void toggleWishlist();
      }}
    >
      <WishlistIcon filled={isInWishlist} />
    </IconButton>
  );
}

export type SwProductCardAddToCartTranslations = {
  addToCart: string;
  addedToCart: string;
  viewCart: string;
  errors: Record<string, string>;
};

export type SwProductCardAddToCartButtonProps = {
  productId: string;
  productName: string;
  available: boolean;
  cartLink: string;
  translations: SwProductCardAddToCartTranslations;
};

export function SwProductCardAddToCartButton({
  productId,
  productName,
  available,
  cartLink,
  translations,
}: SwProductCardAddToCartButtonProps) {
  const actions = useCmsActions();

  async function addToCart() {
    const result = await actions.addToCart({ productId });
    const hasCartErrors = notifyCartErrors(
      actions,
      result.errors,
      translations.errors,
    );
    if (hasCartErrors) return;
    if (result.ok) {
      actions.notify({
        type: "success",
        message: `${productName} ${translations.addedToCart}`,
        action: { label: translations.viewCart, href: cartLink },
      });
      return;
    }
    if (result.message) {
      actions.notify({ type: "error", message: result.message });
    }
  }

  return (
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
      {translations.addToCart}
    </BaseButton>
  );
}
