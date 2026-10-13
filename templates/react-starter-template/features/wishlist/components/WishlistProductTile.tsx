"use client";

import {
  BaseButton,
  IconButton,
  WishlistIcon,
  cx,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import {
  getProductName,
  getProductUrl,
  getSmallestThumbnailUrl,
} from "@shopware/helpers";
import { useId, useRef, useState } from "react";

import type { Schemas } from "#shopware";
import { LocaleLink } from "@/components/LocaleLink";
import { Price } from "@/components/Price";
import { cartResultMessages } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useWishlist } from "@/features/wishlist/useWishlist";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useTranslations } from "@/i18n/I18nProvider";

export type WishlistProductTileProps = {
  product: Schemas["Product"];
  onRemoved: () => void;
  className?: string;
};

export function WishlistProductTile({
  product,
  onRemoved,
  className,
}: WishlistProductTileProps) {
  const t = useTranslations();
  const contentLang = useContentLang();
  const { notify } = useCmsActions();
  const { remove } = useWishlist();
  const { addProduct } = useCart();
  const { refreshSession } = useSessionActions();
  const nameId = useId();
  const [removing, setRemoving] = useState(false);
  const [adding, setAdding] = useState(false);
  const busy = useRef({ removing: false, adding: false });

  const name = getProductName({ product }) ?? "";
  const href = getProductUrl(product);
  const cover = product.cover?.media
    ? getSmallestThumbnailUrl(product.cover.media)
    : undefined;

  async function removeProduct() {
    if (busy.current.removing) return;
    busy.current.removing = true;
    setRemoving(true);
    try {
      const result = await remove(product.id);
      if (!result.ok) {
        notify({
          type: "error",
          message: result.message ?? t("messages.error"),
        });
        if (result.loggedOut) void refreshSession();
        return;
      }
      notify({
        type: "success",
        message: `${name} ${t("product.removedFromTheWishlist")}`,
      });
      onRemoved();
    } finally {
      busy.current.removing = false;
      setRemoving(false);
    }
  }

  async function addToCart() {
    if (busy.current.adding) return;
    busy.current.adding = true;
    setAdding(true);
    try {
      const result = await addProduct({ id: product.id });
      const errors = cartResultMessages(result, t);
      for (const message of errors) notify({ type: "error", message });
      if (errors.length > 0) return;
      if (!result.ok) {
        notify({ type: "error", message: t("messages.error") });
        return;
      }
      notify({
        type: "success",
        message: t("account.messages.productsAdded"),
        action: { label: t("product.viewCart"), href: "/checkout/cart" },
      });
    } finally {
      busy.current.adding = false;
      setAdding(false);
    }
  }

  return (
    <li
      data-testid="wishlist-product-box"
      className={cx("flex flex-col gap-3", className)}
    >
      <div className="relative">
        <LocaleLink
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="block aspect-square overflow-hidden rounded-md bg-surface-surface-container"
        >
          {cover ? (
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="size-full object-cover object-center"
            />
          ) : null}
        </LocaleLink>
        <IconButton
          variant="secondary"
          data-testid="wishlist-product-box-toggle-button"
          aria-label={t("product.removeFromWishlist")}
          aria-describedby={nameId}
          aria-disabled={removing || undefined}
          aria-busy={removing || undefined}
          className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus aria-disabled:cursor-progress aria-disabled:opacity-60"
          onClick={() => {
            void removeProduct();
          }}
        >
          <WishlistIcon filled />
        </IconButton>
      </div>
      <LocaleLink
        id={nameId}
        href={href}
        lang={contentLang}
        className="line-clamp-2 text-base font-bold text-surface-on-surface hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus"
      >
        {name}
      </LocaleLink>
      <Price
        value={product.calculatedPrice?.totalPrice}
        className="text-surface-on-surface"
      />
      <BaseButton
        data-testid="wishlist-add-to-cart-button"
        aria-describedby={nameId}
        block
        aria-busy={adding || undefined}
        aria-disabled={adding || undefined}
        className="aria-disabled:cursor-progress aria-disabled:opacity-60"
        onClick={() => {
          void addToCart();
        }}
      >
        {t("product.addToCart")}
      </BaseButton>
    </li>
  );
}

export function WishlistProductTileSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <li
      aria-hidden="true"
      className={cx("flex animate-pulse flex-col gap-3", className)}
    >
      <div className="aspect-square rounded-md bg-surface-surface-container" />
      <div className="h-5 w-3/4 rounded bg-surface-surface-container" />
      <div className="h-5 w-1/3 rounded bg-surface-surface-container" />
      <div className="h-12 rounded-md bg-surface-surface-container" />
    </li>
  );
}
