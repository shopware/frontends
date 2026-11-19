"use client";

import { createContext, useContext, useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { cx } from "@/cms/client";

export type ModalProps = {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

export const ModalHostContext = createContext<
  (host: HTMLDialogElement | null) => void
>(() => {});

export function Modal({ open, ...props }: ModalProps) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(<ModalPanel {...props} />, document.body);
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
  const setHost = useContext(ModalHostContext);

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
    panel.showModal();
    setHost(panel);
    panel.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onCloseRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      setHost(null);
      panel.close();
      if (previous?.isConnected) previous.focus();
    };
  }, [setHost]);

  return (
    <dialog
      ref={panelRef}
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      data-testid={testId}
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 focus:outline-hidden"
      onCancel={(event) => {
        event.preventDefault();
        onCloseRef.current();
      }}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <button
          type="button"
          tabIndex={-1}
          aria-label={closeLabel}
          className="fixed inset-0 cursor-default bg-overlay-dark-high"
          onClick={() => onCloseRef.current()}
        />
        <div
          className={cx(
            "relative w-full max-w-md rounded-lg bg-surface-surface p-8 text-left text-surface-on-surface shadow-xl",
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
        </div>
      </div>
    </dialog>
  );
}
