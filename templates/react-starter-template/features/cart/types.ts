import type { Schemas } from "#shopware";

import type { CartActionError } from "./cartErrors";

export type CartActionResult = {
  ok: boolean;
  message?: string;
  errors?: CartActionError[];
};

export type PromotionCodeResult = CartActionResult & { applied: boolean };

export type CartReadResult =
  | {
      ok: true;
      cart: Schemas["Cart"];
      errors: CartActionError[];
      newErrors: CartActionError[];
    }
  | { ok: false };

export type CartStatus = "loading" | "ready" | "error";

export type CartState = {
  status: CartStatus;
  cart: Schemas["Cart"] | null;
};
