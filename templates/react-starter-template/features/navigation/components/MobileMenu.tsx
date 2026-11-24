"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ComponentProps } from "react";

import { cx } from "@/cms/client";
import { ChevronUpIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { HEADER_ACTION_ICON_CLASS } from "@/features/layout/headerAction";
import { useTranslations } from "@/i18n/I18nProvider";

import type { NavigationNode } from "../navigationTree";
import { NavigationLink } from "./NavigationLink";

const ROW_FOCUS_CLASS =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shell-ink";

type BurgerButtonProps = Omit<
  ComponentProps<"button">,
  "type" | "children" | "aria-label"
>;

function BurgerButton({ className, ...props }: BurgerButtonProps) {
  const t = useTranslations();
  return (
    <button
      {...props}
      type="button"
      className={cx(
        "aria-busy:cursor-progress aria-busy:opacity-50 lg:hidden",
        className,
      )}
      aria-label={t("layout.sideMenu.open")}
    >
      <MenuIcon className={HEADER_ACTION_ICON_CLASS} />
    </button>
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
    panelRef.current?.close();
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
    panelRef.current?.showModal();
    closeButtonRef.current?.focus();
  }, [open]);

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
        <dialog
          ref={panelRef}
          id={drawerId}
          data-testid="sidebar-left"
          aria-label={t("layout.ariaLabels.sidebar")}
          className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label={t("layout.sideMenu.close")}
            className="fixed inset-0 cursor-default bg-overlay-dark-high"
            onClick={close}
          />
          <div className="fixed inset-y-0 left-0 flex w-screen max-w-md flex-col bg-surface-surface text-surface-on-surface shadow-xl">
            <div className="flex items-center justify-between gap-4 bg-shell-ink px-4 py-4 text-shell-on-ink">
              <img
                src="/logo-white.svg"
                alt=""
                width={93}
                height={39}
                className="h-8 w-auto"
              />
              <button
                ref={closeButtonRef}
                type="button"
                className="-m-1 inline-flex items-center justify-center rounded-md p-2.5 text-shell-on-ink transition-colors hover:bg-shell-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
                onClick={close}
              >
                <span className="sr-only">{t("layout.sideMenu.close")}</span>
                <CloseIcon className="size-3.5" />
              </button>
            </div>
            <nav
              aria-label={t("layout.ariaLabels.mainNavigation")}
              className="flex w-full flex-1 flex-col overflow-y-auto"
            >
              <ul className="flex flex-col">
                {tree.map((node) => {
                  const hasChildren = node.children.length > 0;
                  const expanded = expandedIds.has(node.id);
                  const sublistId = `${drawerId}-${node.id}`;
                  return (
                    <li
                      key={node.id}
                      className="flex w-full flex-col border-b border-shell-line"
                    >
                      <div className="flex items-center">
                        <NavigationLink
                          node={node}
                          className={cx(
                            "flex flex-1 items-center px-5 py-3.5 text-base font-medium break-all text-shell-ink transition-colors hover:bg-shell-sand",
                            ROW_FOCUS_CLASS,
                          )}
                          onClick={close}
                        >
                          {node.name}
                        </NavigationLink>
                        {hasChildren ? (
                          <button
                            type="button"
                            className={cx(
                              "flex size-12 shrink-0 items-center justify-center bg-transparent text-shell-ink transition-colors hover:bg-shell-sand aria-expanded:bg-shell-sand",
                              ROW_FOCUS_CLASS,
                            )}
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
                                "h-3 w-5 transition-transform duration-300",
                                !expanded && "rotate-180",
                              )}
                            />
                          </button>
                        ) : null}
                      </div>
                      {hasChildren && expanded ? (
                        <ul
                          id={sublistId}
                          className="m-0 bg-shell-sand px-0 py-2"
                        >
                          {node.children.map((child) => (
                            <li key={child.id}>
                              <NavigationLink
                                node={child}
                                className={cx(
                                  "flex items-center p-3 pl-11 text-base font-normal break-all text-surface-on-surface transition-colors hover:bg-shell-sand-strong",
                                  ROW_FOCUS_CLASS,
                                )}
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
            </nav>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
