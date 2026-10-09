import { cx } from "@shopware/cms-base-layer-react/client";
import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const ROW_CLASS =
  "self-stretch text-base leading-normal font-normal text-surface-on-surface";

export type AddressDataSectionProps = {
  address: Schemas["CustomerAddress"];
  id?: string;
  className?: string;
};

export function AddressDataSection({
  address,
  id,
  className,
}: AddressDataSectionProps) {
  const countryName = address.country
    ? getTranslatedProperty(address.country, "name")
    : "";

  return (
    <div id={id} className={cx("flex flex-col gap-2", className)}>
      <div className={ROW_CLASS}>
        {address.firstName} {address.lastName}
      </div>
      <div className={ROW_CLASS}>{address.street}</div>
      <div className={ROW_CLASS}>
        {address.zipcode} {address.city}
      </div>
      <div className={ROW_CLASS}>{countryName}</div>
    </div>
  );
}
