import type { CmsActionError } from "@shopware/cms-base-layer-react/client";

import type { Schemas } from "#shopware";

export type CartActionResult = {
  ok: boolean;
  message?: string;
  errors?: CmsActionError[];
};

export type CartStatus = "loading" | "ready" | "error";

export type CartState = {
  status: CartStatus;
  cart: Schemas["Cart"] | null;
};
