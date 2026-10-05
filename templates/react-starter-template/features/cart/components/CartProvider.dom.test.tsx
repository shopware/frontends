import { StrictMode, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient, Schemas } from "#shopware";
import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import {
  customer,
  salesChannelContext,
} from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import type { StorefrontSession } from "@/features/session/types";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { cart, cartPrice, lineItem } from "../cart.fixture";
import type { CartActionResult } from "../types";
import { useCart } from "../useCart";
import type { UseCartResult } from "../useCart";
import { CartProvider } from "./CartProvider";

const READ_CART = "readCart get /checkout/cart";
const ADD_LINE_ITEM = "addLineItem post /checkout/cart/line-item";

type Invocation = { operation: string; params: unknown };

function createBackend() {
  const backend = {
    invocations: [] as Invocation[],
    cart: cart(),
    afterAdd: cart(),
  };
  const client = {
    invoke: async (operation: string, params?: unknown) => {
      backend.invocations.push({ operation, params });
      if (operation === READ_CART) return { data: backend.cart, status: 200 };
      if (operation === ADD_LINE_ITEM) {
        backend.cart = backend.afterAdd;
        return { data: backend.cart, status: 200 };
      }
      throw new Error(`Unexpected operation ${operation}`);
    },
  } as unknown as ApiClient;
  const getClient = vi.fn(async () => client);
  return { backend, getClient };
}

const sessionControl: { set?: (session: StorefrontSession) => void } = {};

function ControlledSession({
  initial,
  children,
}: {
  initial: StorefrontSession;
  children: ReactNode;
}) {
  const [session, setSession] = useState(initial);
  useEffect(() => {
    sessionControl.set = setSession;
    return () => {
      sessionControl.set = undefined;
    };
  }, []);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

const harness: { cart: UseCartResult | null } = { cart: null };

function CartProbe() {
  const current = useCart();
  useEffect(() => {
    harness.cart = current;
  }, [current]);
  const { status, count, isEmpty, subtotal, totalPrice, lineItems } = current;
  return (
    <output data-testid="cart">
      {JSON.stringify({
        status,
        count,
        isEmpty,
        subtotal,
        totalPrice,
        lineItems: lineItems.length,
      })}
    </output>
  );
}

let mounted: Mounted | undefined;

beforeEach(() => {
  harness.cart = null;
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

const readySession = (current: Schemas["Customer"] | null = null) =>
  toStorefrontSession(salesChannelContext(current));

async function setup({
  initial = anonymousSession,
  wrap = (node: ReactNode) => node,
}: {
  initial?: StorefrontSession;
  wrap?: (node: ReactNode) => ReactNode;
} = {}) {
  const { backend, getClient } = createBackend();
  mounted = await mount(
    wrap(
      <ShopwareClientProvider getClient={getClient}>
        <ControlledSession initial={initial}>
          <CartProvider>
            <CartProbe />
          </CartProvider>
        </ControlledSession>
      </ShopwareClientProvider>,
    ),
  );
  const { container } = mounted;
  const view = () =>
    JSON.parse(
      query<HTMLOutputElement>(container, '[data-testid="cart"]').textContent ??
        "",
    );
  return { backend, getClient, view };
}

async function run(
  call: (current: UseCartResult) => Promise<CartActionResult>,
): Promise<CartActionResult> {
  const current = harness.cart;
  if (!current) throw new Error("No cart");
  let result: CartActionResult | undefined;
  await interact(() => {
    void call(current).then((value) => {
      result = value;
    });
  });
  await vi.waitFor(() => expect(result).toBeDefined());
  return result as CartActionResult;
}

describe("CartProvider", () => {
  it("stays loading until the session is read, then reads the cart once", async () => {
    const { backend, getClient, view } = await setup();
    backend.cart = cart({
      lineItems: [
        lineItem({ quantity: 2 }),
        lineItem({ id: "p", type: "promotion", good: false }),
      ],
      price: cartPrice(40, 44.99),
    });

    expect(view()).toEqual({
      status: "loading",
      count: 0,
      isEmpty: true,
      subtotal: 0,
      totalPrice: 0,
      lineItems: 0,
    });
    expect(getClient).not.toHaveBeenCalled();

    await interact(() => sessionControl.set?.(readySession()));

    await vi.waitFor(() => expect(view().status).toBe("ready"));
    expect(view()).toEqual({
      status: "ready",
      count: 2,
      isEmpty: false,
      subtotal: 40,
      totalPrice: 44.99,
      lineItems: 2,
    });
    expect(backend.invocations.map(({ operation }) => operation)).toEqual([
      READ_CART,
    ]);
  });

  it("reads the cart once under StrictMode", async () => {
    const { backend, view } = await setup({
      initial: readySession(),
      wrap: (node) => <StrictMode>{node}</StrictMode>,
    });

    await vi.waitFor(() => expect(view().status).toBe("ready"));
    await interact(async () => {
      await new Promise((settle) => setTimeout(settle, 0));
    });

    expect(backend.invocations).toHaveLength(1);
  });

  it("reads the cart again when the customer logs in", async () => {
    const { backend, view } = await setup({ initial: readySession() });
    await vi.waitFor(() => expect(view().status).toBe("ready"));
    backend.cart = cart({ lineItems: [lineItem({ quantity: 4 })] });

    await interact(() =>
      sessionControl.set?.(
        toStorefrontSession(salesChannelContext(customer(), "customer-token")),
      ),
    );

    await vi.waitFor(() => expect(view().count).toBe(4));
    expect(backend.invocations).toHaveLength(2);
  });

  it("does not read again when the session changes without a new customer or token", async () => {
    const { backend, view } = await setup({ initial: readySession() });
    await vi.waitFor(() => expect(view().status).toBe("ready"));

    await interact(() =>
      sessionControl.set?.({ ...readySession(), wishlistCount: 2 }),
    );

    expect(backend.invocations).toHaveLength(1);
  });

  it("adds a product and shows the returned cart without notifying", async () => {
    const { backend, view } = await setup({ initial: readySession() });
    await vi.waitFor(() => expect(view().status).toBe("ready"));
    backend.afterAdd = cart({ lineItems: [lineItem({ quantity: 3 })] });
    const firstRender = harness.cart;

    await expect(
      run((current) => current.addProduct({ id: "product-1", quantity: 3 })),
    ).resolves.toEqual({ ok: true, errors: [] });

    await vi.waitFor(() => expect(view().count).toBe(3));
    expect(backend.invocations[1]).toEqual({
      operation: ADD_LINE_ITEM,
      params: {
        body: {
          items: [
            {
              id: "product-1",
              referencedId: "product-1",
              quantity: 3,
              type: "product",
            },
          ],
        },
      },
    });
    expect(harness.cart).not.toBe(firstRender);
    expect(harness.cart?.addProduct).toBe(firstRender?.addProduct);
    expect(harness.cart?.removeItem).toBe(firstRender?.removeItem);
    expect(harness.cart?.changeQuantity).toBe(firstRender?.changeQuantity);
    expect(harness.cart?.refresh).toBe(firstRender?.refresh);
  });

  it("resolves a failed client as { ok: false } with the default message", async () => {
    const { getClient, view } = await setup({ initial: readySession() });
    await vi.waitFor(() => expect(view().status).toBe("ready"));
    getClient.mockRejectedValueOnce(new Error("config down"));

    const result = await run((current) =>
      current.addProduct({ id: "product-1" }),
    );

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/^Unfortunately, something went wrong/);
  });
});

describe("useCart without a CartProvider", () => {
  it("stays loading and resolves every action with { ok: false }", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mounted = await mount(<CartProbe />);
    const { container } = mounted;

    expect(
      JSON.parse(query(container, '[data-testid="cart"]').textContent ?? ""),
    ).toMatchObject({ status: "loading", count: 0, isEmpty: true });

    await expect(
      run((current) => current.addProduct({ id: "product-1" })),
    ).resolves.toEqual({ ok: false });
    await expect(run((current) => current.removeItem("x"))).resolves.toEqual({
      ok: false,
    });
    await expect(
      run((current) => current.changeQuantity("x", 2)),
    ).resolves.toEqual({ ok: false });
    expect(warn).toHaveBeenCalledTimes(3);
    expect(warn.mock.calls[0]?.[0]).toContain('"addProduct"');
  });
});
