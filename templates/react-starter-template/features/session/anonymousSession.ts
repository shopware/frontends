import type { StorefrontSession } from "./types";

export const anonymousSession: StorefrontSession = {
  status: "loading",
  isLoggedIn: false,
  customerName: null,
  cartCount: 0,
  wishlistCount: 0,
};
