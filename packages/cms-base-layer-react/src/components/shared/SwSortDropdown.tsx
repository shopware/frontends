"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import { cx } from "../../helpers/cx";
import { ChevronDownIcon } from "../icons";
import type { ListingSortOption } from "./listingFilterTypes";
import { getNextMenuItemIndex } from "./sortMenuKeyboard";
import { useClickOutside } from "./useClickOutside";

export type SwSortDropdownProps = {
  sortOptions: ListingSortOption[];
  currentSort: string;
  label: string;
  onSortChange: (key: string) => void;
};

export function SwSortDropdown({
  sortOptions,
  currentSort,
  label,
  onSortChange,
}: SwSortDropdownProps) {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const dropdownElement = useRef<HTMLDivElement>(null);
  const toggleElement = useRef<HTMLButtonElement>(null);
  const menuElement = useRef<HTMLDivElement>(null);
  const menuButtonId = useId();

  useClickOutside(
    dropdownElement,
    () => setIsSortMenuOpen(false),
    isSortMenuOpen,
  );

  const getMenuItems = () =>
    Array.from(
      menuElement.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]',
      ) ?? [],
    );

  useEffect(() => {
    if (!isSortMenuOpen) return;
    menuElement.current
      ?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      ?.focus();
  }, [isSortMenuOpen]);

  const closeMenu = () => {
    setIsSortMenuOpen(false);
    toggleElement.current?.focus();
  };

  const handleSortingClick = (
    key: string,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    onSortChange(key);
    if (event.detail === 0) {
      closeMenu();
      return;
    }
    setIsSortMenuOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      if (!isSortMenuOpen) return;
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key === "Tab") {
      setIsSortMenuOpen(false);
      return;
    }
    const items = getMenuItems();
    const currentIndex = items.findIndex(
      (item) => item === document.activeElement,
    );
    const nextIndex = getNextMenuItemIndex(
      event.key,
      currentIndex,
      items.length,
    );
    if (nextIndex === undefined) return;
    event.preventDefault();
    if (!isSortMenuOpen) {
      setIsSortMenuOpen(true);
      return;
    }
    items[nextIndex]?.focus();
  };

  return (
    <div ref={dropdownElement} className="flex items-center">
      <div className="relative inline-block text-left">
        <button
          ref={toggleElement}
          type="button"
          onClick={() => setIsSortMenuOpen((open) => !open)}
          onKeyDown={handleKeyDown}
          id={menuButtonId}
          aria-expanded={isSortMenuOpen}
          aria-haspopup="true"
          className="inline-flex justify-center items-center gap-2 rounded font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 px-4 py-3 text-base bg-transparent text-surface-on-surface-variant hover:text-surface-on-surface focus:ring-surface-on-surface group pr-0"
        >
          <span className="inline-flex items-center gap-1">
            {label}
            <ChevronDownIcon
              width={24}
              height={24}
              className={cx(
                "transition-transform",
                isSortMenuOpen && "rotate-180",
              )}
            />
          </span>
        </button>
        <div
          ref={menuElement}
          className={cx(
            isSortMenuOpen ? "absolute" : "hidden",
            "origin-top-right right-0 mt-2 w-40 rounded-md shadow-2xl bg-surface-surface ring-1 ring-outline-outline-variant focus:outline-hidden z-50",
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={menuButtonId}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          <div className="py-1" role="none">
            {sortOptions.map((sorting) => (
              <button
                key={sorting.key}
                type="button"
                onClick={(event) => handleSortingClick(sorting.key, event)}
                className={cx(
                  sorting.key === currentSort
                    ? "font-medium text-surface-on-surface"
                    : "text-surface-on-surface-variant",
                  "block w-full text-left px-4 py-2 text-sm bg-transparent hover:bg-surface-surface-container focus:outline-hidden focus:bg-surface-surface-container",
                )}
                role="menuitem"
                tabIndex={-1}
              >
                {sorting.translated?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
