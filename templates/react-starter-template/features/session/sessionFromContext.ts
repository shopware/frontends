import type { Schemas } from "#shopware";

import { anonymousSession } from "./anonymousSession";
import type { StorefrontSession } from "./types";

type SessionCustomer = Pick<
  Schemas["Customer"],
  "id" | "active" | "guest" | "firstName" | "lastName"
>;

export type SessionContext = { customer?: SessionCustomer | null };

export const unavailableSession: StorefrontSession = {
  ...anonymousSession,
  status: "error",
};

export function isLoggedInCustomer(
  customer: SessionCustomer | null | undefined,
): customer is SessionCustomer {
  return !!customer?.id && !!customer.active && !customer.guest;
}

export function toStorefrontSession({
  customer,
}: SessionContext): StorefrontSession {
  if (!isLoggedInCustomer(customer)) {
    return { ...anonymousSession, status: "ready" };
  }
  return {
    status: "ready",
    isLoggedIn: true,
    customerName:
      [customer.firstName, customer.lastName].filter(Boolean).join(" ") || null,
    cartCount: 0,
    wishlistCount: 0,
  };
}
