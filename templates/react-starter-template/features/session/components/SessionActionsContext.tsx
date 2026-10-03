"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import type {
  LoginInput,
  RegistrationInput,
  SessionActionResult,
} from "../types";

export type SessionActions = {
  login(input: LoginInput): Promise<SessionActionResult>;
  register(input: RegistrationInput): Promise<SessionActionResult>;
  logout(): Promise<SessionActionResult>;
};

function notImplemented(name: keyof SessionActions): SessionActionResult {
  console.warn(
    `[Session] "${name}" is not wired up. Provide it through <SessionActionsProvider actions={...}>.`,
  );
  return { ok: false };
}

export const notImplementedSessionActions: SessionActions = {
  login: async () => notImplemented("login"),
  register: async () => notImplemented("register"),
  logout: async () => notImplemented("logout"),
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
