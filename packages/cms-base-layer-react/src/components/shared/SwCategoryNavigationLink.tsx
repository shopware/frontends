"use client";

import Link from "next/link";

import { cx } from "../../helpers/cx";
import { ChevronDownIcon } from "../icons";
import type { CategoryNavigationItem } from "./categoryNavigation";

export type SwCategoryNavigationLinkProps = {
  navigationElement: CategoryNavigationItem;
  isActive?: boolean;
  isExpanded?: boolean;
  level?: number;
  onToggle?: () => void;
};

export function SwCategoryNavigationLink({
  navigationElement,
  isActive = false,
  isExpanded = false,
  level = 0,
  onToggle,
}: SwCategoryNavigationLinkProps) {
  const hasChildren = navigationElement.children.length > 0;
  const linkClassName =
    level === 0
      ? "flex-1 justify-start text-surface-on-surface text-base leading-normal font-bold"
      : cx(
          "justify-start text-surface-on-surface text-base leading-normal",
          isActive ? "font-bold" : "font-normal",
        );

  const link = navigationElement.external ? (
    <a
      href={navigationElement.href}
      className={linkClassName}
      target={navigationElement.newTab ? "_blank" : undefined}
    >
      {navigationElement.name}
    </a>
  ) : (
    <Link href={navigationElement.href} className={linkClassName}>
      {navigationElement.name}
    </Link>
  );

  const toggle = hasChildren ? (
    <button
      type="button"
      onClick={onToggle}
      className="w-6 h-6 relative flex items-center justify-center bg-transparent cursor-pointer focus:outline-hidden"
      aria-label={isExpanded ? "Collapse" : "Expand"}
    >
      <ChevronDownIcon
        width={20}
        height={20}
        className={cx("transition-transform", isExpanded && "rotate-180")}
      />
    </button>
  ) : null;

  if (level === 0) {
    return (
      <div className="self-stretch flex flex-col justify-center items-center">
        <div className="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1">
          <div className="flex-1 flex justify-start items-center gap-2.5">
            {link}
          </div>
          {toggle}
        </div>
      </div>
    );
  }

  return (
    <div className="self-stretch flex flex-col justify-center items-center">
      <div className="self-stretch pl-4 py-1.5 inline-flex justify-start items-center gap-2">
        <div className="py-0.5 flex-1 flex justify-start items-center gap-2.5">
          {link}
        </div>
        {toggle}
      </div>
    </div>
  );
}
