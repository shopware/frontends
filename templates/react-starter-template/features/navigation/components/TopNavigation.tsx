"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";

import { ChevronRightSmallIcon } from "@/components/icons";
import { stripLocale } from "@/i18n/config";
import { useTranslations } from "@/i18n/I18nProvider";

import type { NavigationNode } from "../navigationTree";
import { NavigationLink } from "./NavigationLink";

export function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function pagePath(path: string): string {
  return normalizePath(stripLocale(path).pathname);
}

const WRAPPER_CLASS = "relative bg-shell-ink text-shell-on-ink";
const NAV_CLASS = "mx-auto w-full max-w-screen-2xl px-4";
const LIST_CLASS = "flex min-h-12 justify-center-safe gap-x-6 overflow-x-auto";
const ITEM_CLASS =
  "flex min-h-12 items-center border-y-2 border-transparent px-2 text-sm font-semibold tracking-wide whitespace-nowrap uppercase transition-colors hover:border-b-shell-accent hover:text-shell-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shell-accent aria-expanded:border-b-shell-accent aria-expanded:text-shell-accent aria-[current=page]:border-b-shell-accent aria-[current=page]:text-shell-accent";
const FLYOUT_FOCUS_CLASS =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent-strong";

type OpenMenu = { id: string; pathname: string };

export function TopNavigationPlaceholder() {
  return (
    <div className={WRAPPER_CLASS} aria-hidden="true">
      <div className={NAV_CLASS}>
        <div className={LIST_CLASS} />
      </div>
    </div>
  );
}

export function TopNavigation({ tree }: { tree: NavigationNode[] }) {
  const pathname = usePathname();
  const t = useTranslations();
  const [menu, setMenu] = useState<OpenMenu>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  const currentPath = pagePath(pathname);
  const currentMenuPosition = menu?.pathname === pathname ? menu.id : undefined;

  const open = (id: string) => setMenu({ id, pathname });
  const close = () => setMenu(undefined);

  useEffect(() => {
    if (currentMenuPosition === undefined) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (wrapperRef.current?.contains(document.activeElement)) {
        itemRefs.current.get(currentMenuPosition)?.focus();
      }
      setMenu(undefined);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentMenuPosition]);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node) {
      if (!event.currentTarget.contains(next)) close();
      return;
    }
    if (!event.currentTarget.matches(":hover")) close();
  };

  return (
    <div
      ref={wrapperRef}
      className={WRAPPER_CLASS}
      onMouseLeave={close}
      onBlur={handleBlur}
    >
      <nav
        aria-label={t("layout.ariaLabels.mainNavigation")}
        className={NAV_CLASS}
      >
        <ul role="menubar" className={LIST_CLASS}>
          {tree.map((node) => {
            const hasChildren = node.children.length > 0;
            const active = pagePath(node.href) === currentPath;
            const expanded = hasChildren && currentMenuPosition === node.id;
            return (
              <li
                key={node.id}
                role="none"
                className="flex shrink-0"
                onMouseEnter={() => open(node.id)}
              >
                <NavigationLink
                  ref={(element) => {
                    if (element) {
                      itemRefs.current.set(node.id, element);
                    } else {
                      itemRefs.current.delete(node.id);
                    }
                  }}
                  node={node}
                  role="menuitem"
                  className={ITEM_CLASS}
                  aria-haspopup={hasChildren ? "true" : undefined}
                  aria-expanded={hasChildren ? expanded : undefined}
                  aria-current={active ? "page" : undefined}
                  onFocus={() => open(node.id)}
                  onClick={close}
                >
                  {node.name}
                </NavigationLink>
                {expanded ? (
                  <div className="absolute inset-x-0 top-full z-10 max-h-[calc(100dvh_-_var(--sticky-header-height))] w-full overflow-y-auto overscroll-contain border-t-2 border-shell-accent bg-shell-sand text-shell-ink shadow-lg">
                    <div className="mx-auto w-full max-w-screen-2xl columns-3 gap-10 px-4 py-8">
                      {node.children.map((child) => (
                        <div
                          key={child.id}
                          className="mb-8 break-inside-avoid-column"
                        >
                          <NavigationLink
                            node={child}
                            role="menuitem"
                            className={cx(
                              "mb-3 flex w-fit items-center gap-1 font-semibold text-shell-ink hover:text-shell-accent-strong",
                              FLYOUT_FOCUS_CLASS,
                            )}
                            onClick={close}
                          >
                            {child.name}
                            {child.children.length > 0 ? (
                              <ChevronRightSmallIcon className="h-2.5 w-1.5 shrink-0" />
                            ) : null}
                          </NavigationLink>
                          {child.children.length > 0 ? (
                            <ul className="flex flex-col gap-3">
                              {child.children.map((grandChild) => (
                                <li key={grandChild.id}>
                                  <NavigationLink
                                    node={grandChild}
                                    role="menuitem"
                                    className={cx(
                                      "text-surface-on-surface hover:text-shell-accent-strong",
                                      FLYOUT_FOCUS_CLASS,
                                    )}
                                    onClick={close}
                                  >
                                    {grandChild.name}
                                  </NavigationLink>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
