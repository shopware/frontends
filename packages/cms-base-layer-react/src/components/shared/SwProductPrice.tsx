import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { cx } from "../../helpers/cx";
import { formatPrice } from "../../helpers/formatPrice";
import { withTranslationDefaults } from "../../translations";
import { getProductPrice } from "./productPrice";
import { SwSharedPrice } from "./SwSharedPrice";

export type SwProductPriceProps = {
  product: Schemas["Product"];
  ctx: Pick<CmsClientContext, "locale" | "currencyCode" | "translations">;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  product: {
    amount: "Amount",
    price: {
      label: "Price",
      to: "To",
      from: "From",
    },
    to: "To",
    from: "From",
  },
};

export function SwProductPrice({
  product,
  ctx,
  className,
  style,
}: SwProductPriceProps) {
  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );
  const { unitPrice, price, tierPrices, hasListPrice } =
    getProductPrice(product);

  return (
    <div className={className} style={style}>
      {tierPrices.length === 0 ? (
        <div>
          {hasListPrice ? (
            <SwSharedPrice
              className="text-xl text-gray-900 basis-2/6 justify-end line-through"
              value={price?.listPrice?.price}
              ctx={ctx}
            />
          ) : null}
          {unitPrice ? (
            <SwSharedPrice
              className={cx(
                "text-3xl text-gray-900 basis-2/6 justify-end",
                hasListPrice && "text-red-400",
              )}
              value={unitPrice}
              ctx={ctx}
            />
          ) : null}
        </div>
      ) : (
        <div>
          <table className="border-collapse table-auto w-full text-sm mb-8">
            <thead>
              <tr>
                <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-600 text-left">
                  {translations.product.amount}
                </th>
                <th className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-600 text-left">
                  {translations.product.price.label}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tierPrices.map((tierPrice, index) => (
                <tr key={tierPrice.label}>
                  <td className="border-b border-slate-100 p-4 pl-8 font-medium text-slate-500">
                    <span>
                      {index < tierPrices.length - 1
                        ? translations.product.price.to
                        : translations.product.price.from}
                    </span>{" "}
                    {tierPrice.quantity}
                  </td>
                  <td className="border-b border-slate-100 p-4 pr-8 font-medium text-current">
                    {formatPrice(tierPrice.unitPrice, ctx)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
