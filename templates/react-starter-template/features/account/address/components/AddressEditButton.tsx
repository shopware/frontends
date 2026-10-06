"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import Link from "next/link";
import type { MouseEvent } from "react";

import { INACTIVE_CLASS, TERTIARY_BUTTON_CLASS } from "./addressButtonClasses";
import { PencilIcon } from "./AddressIcons";

const t = {
  account: {
    address: {
      editAddressButton: "Edit address",
    },
  },
};

export type AddressEditButtonProps = {
  addressId: string;
  disabled?: boolean;
  describedBy?: string;
};

function preventNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function AddressEditButton({
  addressId,
  disabled = false,
  describedBy,
}: AddressEditButtonProps) {
  return (
    <Link
      href={`/account/address/edit/${encodeURIComponent(addressId)}`}
      className={cx(TERTIARY_BUTTON_CLASS, disabled && INACTIVE_CLASS)}
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? preventNavigation : undefined}
    >
      <PencilIcon className="size-4" />
      {t.account.address.editAddressButton}
    </Link>
  );
}
