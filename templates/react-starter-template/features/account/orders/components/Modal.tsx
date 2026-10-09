"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type ModalProps = {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

export function Modal({ open, ...props }: ModalProps) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(<ModalPanel {...props} />, document.body);
}

function focusableIn(panel: HTMLElement): HTMLElement[] {
  return [...panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
}

function ModalPanel({
  title,
  closeLabel,
  onClose,
  children,
  className,
  "data-testid": testId,
}: Omit<ModalProps, "open">) {
  const titleId = useId();
  const panelRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    panel.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = focusableIn(panel);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!first || !last) {
        event.preventDefault();
        panel.focus();
        return;
      }
      if (!panel.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label={closeLabel}
        className="fixed inset-0 cursor-default bg-overlay-dark-high"
        onClick={() => onCloseRef.current()}
      />
      <dialog
        ref={panelRef}
        open
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid={testId}
        className={cx(
          "relative m-0 w-full max-w-md rounded-lg bg-surface-surface p-8 text-left text-surface-on-surface shadow-xl focus:outline-hidden",
          className,
        )}
      >
        <h2
          id={titleId}
          className="mb-4 text-2xl font-bold text-surface-on-surface"
        >
          {title}
        </h2>
        {children}
      </dialog>
    </div>
  );
}
