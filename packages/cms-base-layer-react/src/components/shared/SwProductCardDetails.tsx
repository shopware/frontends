import Link from "next/link";

import type { Schemas } from "#shopware";

import type { BoxLayout } from "../../types";
import { SwListingProductPrice } from "./SwListingProductPrice";
import type { ProductPriceContext } from "./SwListingProductPrice";
import { SwProductCardAddToCartButton } from "./SwProductCardActions";
import { SwProductRating } from "./SwProductRating";

export type SwProductCardDetailsTranslations = {
  product: {
    addToCart: string;
    addedToCart: string;
    viewCart: string;
    details: string;
  };
  errors: Record<string, string>;
};

export type SwProductCardDetailsProps = {
  product: Schemas["Product"];
  ctx: ProductPriceContext;
  productName: string | null;
  productManufacturer?: string | null;
  translations: SwProductCardDetailsTranslations;
  fromPrice?: number;
  productLink: string;
  cartLink: string;
  layoutType?: BoxLayout;
};

const DETAILS_LINK_CLASS =
  "self-stretch w-full inline-flex justify-center items-center gap-2 rounded font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 px-4 py-3 text-base bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary focus:ring-brand-primary";

export function SwProductCardDetails({
  product,
  ctx,
  productName,
  productManufacturer,
  translations,
  fromPrice,
  productLink,
  cartLink,
  layoutType,
}: SwProductCardDetailsProps) {
  const isMinimalLayout = layoutType === "minimal";

  return (
    <div className="self-stretch p-2 flex flex-col justify-between items-start gap-4 flex-1">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            {productManufacturer ? (
              <div className="self-stretch text-surface-on-surface text-sm font-bold leading-tight">
                {productManufacturer}
              </div>
            ) : null}

            <Link
              href={productLink}
              className="self-stretch text-surface-on-surface text-2xl font-normal font-serif leading-9 overflow-hidden line-clamp-2 break-words min-h-[4.5rem]"
              data-testid="product-box-product-name-link"
            >
              {productName}
            </Link>
          </div>
        </div>

        {isMinimalLayout ? (
          <SwProductRating
            rating={product.ratingAverage ?? 0}
            reviewCount={product.productReviews?.length ?? 0}
            className="mt-4"
          />
        ) : (
          <SwListingProductPrice
            product={product}
            ctx={ctx}
            data-testid="product-box-product-price"
          />
        )}
      </div>

      {isMinimalLayout ? null : fromPrice ? (
        <Link href={productLink} className={DETAILS_LINK_CLASS}>
          <span>{translations.product.details}</span>
        </Link>
      ) : (
        <SwProductCardAddToCartButton
          productId={product.id}
          productName={productName ?? ""}
          available={!!product.available}
          cartLink={cartLink}
          translations={{
            addToCart: translations.product.addToCart,
            addedToCart: translations.product.addedToCart,
            viewCart: translations.product.viewCart,
            errors: translations.errors,
          }}
        />
      )}
    </div>
  );
}
