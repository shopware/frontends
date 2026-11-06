import { getTranslatedProperty } from "@shopware/helpers";

import { cx } from "../../helpers/cx";
import { formatPrice } from "../../helpers/formatPrice";
import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import { withTranslationDefaults } from "../../translations";
import type { CmsElementBuyBox as CmsElementBuyBoxContent } from "../../types";
import { getProductPrice } from "../shared/productPrice";
import { SwProductAddToCart } from "../shared/SwProductAddToCart";
import { SwSharedPrice } from "../shared/SwSharedPrice";
import { SwVariantConfigurator } from "../shared/SwVariantConfigurator";
import { formatReferencePrice } from "./formatReferencePrice";

const translationDefaults = {
  product: {
    previously: "Previously",
    amount: "Amount",
    price: {
      label: "Price",
      to: "To",
      from: "From",
    },
    to: "To",
    from: "From",
    content: "Content",
    pricesIncl: "Prices incl. VAT plus shipping costs",
    pricesExcl: "Prices excl. VAT plus shipping costs",
  },
};

export function CmsElementBuyBox({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementBuyBoxContent>) {
  const product = content.data?.product;
  if (!product) return null;

  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );
  const alignment = getConfigValue(content, "alignment");
  const { unitPrice, price, tierPrices, hasListPrice } =
    getProductPrice(product);
  const regulationPrice = price?.regulationPrice?.price;
  const referencePrice = product.calculatedPrice?.referencePrice;
  const purchaseUnit = product.purchaseUnit;
  const unitName = getTranslatedProperty(product.unit, "name");
  const productName = product.translated?.name || "";

  return (
    <div
      className={cx(
        "h-full w-full flex flex-col",
        alignment === "flex-start" && "justify-start",
        alignment === "flex-end" && "justify-end",
        alignment === "center" && "justify-center",
        className,
      )}
      style={style}
    >
      <div className="self-stretch inline-flex flex-col justify-start items-start gap-8 mt-4 min-w-0">
        <div className="md:hidden self-stretch text-surface-on-surface text-4xl font-normal font-serif leading-[60px]">
          {productName}
        </div>

        {tierPrices.length <= 1 ? (
          <div>
            {hasListPrice ? (
              <SwSharedPrice
                className="text-xl text-surface-on-surface basis-2/6 justify-start line-through"
                value={price?.listPrice?.price}
                ctx={ctx}
              />
            ) : null}
            {unitPrice ? (
              <SwSharedPrice
                className={cx(
                  "text-surface-on-surface text-base font-bold leading-normal",
                  hasListPrice && "text-states-error",
                )}
                value={unitPrice}
                ctx={ctx}
              />
            ) : null}
            {regulationPrice ? (
              <div className="text-xs flex text-surface-on-surface-variant">
                {translations.product.previously}
                <SwSharedPrice
                  className="ml-1"
                  value={regulationPrice}
                  ctx={ctx}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <table className="border-collapse table-auto w-full text-sm mb-8">
              <thead>
                <tr>
                  <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-surface-on-surface-variant text-left">
                    {translations.product.amount}
                  </th>
                  <th className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-surface-on-surface-variant text-left">
                    {translations.product.price.label}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {tierPrices.map((tierPrice, index) => (
                  <tr key={tierPrice.label}>
                    <td className="border-b border-outline-outline-variant p-4 pl-8 font-medium text-surface-on-surface-variant">
                      <span>
                        {index < tierPrices.length - 1
                          ? translations.product.to
                          : translations.product.from}
                      </span>{" "}
                      {tierPrice.quantity}
                    </td>
                    <td className="border-b border-outline-outline-variant p-4 pr-8 font-medium text-current">
                      {formatPrice(tierPrice.unitPrice, ctx)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {purchaseUnit && unitName ? (
          <div className="mt-1">
            <span className="font-light">{`${translations.product.content}: `}</span>
            <span className="font-light">{`${purchaseUnit} ${unitName}`}</span>
            {referencePrice ? (
              <span className="font-light">
                {` ${formatReferencePrice(referencePrice.price, ctx)} / ${referencePrice.referenceUnit} ${referencePrice.unitName}`}
              </span>
            ) : null}
          </div>
        ) : null}

        <span className="text-brand-primary">
          {ctx.taxState === "gross"
            ? translations.product.pricesIncl
            : translations.product.pricesExcl}
        </span>

        <SwVariantConfigurator
          product={product}
          optionGroups={content.data?.configuratorSettings}
          ctx={ctx}
        />
        <SwProductAddToCart product={product} ctx={ctx} />
      </div>
    </div>
  );
}
