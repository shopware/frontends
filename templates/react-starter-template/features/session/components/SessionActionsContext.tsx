"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import type {
  RegistrationConfirmInput,
  RegistrationConfirmResult,
} from "../registrationConfirm";
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
  confirmRegistration(
    input: RegistrationConfirmInput,
  ): Promise<RegistrationConfirmResult>;
  logout(): Promise<SessionActionResult>;
  setCurrency(currencyId: string): Promise<SessionActionResult>;
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
  confirmRegistration: async () => {
    warnNotImplemented("confirmRegistration");
    return { status: "failed" };
  },
  logout: async () => notImplemented("logout"),
  setCurrency: async () => notImplemented("setCurrency"),
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
