import {
  getSmallestThumbnailUrl,
  getTranslatedProperty,
  isProductOnSale,
  isProductTopSeller,
} from "@shopware/helpers";
import Link from "next/link";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { getImagePlaceholder } from "../../helpers/imagePlaceholder";
import { CmsMedia } from "../ui/CmsMedia";
import { SwProductCardWishlistButton } from "./SwProductCardActions";
import type { SwProductCardWishlistTranslations } from "./SwProductCardActions";

export type SwProductCardImageTranslations = {
  product: SwProductCardWishlistTranslations & {
    badges: {
      topseller: string;
    };
  };
};

export type SwProductCardImageProps = {
  product: Schemas["Product"];
  ctx: Pick<CmsClientContext, "imageSizes" | "config">;
  translations: SwProductCardImageTranslations;
  productLink: string;
};

const IMAGE_CLASS = "w-full h-full absolute top-0 left-0 object-cover";

export function SwProductCardImage({
  product,
  ctx,
  translations,
  productLink,
}: SwProductCardImageProps) {
  const media = product.cover?.media;
  const coverSrcPath = media?.url || getSmallestThumbnailUrl(media);
  const coverAlt =
    getTranslatedProperty(media, "alt") || product.translated.name || "";
  const isOnSale = isProductOnSale(product);
  const isTopseller = isProductTopSeller(product);

  return (
    <div className="self-stretch min-h-[350px] relative flex flex-col justify-start items-start overflow-hidden aspect-square">
      <Link
        href={productLink}
        className="self-stretch h-full relative overflow-hidden"
      >
        {coverSrcPath ? (
          <CmsMedia
            media={{ url: coverSrcPath, thumbnails: media?.thumbnails }}
            alt={coverAlt}
            className={IMAGE_CLASS}
            width={400}
            height={400}
            sizes={ctx.imageSizes}
            loading="lazy"
            data-testid="product-box-img"
          />
        ) : (
          <img
            src={getImagePlaceholder(ctx.config.imagePlaceholder.color)}
            alt={coverAlt}
            className={IMAGE_CLASS}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            data-testid="product-box-img"
          />
        )}
      </Link>

      {isTopseller || isOnSale ? (
        <div className="px-1.5 py-1 left-2 bottom-2 absolute bg-other-sale rounded inline-flex justify-center items-center">
          <div className="text-states-on-error text-xs font-bold leading-none">
            {translations.product.badges.topseller}
          </div>
        </div>
      ) : null}

      <SwProductCardWishlistButton
        productId={product.id}
        productName={product.translated.name}
        translations={{
          addedToWishlist: translations.product.addedToWishlist,
          removedFromTheWishlist: translations.product.removedFromTheWishlist,
          reason: translations.product.reason,
          cannotAddToWishlist: translations.product.cannotAddToWishlist,
          addToWishlist: translations.product.addToWishlist,
          removeFromWishlist: translations.product.removeFromWishlist,
        }}
      />
    </div>
  );
}
