"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

export type CmsActionError = {
  messageKey: string;
  params?: Record<string, string | number | null | undefined>;
};

export type CmsActionResult = {
  ok: boolean;
  message?: string;
  errors?: CmsActionError[];
};

export type CmsApiViolation = {
  code?: string;
  detail?: string;
};

export type CmsReviewResult = CmsActionResult & {
  violations?: CmsApiViolation[];
};

export type CmsNotificationAction = {
  label: string;
  href: string;
};

export type CmsNotification = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  action?: CmsNotificationAction;
  timeout?: number;
};

export type CmsVariantResult = {
  productId: string;
  url?: string;
};

export type CmsActions = {
  addToCart(input: {
    productId: string;
    quantity?: number;
  }): Promise<CmsActionResult>;
  toggleWishlist(
    productId: string,
  ): Promise<CmsActionResult & { inWishlist?: boolean }>;
  isInWishlist(productId: string): boolean;
  findVariant(input: {
    productId: string;
    parentId?: string;
    options: string[];
    switchedGroup?: string;
  }): Promise<CmsVariantResult | null>;
  submitContactForm(input: Record<string, string>): Promise<CmsActionResult>;
  subscribeNewsletter(input: {
    email: string;
    option?: "subscribe" | "unsubscribe";
    firstName?: string;
    lastName?: string;
    salutationId?: string;
  }): Promise<CmsActionResult>;
  submitProductReview(input: {
    productId: string;
    title: string;
    content: string;
    points: number;
  }): Promise<CmsReviewResult>;
  notify(notification: CmsNotification): void;
};

const NOT_AVAILABLE = "This action is not available yet.";

function notImplemented(name: keyof CmsActions): CmsActionResult {
  console.warn(
    `[CMS] "${name}" is not wired up. Provide it through <CmsActionsProvider actions={...}>.`,
  );
  return { ok: false, message: NOT_AVAILABLE };
}

export const notImplementedCmsActions: CmsActions = {
  addToCart: async () => notImplemented("addToCart"),
  toggleWishlist: async () => notImplemented("toggleWishlist"),
  isInWishlist: () => false,
  findVariant: async () => {
    notImplemented("findVariant");
    return null;
  },
  submitContactForm: async () => notImplemented("submitContactForm"),
  subscribeNewsletter: async () => notImplemented("subscribeNewsletter"),
  submitProductReview: async () => notImplemented("submitProductReview"),
  notify: (notification) => {
    console.info(`[CMS] ${notification.type}: ${notification.message}`);
  },
};

const CmsActionsContext = createContext<CmsActions>(notImplementedCmsActions);

export type CmsActionsProviderProps = {
  actions: Partial<CmsActions>;
  children: ReactNode;
};

export function CmsActionsProvider({
  actions,
  children,
}: CmsActionsProviderProps) {
  const value = useMemo<CmsActions>(
    () => ({ ...notImplementedCmsActions, ...actions }),
    [actions],
  );
  return (
    <CmsActionsContext.Provider value={value}>
      {children}
    </CmsActionsContext.Provider>
  );
}

export function useCmsActions(): CmsActions {
  return useContext(CmsActionsContext);
}
