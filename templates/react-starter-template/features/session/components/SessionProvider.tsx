"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { anonymousSession } from "../anonymousSession";
import type { StorefrontSession } from "../types";

const SessionContext = createContext<StorefrontSession>(anonymousSession);

export function SessionProvider({
  session = anonymousSession,
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
