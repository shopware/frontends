"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

import { cx } from "../../helpers/cx";
import { ChevronDownIcon } from "../icons";
import { useClickOutside } from "./useClickOutside";

export type SwFilterDropdownProps = {
  label: string;
  isActive?: boolean;
  children?: ReactNode;
};

export function SwFilterDropdown({
  label,
  isActive = false,
  children,
}: SwFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownElement = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownElement, () => setIsOpen(false), isOpen);

  return (
    <div ref={dropdownElement} className="relative">
      <button
        type="button"
        className={cx(
          "bg-brand-tertiary rounded-full px-4 py-1.5 inline-flex items-center hover:bg-brand-tertiary-hover transition-colors",
          isActive && "ring-2 ring-brand-primary",
        )}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="py-1 inline-flex items-center gap-1">
          <span className="text-brand-on-tertiary text-base font-normal leading-6">
            {label}
          </span>
          <ChevronDownIcon
            width={24}
            height={24}
            className={cx(
              "transition-transform text-brand-on-tertiary",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 min-w-64 bg-surface-surface rounded-lg shadow-lg ring-1 ring-outline-outline-variant z-50 p-4"
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}
