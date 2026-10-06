"use client";

import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { useSessionActions } from "@/features/session/components/SessionActionsContext";

let logoutIntended = false;

export function takeLogoutIntent(): boolean {
  const intended = logoutIntended;
  logoutIntended = false;
  return intended;
}

export type AccountLogout = {
  pending: boolean;
  logout(): Promise<boolean>;
};

export function useAccountLogout(): AccountLogout {
  const router = useRouter();
  const { logout } = useSessionActions();
  const { notify } = useCmsActions();
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);

  const run = useCallback(async () => {
    if (pendingRef.current) return false;
    pendingRef.current = true;
    setPending(true);
    logoutIntended = true;
    let succeeded = false;
    try {
      const result = await logout();
      succeeded = result.ok;
      if (succeeded) router.push("/");
      return succeeded;
    } catch (cause) {
      notify({
        type: "error",
        message: cause instanceof Error ? cause.message : String(cause),
      });
      return false;
    } finally {
      if (!succeeded) logoutIntended = false;
      pendingRef.current = false;
      setPending(false);
    }
  }, [logout, notify, router]);

  return { pending, logout: run };
}
