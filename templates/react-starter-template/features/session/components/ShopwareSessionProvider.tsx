"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { useNotify } from "@/components/NotifyContext";

import { anonymousSession } from "../anonymousSession";
import { createSessionStore } from "../sessionStore";
import type { StorefrontSession } from "../types";
import { SessionActionsProvider } from "./SessionActionsContext";
import { SessionProvider } from "./SessionProvider";

export type ShopwareSessionProviderProps = {
  children: ReactNode;
};

function getServerSession(): StorefrontSession {
  return anonymousSession;
}

export function ShopwareSessionProvider({
  children,
}: ShopwareSessionProviderProps) {
  const notify = useNotify();
  const [store] = useState(createSessionStore);
  const session = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSession,
  );

  useEffect(() => {
    void store.start();
  }, [store]);

  const failed = session.status === "error";

  useEffect(() => {
    if (!failed) return;
    const retry = () => {
      if (document.visibilityState === "visible") void store.retry();
    };
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retry);
    return () => {
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [failed, store]);

  const actions = useMemo(() => store.createActions(notify), [store, notify]);

  return (
    <SessionProvider session={session}>
      <SessionActionsProvider actions={actions}>
        {children}
      </SessionActionsProvider>
    </SessionProvider>
  );
}
