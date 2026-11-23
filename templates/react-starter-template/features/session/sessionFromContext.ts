import type { Schemas } from "#shopware";

import { anonymousSession } from "./anonymousSession";
import type { StorefrontSession } from "./types";

type SessionCustomer = Pick<
  Schemas["Customer"],
  "id" | "active" | "guest" | "firstName" | "lastName"
>;

export const unavailableSession: StorefrontSession = {
  ...anonymousSession,
  status: "error",
};

export function isLoggedInCustomer(
  customer: SessionCustomer | null | undefined,
): customer is SessionCustomer {
  return !!customer?.id && !!customer.active && !customer.guest;
}

export function toStorefrontSession(
  context: Schemas["SalesChannelContext"],
): StorefrontSession {
  const { customer } = context;
  const session: StorefrontSession = {
    ...anonymousSession,
    status: "ready",
    isGuestSession: !!customer?.guest,
    context,
  };
  if (!isLoggedInCustomer(customer)) return session;
  return {
    ...session,
    isLoggedIn: true,
    customerName:
      [customer.firstName, customer.lastName].filter(Boolean).join(" ") || null,
  };
}
