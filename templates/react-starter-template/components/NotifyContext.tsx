"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import type { CmsNotification } from "@/cms/client";

export type Notify = (notification: CmsNotification) => void;

function logNotification(notification: CmsNotification): void {
  console.info(`[Notify] ${notification.type}: ${notification.message}`);
}

const NotifyContext = createContext<Notify>(logNotification);

export function NotifyProvider({
  notify,
  children,
}: {
  notify: Notify;
  children: ReactNode;
}) {
  return <NotifyContext value={notify}>{children}</NotifyContext>;
}

export function useNotify(): Notify {
  return useContext(NotifyContext);
}
