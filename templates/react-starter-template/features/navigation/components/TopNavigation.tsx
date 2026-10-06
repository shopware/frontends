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

const WRAPPER_CLASS = "relative border-b border-outline-outline-variant";
const NAV_CLASS = "mx-auto w-full max-w-screen-2xl px-4 pt-6 pb-4";
const LIST_CLASS = "flex min-h-[25px] gap-8";

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
                className={cx(
                  "border-b border-transparent text-surface-on-surface hover:border-surface-on-surface",
                  active && "border-surface-on-surface",
                )}
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
                  aria-haspopup={hasChildren ? "true" : undefined}
                  aria-expanded={hasChildren ? expanded : undefined}
                  aria-current={active ? "page" : undefined}
                  onFocus={() => open(node.id)}
                  onClick={close}
                >
                  {node.name}
                </NavigationLink>
                {expanded ? (
                  <div className="absolute inset-x-0 top-full z-10 w-full border-b border-outline-outline-variant bg-surface-surface">
                    <div className="mx-auto w-full max-w-screen-2xl columns-3 px-4 py-6">
                      {node.children.map((child) => (
                        <div
                          key={child.id}
                          className="mb-8 break-inside-avoid-column"
                        >
                          <NavigationLink
                            node={child}
                            role="menuitem"
                            className="mb-3 flex items-center gap-1 font-bold text-brand-primary"
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
                                    className="text-surface-on-surface hover:text-brand-primary"
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
