import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { useEffect } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { interact, mount } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { cart } from "../cart.fixture";
import type { CartActionError } from "../cartErrors";
import type { CartReadResult } from "../types";
import { cartView, fakeCart } from "./cartView.fixture";
import { useCartRefresh } from "./useCartRefresh";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("./cartView.fixture")).useFakeCart,
}));

const blocked: CartActionError = {
  messageKey: "shipping-method-blocked",
  params: { name: "Express" },
  key: "shipping-method-blocked-Express",
  level: 10,
};
const stock: CartActionError = {
  messageKey: "product-stock-reached",
  params: { name: "Lamp", quantity: 3 },
  key: "product-stock-reachedline-1",
  level: 10,
};

const harness: { refresh?: () => Promise<CartReadResult> } = {};

function Probe() {
  const refresh = useCartRefresh();
  useEffect(() => {
    harness.refresh = refresh;
  }, [refresh]);
  return null;
}

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  harness.refresh = undefined;
});

async function setup(refreshWithResult: () => Promise<CartReadResult>) {
  const read = vi.fn(refreshWithResult);
  fakeCart.set(cartView({ status: "ready", refreshWithResult: read }));
  const notify = vi.fn();
  mounted = await mount(
    <CmsActionsProvider actions={{ notify }}>
      <Probe />
    </CmsActionsProvider>,
  );
  const refresh = (): Promise<CartReadResult> => {
    if (!harness.refresh) throw new Error("No refresh");
    return harness.refresh();
  };
  return { notify, read, refresh };
}

describe("useCartRefresh", () => {
  it("re-reads the cart, reports only the new errors and resolves the read", async () => {
    const result: CartReadResult = {
      ok: true,
      cart: cart(),
      errors: [blocked, stock],
      newErrors: [stock],
    };
    const { notify, read, refresh } = await setup(async () => result);

    let resolved: CartReadResult | undefined;
    await interact(() => {
      void refresh().then((value) => {
        resolved = value;
      });
    });

    await vi.waitFor(() => expect(resolved).toBe(result));
    expect(read).toHaveBeenCalledTimes(1);
    expect(notify.mock.calls).toEqual([
      [
        {
          type: "warning",
          message: "The product Lamp is only available 3 times",
        },
      ],
    ]);
  });

  it("reports a read that two refreshes joined once", async () => {
    const result: CartReadResult = {
      ok: true,
      cart: cart(),
      errors: [stock],
      newErrors: [stock],
    };
    const { notify, refresh } = await setup(async () => result);

    await interact(() => {
      void Promise.all([refresh(), refresh()]);
    });

    await vi.waitFor(() => expect(notify).toHaveBeenCalled());
    await interact(async () => {
      await new Promise((settle) => setTimeout(settle, 0));
    });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("resolves a failed read without reporting it", async () => {
    const { notify, read, refresh } = await setup(async () => ({ ok: false }));

    let resolved: CartReadResult | undefined;
    await interact(() => {
      void refresh().then((value) => {
        resolved = value;
      });
    });

    await vi.waitFor(() => expect(resolved).toEqual({ ok: false }));
    expect(read).toHaveBeenCalledTimes(1);
    expect(notify).not.toHaveBeenCalled();
  });
});
