import {
  getProductFromPrice,
  getProductManufacturerName,
  getProductName,
  getProductUrl,
} from "@shopware/helpers";
import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { cx } from "../../helpers/cx";
import { prefixUrl } from "../../helpers/resolveUrl";
import { withTranslationDefaults } from "../../translations";
import type { BoxLayout, DisplayMode } from "../../types";
import { SwProductCardDetails } from "./SwProductCardDetails";
import { SwProductCardImage } from "./SwProductCardImage";

export type SwProductCardProps = {
  product: Schemas["Product"];
  ctx: CmsClientContext;
  layoutType?: BoxLayout;
  displayMode?: DisplayMode;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  product: {
    addedToWishlist: "has been added to wishlist.",
    removedFromTheWishlist: "has been removed from wishlist.",
    reason: "Reason",
    cannotAddToWishlist: "cannot be added to wishlist.",
    addedToCart: "has been added to cart.",
    viewCart: "View cart",
    addToCart: "Add to cart",
    details: "Details",
    badges: {
      topseller: "Tip",
    },
    addToWishlist: "Add to wishlist",
    removeFromWishlist: "Remove from wishlist",
  },
  errors: {
    "product-stock-reached":
      "The product {name} is only available {quantity} times",
  },
};

export function SwProductCard({
  product,
  ctx,
  layoutType = "standard",
  className,
  style,
}: SwProductCardProps) {
  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );
  const fromPrice = getProductFromPrice(product);
  const productName = getProductName({ product });
  const productManufacturer = getProductManufacturerName(product);
  const productLink = prefixUrl(getProductUrl(product), ctx.urlPrefix);
  const cartLink = prefixUrl("/checkout/cart", ctx.urlPrefix);

  return (
    <div
      className={cx(
        "p-px flex flex-col justify-start items-start overflow-hidden",
        className,
      )}
      style={style}
    >
      <SwProductCardImage
        product={product}
        ctx={ctx}
        translations={translations}
        productLink={productLink}
      />
      <SwProductCardDetails
        product={product}
        ctx={ctx}
        productName={productName}
        productManufacturer={productManufacturer}
        translations={translations}
        fromPrice={fromPrice}
        productLink={productLink}
        cartLink={cartLink}
        layoutType={layoutType}
      />
    </div>
  );
}
