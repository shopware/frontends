import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export function OrderAddress({
  address,
  label,
}: {
  address: Schemas["OrderAddress"];
  label: string;
}) {
  const countryName = address.country
    ? getTranslatedProperty(address.country, "name")
    : "";

  return (
    <div>
      <h3 className="mb-3 leading-normal font-bold text-surface-on-surface">
        {label}
      </h3>
      <address className="flex flex-col items-start justify-start gap-0.5 bg-brand-secondary p-4 not-italic">
        <span className="text-base leading-normal text-surface-on-surface">
          {address.firstName} {address.lastName}
        </span>
        <span className="text-base leading-normal text-surface-on-surface">
          {address.street}
        </span>
        <span className="text-base leading-normal text-surface-on-surface">
          {address.zipcode} {address.city}
        </span>
        {countryName ? (
          <span className="text-base leading-normal text-surface-on-surface">
            {countryName}
          </span>
        ) : null}
      </address>
    </div>
  );
}
