"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { mockSession } from "../mockSession";
import type { StorefrontSession } from "../types";

const SessionContext = createContext<StorefrontSession>(mockSession);

export function SessionProvider({
  session = mockSession,
  children,
}: {
  session?: StorefrontSession;
  children: ReactNode;
}) {
  return <SessionContext value={session}>{children}</SessionContext>;
}

export function useSession(): StorefrontSession {
  return useContext(SessionContext);
}
