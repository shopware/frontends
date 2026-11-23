import { describe, expect, it } from "vitest";

import { anonymousSession } from "@/features/session/anonymousSession";
import {
  customer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import type { StorefrontSession } from "@/features/session/types";

import { cmsCustomerState } from "./cmsCustomerState";

function session(overrides: Partial<StorefrontSession>): StorefrontSession {
  return { ...anonymousSession, status: "ready", ...overrides };
}

describe("cmsCustomerState", () => {
  it("is loading before the first /context read settled", () => {
    expect(cmsCustomerState(anonymousSession)).toEqual({ status: "loading" });
  });

  it.each(["ready", "error"] as const)(
    "is a guest when nobody is logged in and the session is %s",
    (status) => {
      expect(
        cmsCustomerState(
          session({ status, context: salesChannelContext(null) }),
        ),
      ).toEqual({ status: "guest" });
    },
  );

  it.each(["ready", "error"] as const)(
    "is the customer with the context's customer id when the session is %s",
    (status) => {
      expect(
        cmsCustomerState(
          session({
            status,
            isLoggedIn: true,
            context: salesChannelContext(customer({ id: "customer-7" })),
          }),
        ),
      ).toEqual({ status: "customer", customerId: "customer-7" });
    },
  );

  it("stays loading for a logged-in session without a customer id", () => {
    expect(
      cmsCustomerState(session({ isLoggedIn: true, context: null })),
    ).toEqual({ status: "loading" });
  });
});
