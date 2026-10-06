"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import type { Schemas } from "#shopware";

import { AddressActionLink } from "./AddressActionLink";
import { AddressDataSection } from "./AddressDataSection";
import { AddressDeleteButton } from "./AddressDeleteButton";
import { AddressEditButton } from "./AddressEditButton";
import { FileTextIcon, TruckIcon } from "./AddressIcons";

const t = {
  account: {
    address: {
      defaultBillingAddressSectionHeader: "Default billing address",
      defaultShippingAddressSectionHeader: "Default shipping address",
      useAsDefaultBillingAddressButton: "Use as default billing address",
      useAsDefaultShippingAddressButton: "Use as default shipping address",
    },
  },
};

const BADGE_CLASS =
  "inline-flex items-center gap-1.5 rounded-sm bg-brand-secondary px-2 py-1 text-xs font-bold text-brand-on-secondary";

export type DefaultAddressKind = "billing" | "shipping";

export type AddressTileProps = {
  address: Schemas["CustomerAddress"];
  isDeleting?: boolean;
  isDefaultBillingAddress?: boolean;
  isDefaultShippingAddress?: boolean;
  pendingDefault?: DefaultAddressKind | null;
  className?: string;
  onDelete: (addressId: string) => void;
  onSetAsDefaultBillingAddress: (addressId: string) => void;
  onSetAsDefaultShippingAddress: (addressId: string) => void;
};

export function AddressTile({
  address,
  isDeleting = false,
  isDefaultBillingAddress = false,
  isDefaultShippingAddress = false,
  pendingDefault = null,
  className,
  onDelete,
  onSetAsDefaultBillingAddress,
  onSetAsDefaultShippingAddress,
}: AddressTileProps) {
  const copy = t.account.address;
  const dataId = `address-${address.id}`;
  const busy = isDeleting || pendingDefault !== null;
  const isDefault = isDefaultBillingAddress || isDefaultShippingAddress;

  return (
    <div
      className={cx(
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        isDeleting && "pointer-events-none scale-95 opacity-50",
        className,
      )}
      aria-busy={busy || undefined}
      data-address-id={address.id}
    >
      {isDefault ? (
        <ul className="mb-4 flex flex-wrap gap-2">
          {isDefaultBillingAddress ? (
            <li className={BADGE_CLASS}>
              <FileTextIcon className="h-3 w-2.5" />
              {copy.defaultBillingAddressSectionHeader}
            </li>
          ) : null}
          {isDefaultShippingAddress ? (
            <li className={BADGE_CLASS}>
              <TruckIcon className="h-2.5 w-3.5" />
              {copy.defaultShippingAddressSectionHeader}
            </li>
          ) : null}
        </ul>
      ) : null}
      <AddressDataSection id={dataId} className="mb-8" address={address} />
      <div className="flex flex-wrap gap-4">
        <AddressEditButton
          addressId={address.id}
          disabled={isDeleting}
          describedBy={dataId}
        />
        {isDefault ? null : (
          <AddressDeleteButton
            disabled={busy}
            busy={isDeleting}
            describedBy={dataId}
            onClick={() => onDelete(address.id)}
          />
        )}
      </div>
      {isDefaultBillingAddress && isDefaultShippingAddress ? null : (
        <div className="mt-8 flex flex-col gap-4">
          {isDefaultBillingAddress ? null : (
            <AddressActionLink
              disabled={busy}
              busy={pendingDefault === "billing"}
              describedBy={dataId}
              onClick={() => onSetAsDefaultBillingAddress(address.id)}
            >
              <FileTextIcon className="h-6 w-4.5" />
              {copy.useAsDefaultBillingAddressButton}
            </AddressActionLink>
          )}
          {isDefaultShippingAddress ? null : (
            <AddressActionLink
              disabled={busy}
              busy={pendingDefault === "shipping"}
              describedBy={dataId}
              onClick={() => onSetAsDefaultShippingAddress(address.id)}
            >
              <TruckIcon className="h-4.5 w-6" />
              {copy.useAsDefaultShippingAddressButton}
            </AddressActionLink>
          )}
        </div>
      )}
    </div>
  );
}
