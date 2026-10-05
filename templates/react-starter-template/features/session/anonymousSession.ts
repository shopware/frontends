import type { StorefrontSession } from "./types";

export const anonymousSession: StorefrontSession = {
  status: "loading",
  isLoggedIn: false,
  isGuestSession: false,
  customerName: null,
  wishlistCount: 0,
  context: null,
};
