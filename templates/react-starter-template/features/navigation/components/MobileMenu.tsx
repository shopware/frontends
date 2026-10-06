"use client";

import { IconButton, cx } from "@shopware/cms-base-layer-react/client";
import type { IconButtonProps } from "@shopware/cms-base-layer-react/client";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { ChevronUpIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { useTranslations } from "@/i18n/I18nProvider";

import type { NavigationNode } from "../navigationTree";
import { NavigationLink } from "./NavigationLink";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type BurgerButtonProps = Omit<
  IconButtonProps,
  "variant" | "children" | "aria-label"
>;

function BurgerButton({ className, ...props }: BurgerButtonProps) {
  const t = useTranslations();
  return (
    <IconButton
      {...props}
      variant="ghost"
      className={cx("lg:hidden", className)}
      aria-label={t("layout.sideMenu.open")}
    >
      <MenuIcon className="size-5 text-brand-primary" />
    </IconButton>
  );
}

export function MobileMenuPending({ className }: { className?: string }) {
  return <BurgerButton className={className} aria-busy="true" disabled />;
}

export function MobileMenu({
  tree,
  className,
}: {
  tree: NavigationNode[];
  className?: string;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDialogElement>(null);
  const drawerId = useId();

  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable =
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  return (
    <>
      <BurgerButton
        ref={burgerRef}
        className={className}
        aria-expanded={open}
        aria-controls={drawerId}
        onClick={() => setOpen(true)}
      />
      {open ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label={t("layout.sideMenu.close")}
            className="fixed inset-0 z-40 cursor-default bg-overlay-dark-high"
            onClick={close}
          />
          <dialog
            ref={panelRef}
            open
            id={drawerId}
            data-testid="sidebar-left"
            aria-modal="true"
            aria-label={t("layout.ariaLabels.sidebar")}
            className="fixed inset-y-0 left-0 right-auto z-40 m-0 flex h-auto max-h-none w-screen max-w-md flex-col bg-surface-surface p-0 text-surface-on-surface shadow-xl"
          >
            <div className="flex px-4 py-5">
              <IconButton
                ref={closeButtonRef}
                variant="ghost"
                className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-surface-on-surface"
                onClick={close}
              >
                <span className="sr-only">{t("layout.sideMenu.close")}</span>
                <CloseIcon className="size-3" />
              </IconButton>
            </div>
            <aside className="flex w-full flex-1 flex-col overflow-y-auto">
              <ul className="flex flex-col items-start space-y-2 px-2">
                {tree.map((node) => {
                  const hasChildren = node.children.length > 0;
                  const expanded = expandedIds.has(node.id);
                  const sublistId = `${drawerId}-${node.id}`;
                  return (
                    <li key={node.id} className="flex w-full flex-1 flex-col">
                      <div className="flex items-center">
                        <NavigationLink
                          node={node}
                          className="flex flex-1 items-center px-5 py-3 text-base font-normal break-all text-surface-on-surface"
                          onClick={close}
                        >
                          {node.name}
                        </NavigationLink>
                        {hasChildren ? (
                          <button
                            type="button"
                            className="flex size-12 items-center justify-center bg-transparent"
                            aria-label={
                              expanded
                                ? t("layout.sideMenu.hideSubcategories")
                                : t("layout.sideMenu.showSubcategories")
                            }
                            aria-expanded={expanded}
                            aria-controls={sublistId}
                            onClick={() => toggle(node.id)}
                          >
                            <ChevronUpIcon
                              className={cx(
                                "h-3 w-5 text-surface-on-surface transition-transform duration-300",
                                !expanded && "rotate-180",
                              )}
                            />
                          </button>
                        ) : null}
                      </div>
                      {hasChildren && expanded ? (
                        <ul id={sublistId} className="m-0 px-0 py-2">
                          {node.children.map((child) => (
                            <li key={child.id}>
                              <NavigationLink
                                node={child}
                                className="flex items-center p-3 pl-11 text-base font-normal break-all text-surface-on-surface-variant hover:bg-surface-surface-container"
                                onClick={close}
                              >
                                {child.name}
                              </NavigationLink>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </aside>
          </dialog>
        </>
      ) : null}
    </>
  );
}
