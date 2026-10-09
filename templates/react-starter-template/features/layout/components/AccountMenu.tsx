"use client";

import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import { useSessionActions } from "@/features/session/components/SessionActionsContext";

const t = {
  "account.menu.signedInAs": "Signed in as {name}",
  "account.menu.logout": "Logout",
};

export type AccountMenuProps = {
  id: string;
  customerName: string | null;
  triggerRef: RefObject<HTMLElement | null>;
  onClose(): void;
};

export function AccountMenu({
  id,
  customerName,
  triggerRef,
  onClose,
}: AccountMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useSessionActions();
  const { notify } = useCmsActions();
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef(pathname);

  useEffect(() => {
    if (pathname !== openedAt.current) onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    const isInside = (target: EventTarget | null) =>
      target instanceof Node &&
      (panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      if (!active || active === document.body || isInside(active)) {
        triggerRef.current?.focus();
      }
      onClose();
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!isInside(event.target)) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [triggerRef, onClose]);

  async function handleLogout() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    try {
      const result = await logout();
      if (!result.ok) return;
      router.push("/");
      triggerRef.current?.focus();
      onClose();
    } catch (cause) {
      notify({
        type: "error",
        message: cause instanceof Error ? cause.message : String(cause),
      });
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return (
    <div
      ref={panelRef}
      id={id}
      data-testid="header-account-menu"
      className="absolute top-full right-0 z-20 mt-2 flex w-max max-w-44 flex-col gap-3 border border-outline-outline-variant bg-surface-surface px-6 py-4 sm:max-w-xs"
    >
      {customerName ? (
        <p className="text-sm wrap-break-word text-surface-on-surface-variant">
          {t["account.menu.signedInAs"].replace("{name}", () => customerName)}
        </p>
      ) : null}
      <button
        type="button"
        data-testid="header-account-logout-button"
        aria-busy={pending}
        aria-disabled={pending || undefined}
        className="-mt-px self-start border-b border-transparent bg-transparent text-left text-other-sale hover:border-other-sale aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        onClick={() => {
          void handleLogout();
        }}
      >
        {t["account.menu.logout"]}
      </button>
    </div>
  );
}
