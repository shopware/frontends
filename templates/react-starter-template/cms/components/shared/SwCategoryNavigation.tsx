"use client";

import { useState } from "react";

import type { CategoryNavigationItem } from "./categoryNavigation";
import { SwCategoryNavigationLink } from "./SwCategoryNavigationLink";

export type SwCategoryNavigationProps = {
  elements: CategoryNavigationItem[];
  activeCategoryId?: string;
  level?: number;
};

export function SwCategoryNavigation({
  elements,
  activeCategoryId,
  level = 0,
}: SwCategoryNavigationProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(),
  );

  const isActive = (navigationElement: CategoryNavigationItem) =>
    navigationElement.id === activeCategoryId;

  const isExpanded = (id: string) => expandedItems.has(id);

  const toggleExpanded = (id: string) => {
    setExpandedItems((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (elements.length === 0) return null;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {elements.map((navigationElement) => (
        <div key={navigationElement.id} className="w-full">
          <SwCategoryNavigationLink
            navigationElement={navigationElement}
            isActive={isActive(navigationElement)}
            isExpanded={isExpanded(navigationElement.id)}
            level={level}
            onToggle={() => toggleExpanded(navigationElement.id)}
          />
          {navigationElement.children.length > 0 &&
          isExpanded(navigationElement.id) ? (
            <div className="self-stretch flex flex-col justify-start items-start">
              <SwCategoryNavigation
                elements={navigationElement.children}
                activeCategoryId={activeCategoryId}
                level={level + 1}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
