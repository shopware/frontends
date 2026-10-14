import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { Activity, StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { interact, mount } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { cart, cartError } from "../cart.fixture";
import { toCartActionErrors } from "../cartErrors";
import type { CartReadResult } from "../types";
import { cartView, fakeCart } from "./cartView.fixture";
import type { CartView } from "./cartView.fixture";
import { useCartLoadNotices } from "./useCartLoadNotices";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("./cartView.fixture")).useFakeCart,
}));

const blocked = cartError(
  "shipping-method-blocked",
  "-Express",
  "shipping-method-blocked-Express",
  10,
);
const notEligible = cartError("promotion-not-eligible", "", "", 0);
const blockedCart = cart({
  errors: { [blocked.key]: blocked, [notEligible.key]: notEligible },
});

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

function Probe() {
  useCartLoadNotices();
  return null;
}

const blockedError = {
  messageKey: "shipping-method-blocked",
  params: { name: "Express" },
  key: blocked.key,
  level: 10 as const,
};

async function readBlocked(): Promise<CartReadResult> {
  return {
    ok: true,
    cart: blockedCart,
    errors: [blockedError],
    newErrors: [blockedError],
  };
}

function joinedReads(
  read: () => Promise<CartReadResult>,
): () => Promise<CartReadResult> {
  let queued: Promise<CartReadResult> | null = null;
  return () => {
    if (queued) return queued;
    const next = read();
    queued = next;
    queueMicrotask(() => {
      queued = null;
    });
    return next;
  };
}

function fakeReads(
  view: Partial<CartView>,
  read: () => Promise<CartReadResult>,
) {
  const reads = vi.fn(read);
  const refreshWithResult = vi.fn(joinedReads(reads));
  const refresh = vi.fn(async () => {});
  fakeCart.set(cartView({ refreshWithResult, refresh, ...view }));
  return { reads, refreshWithResult, refresh };
}

async function setup(
  view: Partial<CartView>,
  read: () => Promise<CartReadResult> = readBlocked,
) {
  const fakes = fakeReads(view, read);
  const notify = vi.fn();
  mounted = await mount(
    <StrictMode>
      <CmsActionsProvider actions={{ notify }}>
        <Probe />
      </CmsActionsProvider>
    </StrictMode>,
  );
  return { notify, ...fakes };
}

async function setupInActivity(
  view: Partial<CartView>,
  read: () => Promise<CartReadResult> = readBlocked,
) {
  const fakes = fakeReads(view, read);
  const notify = vi.fn();
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const show = (mode: "visible" | "hidden") =>
    act(async () => {
      root.render(
        <StrictMode>
          <CmsActionsProvider actions={{ notify }}>
            <Activity mode={mode}>
              <Probe />
            </Activity>
          </CmsActionsProvider>
        </StrictMode>,
      );
    });
  mounted = {
    container,
    async unmount() {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
  await show("visible");
  return { notify, show, ...fakes };
}

describe("useCartLoadNotices", () => {
  it("reads a cart that is already there once and reports the errors of that read", async () => {
    const { notify, reads, refresh } = await setup({
      status: "ready",
      cart: cart(),
    });

    await vi.waitFor(() => expect(notify).toHaveBeenCalled());
    expect(reads).toHaveBeenCalledTimes(1);
    expect(refresh).not.toHaveBeenCalled();
    expect(notify.mock.calls).toEqual([
      [
        {
          type: "warning",
          message:
            "The shipping method Express is blocked for your current shopping cart.",
        },
      ],
    ]);
  });

  it("waits for the first read of a loading cart and reports its errors once", async () => {
    const { notify, refreshWithResult } = await setup({ status: "loading" });

    expect(refreshWithResult).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();

    await interact(() =>
      fakeCart.set(cartView({ status: "ready", cart: blockedCart })),
    );

    expect(notify.mock.calls.map(([call]) => call.type)).toEqual([
      "warning",
      "info",
    ]);

    await interact(() =>
      fakeCart.set(cartView({ status: "ready", cart: cart() })),
    );
    await interact(() =>
      fakeCart.set(cartView({ status: "ready", cart: blockedCart })),
    );

    expect(notify).toHaveBeenCalledTimes(2);
    expect(refreshWithResult).not.toHaveBeenCalled();
  });

  it("keeps waiting while the first read fails", async () => {
    const { notify } = await setup({ status: "loading" });

    await interact(() =>
      fakeCart.set(cartView({ status: "error", cart: null })),
    );
    expect(notify).not.toHaveBeenCalled();

    await interact(() =>
      fakeCart.set(cartView({ status: "ready", cart: blockedCart })),
    );
    expect(notify).toHaveBeenCalledTimes(2);
  });

  it("reads a cart that failed before the page opened once more", async () => {
    const { notify, reads } = await setup(
      { status: "error", cart: null },
      async () => ({ ok: false }),
    );

    await vi.waitFor(() => expect(reads).toHaveBeenCalledTimes(1));
    await interact(() => {});
    expect(notify).not.toHaveBeenCalled();
  });

  it("reports nothing after the page unmounted", async () => {
    const read = deferred<CartReadResult>();
    const { notify, reads } = await setup(
      { status: "ready", cart: cart() },
      () => read.promise,
    );
    expect(reads).toHaveBeenCalledTimes(1);

    await mounted?.unmount();
    mounted = undefined;
    read.resolve({
      ok: true,
      cart: blockedCart,
      errors: toCartActionErrors(blockedCart),
      newErrors: toCartActionErrors(blockedCart),
    });
    await read.promise;
    await new Promise((settle) => setTimeout(settle, 0));

    expect(notify).not.toHaveBeenCalled();
  });

  it("reads again and reports once each time a hidden page is revealed", async () => {
    const { notify, reads, show } = await setupInActivity({
      status: "ready",
      cart: cart(),
    });
    await vi.waitFor(() => expect(notify).toHaveBeenCalledTimes(1));
    expect(reads).toHaveBeenCalledTimes(1);

    await show("hidden");
    expect(reads).toHaveBeenCalledTimes(1);

    await show("visible");
    await vi.waitFor(() => expect(notify).toHaveBeenCalledTimes(2));
    expect(reads).toHaveBeenCalledTimes(2);

    await show("hidden");
    await show("visible");
    await vi.waitFor(() => expect(notify).toHaveBeenCalledTimes(3));
    expect(reads).toHaveBeenCalledTimes(3);
    expect(notify).toHaveBeenLastCalledWith({
      type: "warning",
      message:
        "The shipping method Express is blocked for your current shopping cart.",
    });
  });

  it("reports nothing for a read that a hidden page left behind", async () => {
    const read = deferred<CartReadResult>();
    const { notify, reads, show } = await setupInActivity(
      { status: "ready", cart: cart() },
      () => read.promise,
    );
    expect(reads).toHaveBeenCalledTimes(1);

    await show("hidden");
    await act(async () => {
      read.resolve(await readBlocked());
    });

    expect(notify).not.toHaveBeenCalled();
  });

  it("does not report a read that resolves nothing", async () => {
    const { notify, refreshWithResult } = await setup(
      { status: "ready", cart: cart() },
      async () => undefined as unknown as CartReadResult,
    );

    await vi.waitFor(() => expect(refreshWithResult).toHaveBeenCalled());
    await interact(() => {});
    expect(notify).not.toHaveBeenCalled();
  });
});
