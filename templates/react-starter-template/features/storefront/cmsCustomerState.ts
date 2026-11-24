import type { CmsCustomerState } from "@/cms/client";
import type { StorefrontSession } from "@/features/session/types";

const LOADING: CmsCustomerState = { status: "loading" };
const GUEST: CmsCustomerState = { status: "guest" };

export function cmsCustomerState(session: StorefrontSession): CmsCustomerState {
  if (session.status === "loading") return LOADING;
  if (!session.isLoggedIn) return GUEST;
  const customerId = session.context?.customer?.id;
  return customerId ? { status: "customer", customerId } : LOADING;
}
