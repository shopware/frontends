"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import type { Schemas } from "#shopware";

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

export type CmsFormViolation = {
  field?: string;
  code?: string;
  message: string;
};

export type CmsFormResult = CmsActionResult & {
  violations?: CmsFormViolation[];
};

export type CmsContactFormEntityName = "category" | "product" | "landing_page";

export type CmsContactFormInput = {
  salutationId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  comment: string;
  navigationId?: string;
  entityName?: CmsContactFormEntityName;
  slotId?: string;
};

export type CmsContactFormResult = CmsFormResult & { successMessage?: string };

export type CmsNewsletterInput = {
  email: string;
  option?: "subscribe" | "unsubscribe";
  firstName?: string;
  lastName?: string;
  salutationId?: string;
};

export type CmsNewsletterResult = CmsFormResult & {
  status?: Schemas["NewsletterStatus"];
};

export type CmsProductReviewsResult = CmsActionResult & {
  reviews?: Schemas["ProductReview"][];
  total?: number;
  page?: number;
  limit?: number | null;
};

export type CmsCustomerState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "customer"; customerId: string };

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

export type CmsFindVariantResult = CmsActionResult & {
  variant?: CmsVariantResult;
  notFound?: boolean;
  cancelled?: boolean;
};

export type CmsFindVariantInput = {
  productId: string;
  parentId?: string;
  options: Record<string, string>;
  switchedGroup?: string;
  signal?: AbortSignal;
};

export type CmsActions = {
  addToCart(input: {
    productId: string;
    quantity?: number;
  }): Promise<CmsActionResult>;
  toggleWishlist(
    productId: string,
  ): Promise<CmsActionResult & { inWishlist?: boolean; cancelled?: boolean }>;
  isInWishlist(productId: string): boolean;
  findVariant(input: CmsFindVariantInput): Promise<CmsFindVariantResult>;
  submitContactForm(input: CmsContactFormInput): Promise<CmsContactFormResult>;
  subscribeNewsletter(input: CmsNewsletterInput): Promise<CmsNewsletterResult>;
  submitProductReview(input: {
    productId: string;
    title: string;
    content: string;
    points: number;
  }): Promise<CmsReviewResult>;
  loadProductReviews(input: {
    productId: string;
    page?: number;
    limit?: number;
  }): Promise<CmsProductReviewsResult>;
  getCustomerState(): CmsCustomerState | null;
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
  findVariant: async () => notImplemented("findVariant"),
  submitContactForm: async () => notImplemented("submitContactForm"),
  subscribeNewsletter: async () => notImplemented("subscribeNewsletter"),
  submitProductReview: async () => notImplemented("submitProductReview"),
  loadProductReviews: async () => notImplemented("loadProductReviews"),
  getCustomerState: () => null,
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
