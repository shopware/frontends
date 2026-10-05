"use client";

import {
  getShippingMethodDeliveryTime,
  getShippingMethodIcon,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type ShippingMethodsProps = {
  shippingMethods: Schemas["ShippingMethod"][];
  selectedShippingMethod: string | null;
  legend: string;
  onChange: (id: string) => void;
};

export function ShippingMethods({
  shippingMethods,
  selectedShippingMethod,
  legend,
  onChange,
}: ShippingMethodsProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{legend}</legend>
      <div className="divide-y divide-outline-outline border border-outline-outline">
        {shippingMethods.map((shippingMethod) => {
          const inputId = `shipping-method-${shippingMethod.id}`;
          const name = shippingMethod.translated?.name ?? shippingMethod.name;
          const deliveryTime = getShippingMethodDeliveryTime(shippingMethod);
          const icon = getShippingMethodIcon(shippingMethod);
          return (
            <div
              key={shippingMethod.id}
              className="p-4"
              data-testid="checkout-shipping-method"
            >
              <label
                htmlFor={inputId}
                className="flex cursor-pointer items-center gap-4"
              >
                <input
                  id={inputId}
                  type="radio"
                  name="shipping-method"
                  value={shippingMethod.id}
                  className="size-5 shrink-0 accent-brand-primary"
                  checked={selectedShippingMethod === shippingMethod.id}
                  onChange={() => onChange(shippingMethod.id)}
                />
                <span className="flex flex-col">
                  <span className="text-surface-on-surface">{name}</span>
                  {deliveryTime ? (
                    <span className="text-sm leading-[21px] text-surface-on-surface-variant">
                      {deliveryTime}
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
