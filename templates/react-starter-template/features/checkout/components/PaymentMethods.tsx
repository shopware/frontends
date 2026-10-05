"use client";

import { getPaymentMethodIcon } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type PaymentMethodsProps = {
  paymentMethods: Schemas["PaymentMethod"][];
  selectedPaymentMethod: string | null;
  legend: string;
  onChange: (id: string) => void;
};

export function PaymentMethods({
  paymentMethods,
  selectedPaymentMethod,
  legend,
  onChange,
}: PaymentMethodsProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{legend}</legend>
      <div className="divide-y divide-outline-outline border border-outline-outline">
        {paymentMethods.map((paymentMethod) => {
          const inputId = `payment-method-${paymentMethod.id}`;
          const name = paymentMethod.translated?.name ?? paymentMethod.name;
          const description =
            paymentMethod.translated?.description ?? paymentMethod.description;
          const icon = getPaymentMethodIcon(paymentMethod);
          return (
            <div
              key={paymentMethod.id}
              className="p-4"
              data-testid="checkout-payment-method"
            >
              <label
                htmlFor={inputId}
                className="flex cursor-pointer items-center gap-4"
              >
                <input
                  id={inputId}
                  type="radio"
                  name="payment-method"
                  value={paymentMethod.id}
                  className="size-5 shrink-0 accent-brand-primary"
                  checked={selectedPaymentMethod === paymentMethod.id}
                  onChange={() => onChange(paymentMethod.id)}
                />
                <span className="flex flex-col">
                  <span className="text-surface-on-surface">{name}</span>
                  {description ? (
                    <span className="text-sm leading-[21px] text-surface-on-surface-variant">
                      {description}
                    </span>
                  ) : null}
                </span>
                {icon ? (
                  <img
                    src={icon}
                    alt={name}
                    height={32}
                    className="ml-auto h-8 w-auto"
                    loading="lazy"
                  />
                ) : null}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
