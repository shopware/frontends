"use client";

import type { Schemas } from "#shopware";
import { Price } from "@/components/Price";
import { useCart } from "@/features/cart/useCart";
import type { Locale } from "@/i18n/config";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";

export type CartTotalsProps = {
  withShippingMethod?: boolean;
  withShippingEstimate?: boolean;
};

type CalculatedTax = Schemas["CartPrice"]["calculatedTaxes"][number];

type TaxLabelKey = "cart.summary.taxIncluded" | "cart.summary.taxExcluded";

type Named = { name?: string; translated?: { name?: string } };

const LABEL_CLASS = "text-sm font-normal text-surface-on-surface-variant";
const AMOUNT_CLASS = "text-sm font-normal text-surface-on-surface";

const rateFormats = new Map<Locale, Intl.NumberFormat>();

function rateFormat(locale: Locale): Intl.NumberFormat {
  let format = rateFormats.get(locale);
  if (!format) {
    format = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    rateFormats.set(locale, format);
  }
  return format;
}

function nameOf(entity: Named | undefined): string | undefined {
  return entity?.translated?.name || entity?.name || undefined;
}

export function CartTotals({
  withShippingMethod = false,
  withShippingEstimate = false,
}: CartTotalsProps) {
  const { cart, subtotal, totalPrice, shippingCosts } = useCart();
  const t = useTranslations();
  const locale = useLocale();
  const contentLang = useContentLang();
  const taxStatus = cart?.price?.taxStatus;
  const taxes: CalculatedTax[] = cart?.price?.calculatedTaxes ?? [];
  const country = withShippingEstimate
    ? nameOf(shippingCosts[0]?.location?.country)
    : undefined;

  function taxRows(labelKey: TaxLabelKey) {
    return taxes.map((tax, index) => (
      <div key={`${tax.taxRate}-${index}`} className="flex justify-between">
        <dt className={LABEL_CLASS}>
          {t(labelKey, { rate: rateFormat(locale).format(tax.taxRate) })}
        </dt>
        <dd>
          <Price
            value={tax.tax}
            className={AMOUNT_CLASS}
            data-testid="cart-tax"
          />
        </dd>
      </div>
    ));
  }

  return (
    <>
      <dl className="flex flex-col gap-1 border-t border-outline-outline-variant py-4">
        <div className="flex justify-between">
          <dt className={LABEL_CLASS}>{t("checkout.subtotal")}</dt>
          <dd>
            <Price
              value={subtotal}
              className={AMOUNT_CLASS}
              data-testid="cart-subtotal"
            />
          </dd>
        </div>
        {shippingCosts.map((delivery, index) => {
          const method = withShippingMethod
            ? nameOf(delivery.shippingMethod)
            : undefined;
          return (
            <div
              key={delivery.shippingMethod?.id ?? index}
              className="flex justify-between"
            >
              <dt className={LABEL_CLASS}>
                {t("checkout.shippingCosts")}
                {method ? (
                  <span className="block text-xs" lang={contentLang}>
                    {method}
                  </span>
                ) : null}
              </dt>
              <dd>
                <Price
                  value={delivery.shippingCosts?.totalPrice}
                  className={AMOUNT_CLASS}
                  data-testid="cart-shipping-cost"
                />
              </dd>
            </div>
          );
        })}
        {taxStatus === "net" ? taxRows("cart.summary.taxExcluded") : null}
      </dl>
      <dl className="flex justify-between border-t border-outline-outline-variant pt-4">
        <dt className="text-base leading-normal font-normal text-surface-on-surface">
          {t("checkout.total")}
        </dt>
        <dd>
          <Price
            value={totalPrice}
            className="text-right text-base leading-normal font-normal text-surface-on-surface"
            data-testid="cart-total"
          />
        </dd>
      </dl>
      {taxStatus === "gross" && taxes.length > 0 ? (
        <dl className="mt-1 flex flex-col gap-1">
          {taxRows("cart.summary.taxIncluded")}
        </dl>
      ) : null}
      {country ? (
        <p
          data-testid="cart-shipping-estimate"
          className="mt-4 text-sm text-surface-on-surface-variant"
        >
          {t("cart.summary.shippingEstimate", { country })}
        </p>
      ) : null}
    </>
  );
}
