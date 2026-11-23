import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type ChosenAddress = Pick<
  Schemas["CustomerAddress"],
  "firstName" | "lastName" | "street" | "zipcode" | "city" | "country"
>;

export function CustomerAddressChosen({ address }: { address: ChosenAddress }) {
  const countryName = address.country
    ? getTranslatedProperty(address.country, "name")
    : "";

  return (
    <address
      className="inline-flex flex-col items-start justify-start bg-brand-secondary p-4 not-italic"
      data-testid="checkout-chosen-address"
    >
      <span className="text-base text-surface-on-surface">
        {address.firstName} {address.lastName}
      </span>
      <span className="text-base text-surface-on-surface">
        {address.street}
      </span>
      <span className="text-base text-surface-on-surface">
        {address.zipcode} {address.city}
      </span>
      {countryName ? (
        <span className="text-base text-surface-on-surface">{countryName}</span>
      ) : null}
    </address>
  );
}
