"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { INACTIVE_CLASS, TERTIARY_BUTTON_CLASS } from "./addressButtonClasses";
import { TrashIcon } from "./AddressIcons";

const t = {
  account: {
    address: {
      deleteAddressButton: "Delete address",
    },
  },
};

export type AddressDeleteButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  describedBy?: string;
};

export function AddressDeleteButton({
  onClick,
  disabled = false,
  busy = false,
  describedBy,
}: AddressDeleteButtonProps) {
  return (
    <button
      type="button"
      className={cx(TERTIARY_BUTTON_CLASS, disabled && INACTIVE_CLASS)}
      disabled={disabled}
      aria-busy={busy || undefined}
      aria-describedby={describedBy}
      onClick={onClick}
    >
      <TrashIcon className="h-4 w-3.5" />
      {t.account.address.deleteAddressButton}
    </button>
  );
}
