import type { operations } from "#shopware";

export type SessionStatus = "loading" | "ready" | "error";

export type StorefrontSession = {
  status: SessionStatus;
  isLoggedIn: boolean;
  customerName: string | null;
  cartCount: number;
  wishlistCount: number;
};

export type LoginInput = { username: string; password: string };

export type RegistrationInput = Omit<
  operations["register post /account/register"]["body"],
  "storefrontUrl"
>;

export type SessionActionResult = {
  ok: boolean;
  message?: string;
  doubleOptIn?: boolean;
};
