import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { SwVariantConfiguratorOptions } from "./SwVariantConfiguratorOptions";
import { getVariantOptionGroups } from "./variantOptionGroups";

export type SwVariantConfiguratorProps = {
  product: Schemas["Product"];
  optionGroups: Schemas["PropertyGroup"][] | null | undefined;
  ctx: Pick<CmsClientContext, "urlPrefix" | "translations">;
  className?: string;
  style?: CSSProperties;
};

export function SwVariantConfigurator({
  product,
  optionGroups,
  ctx,
  className,
  style,
}: SwVariantConfiguratorProps) {
  return (
    <SwVariantConfiguratorOptions
      productId={product.id}
      parentId={product.parentId ?? undefined}
      optionIds={product.optionIds ?? []}
      optionGroups={getVariantOptionGroups(optionGroups)}
      urlPrefix={ctx.urlPrefix}
      translations={ctx.translations}
      className={className}
      style={style}
    />
  );
}
