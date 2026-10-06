"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import type { ReactNode } from "react";

import { INACTIVE_CLASS } from "./addressButtonClasses";

export type AddressActionLinkProps = {
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  describedBy?: string;
  children: ReactNode;
};

export function AddressActionLink({
  onClick,
  disabled = false,
  busy = false,
  describedBy,
  children,
}: AddressActionLinkProps) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex h-6 w-fit items-center gap-1 border-b border-brand-primary bg-transparent leading-0 text-brand-primary transition-all duration-200 hover:border-transparent focus-visible:ring-2 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden motion-reduce:transition-none",
        disabled && INACTIVE_CLASS,
      )}
      disabled={disabled}
      aria-busy={busy || undefined}
      aria-describedby={describedBy}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
