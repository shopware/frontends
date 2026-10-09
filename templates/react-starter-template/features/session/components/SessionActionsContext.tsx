"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import { unavailableSession } from "../sessionFromContext";
import type {
  LoginInput,
  RegistrationInput,
  SessionActionResult,
  StorefrontSession,
} from "../types";

export type SessionActions = {
  login(input: LoginInput): Promise<SessionActionResult>;
  register(input: RegistrationInput): Promise<SessionActionResult>;
  logout(): Promise<SessionActionResult>;
  retrySession(): Promise<StorefrontSession>;
  refreshSession(): Promise<void>;
};

function warnNotImplemented(name: keyof SessionActions): void {
  console.warn(
    `[Session] "${name}" is not wired up. Provide it through <SessionActionsProvider actions={...}>.`,
  );
}

function notImplemented(name: keyof SessionActions): SessionActionResult {
  warnNotImplemented(name);
  return { ok: false };
}

export const notImplementedSessionActions: SessionActions = {
  login: async () => notImplemented("login"),
  register: async () => notImplemented("register"),
  logout: async () => notImplemented("logout"),
  retrySession: async () => {
    warnNotImplemented("retrySession");
    return unavailableSession;
  },
  refreshSession: async () => {
    warnNotImplemented("refreshSession");
  },
};

const SessionActionsContext = createContext<SessionActions>(
  notImplementedSessionActions,
);

export function SessionActionsProvider({
  actions,
  children,
}: {
  actions: Partial<SessionActions>;
  children: ReactNode;
}) {
  const value = useMemo<SessionActions>(
    () => ({ ...notImplementedSessionActions, ...actions }),
    [actions],
  );
  return (
    <SessionActionsContext value={value}>{children}</SessionActionsContext>
  );
}

export function useSessionActions(): SessionActions {
  return useContext(SessionActionsContext);
}
