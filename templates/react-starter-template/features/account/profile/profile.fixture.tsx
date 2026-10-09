import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type { CmsNotification } from "@shopware/cms-base-layer-react/client";
import type { ReactNode } from "react";

import type { Schemas } from "#shopware";
import type { CheckoutClient } from "@/features/checkout/checkoutApi";
import { ShopwareClientHarness } from "@/features/checkout/checkoutTestDoubles";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import {
  customer as sessionCustomer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import type { StorefrontSession } from "@/features/session/types";

export function profileCustomer(
  overrides: Record<string, unknown> = {},
): Schemas["Customer"] {
  return sessionCustomer({
    accountType: "private",
    salutationId: "salutation-mr",
    title: "",
    ...overrides,
  } as Partial<Schemas["Customer"]>);
}

export function businessCustomer(
  overrides: Record<string, unknown> = {},
): Schemas["Customer"] {
  return profileCustomer({
    accountType: "business",
    company: "Shopware AG",
    vatIds: ["DE123456789"],
    ...overrides,
  });
}

export const salutationOptions = [
  { label: "Mr.", value: "salutation-mr" },
  { label: "Mrs.", value: "salutation-mrs" },
];

export function loggedInSession(
  current: Schemas["Customer"] = profileCustomer(),
): StorefrontSession {
  return {
    status: "ready",
    isLoggedIn: true,
    isGuestSession: false,
    customerName: `${current.firstName} ${current.lastName}`,
    wishlistCount: 0,
    context: salesChannelContext(current),
  };
}

export type ProfileHarnessOptions = {
  client: CheckoutClient;
  notify: (notification: CmsNotification) => void;
  actions: Partial<SessionActions>;
  session?: StorefrontSession;
  children: ReactNode;
};

export function ProfileHarness({
  client,
  notify,
  actions,
  session = loggedInSession(),
  children,
}: ProfileHarnessOptions) {
  return (
    <CmsActionsProvider actions={{ notify }}>
      <SessionProvider session={session}>
        <SessionActionsProvider actions={actions}>
          <ShopwareClientHarness client={client}>
            {children}
          </ShopwareClientHarness>
        </SessionActionsProvider>
      </SessionProvider>
    </CmsActionsProvider>
  );
}
