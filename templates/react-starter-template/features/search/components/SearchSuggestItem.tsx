"use client";

import { getProductPrice } from "@shopware/cms-base-layer-react/client";
import {
  getProductName,
  getProductUrl,
  getSmallestThumbnailUrl,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";
import { LocaleLink } from "@/components/LocaleLink";
import { Price } from "@/components/Price";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useTranslations } from "@/i18n/I18nProvider";

export type SearchSuggestItemProps = {
  product: Schemas["Product"];
  onNavigate(): void;
};

function SearchSuggestUnits({ product }: { product: Schemas["Product"] }) {
  const referencePrice = product.calculatedPrice?.referencePrice;
  if (!product.purchaseUnit || !referencePrice?.price) return null;
  return (
    <span
      data-testid="layout-search-suggest-units"
      className="block text-xs text-surface-on-surface-variant"
    >
      (<Price value={referencePrice.price} /> / {referencePrice.referenceUnit}{" "}
      {referencePrice.unitName})
    </span>
  );
}

export function SearchSuggestItem({
  product,
  onNavigate,
}: SearchSuggestItemProps) {
  const t = useTranslations();
  const contentLang = useContentLang();
  const { unitPrice, displayFrom } = getProductPrice(product);
  const image = getSmallestThumbnailUrl(product.cover?.media);

  return (
    <LocaleLink
      href={getProductUrl(product)}
      prefetch={false}
      data-testid="layout-search-suggest-link"
      onClick={onNavigate}
      className="flex min-h-14 items-center gap-3 bg-surface-surface p-3 text-sm transition-colors hover:bg-surface-surface-container focus-visible:bg-surface-surface-container focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shell-ink"
    >
      <span className="size-8 flex-none overflow-hidden rounded-md border border-outline-outline-variant">
        {image ? (
          <img
            data-testid="layout-search-suggest-image"
            src={image}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            className="size-8 object-cover"
          />
        ) : null}
      </span>
      <span className="flex grow items-center justify-between gap-5 overflow-hidden">
        <span
          data-testid="layout-search-suggest-name"
          lang={contentLang}
          className="truncate text-surface-on-surface-variant"
        >
          {getProductName({ product })}
        </span>
        <span className="flex-none text-right">
          {unitPrice ? (
            <span
              data-testid="layout-search-suggest-price"
              className="block text-surface-on-surface"
            >
              {displayFrom ? `${t("product.price.from")} ` : null}
              <Price value={unitPrice} />
            </span>
          ) : null}
          <SearchSuggestUnits product={product} />
        </span>
      </span>
    </LocaleLink>
  );
}
