import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { interact, mount, query, setInputValue } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { lineItem } from "./cartView.fixture";
import { CheckoutProductTile } from "./CheckoutProductTile";
import type { CheckoutProductTileProps } from "./CheckoutProductTile";

const itemControl: { set?: (item: Schemas["LineItem"]) => void } = {};

function ControlledTile({
  initial,
  ...props
}: Omit<CheckoutProductTileProps, "item"> & { initial: Schemas["LineItem"] }) {
  const [item, setItem] = useState(initial);
  useEffect(() => {
    itemControl.set = setItem;
    return () => {
      itemControl.set = undefined;
    };
  }, []);
  return <CheckoutProductTile item={item} {...props} />;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  itemControl.set = undefined;
});

async function setup(
  item: Schemas["LineItem"],
  onChangeQuantity: CheckoutProductTileProps["onChangeQuantity"] = vi.fn(
    async () => {},
  ),
) {
  const onRemove = vi.fn();
  mounted = await mount(
    <ControlledTile
      initial={item}
      onRemove={onRemove}
      onChangeQuantity={onChangeQuantity}
    />,
  );
  const { container } = mounted;
  return {
    container,
    onRemove,
    input: () =>
      query<HTMLInputElement>(container, '[data-testid="product-quantity"]'),
    increase: () =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Increase quantity"]',
      ),
    decrease: () =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Decrease quantity"]',
      ),
  };
}

describe("CheckoutProductTile in the browser", () => {
  it("removes the line item by its id", async () => {
    const { container, onRemove } = await setup(lineItem());

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="checkout-product-tile-remove-button"]',
      ).click(),
    );

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith("line-1");
  });

  it("changes the quantity and shows it while the change is pending", async () => {
    const request = deferred<void>();
    const onChangeQuantity = vi.fn(() => request.promise);
    const { increase, input } = await setup(lineItem(), onChangeQuantity);

    await interact(() => increase().click());

    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
    expect(onChangeQuantity).toHaveBeenCalledWith("line-1", 3);
    expect(input().value).toBe("3");

    await interact(() => {
      itemControl.set?.(lineItem({ quantity: 3 }));
      request.resolve();
    });

    expect(input().value).toBe("3");
  });

  it("falls back to the cart quantity when a change does not apply", async () => {
    const request = deferred<void>();
    const { increase, input } = await setup(lineItem(), () => request.promise);

    await interact(() => increase().click());
    expect(input().value).toBe("3");

    await interact(() => request.resolve());

    expect(input().value).toBe("2");
  });

  it("keeps the newest pending quantity when an older change settles", async () => {
    const first = deferred<void>();
    const second = deferred<void>();
    const onChangeQuantity = vi
      .fn<CheckoutProductTileProps["onChangeQuantity"]>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { increase, input } = await setup(lineItem(), onChangeQuantity);

    await interact(() => increase().click());
    await interact(() => increase().click());
    expect(onChangeQuantity).toHaveBeenNthCalledWith(1, "line-1", 3);
    expect(onChangeQuantity).toHaveBeenNthCalledWith(2, "line-1", 4);

    await interact(() => first.resolve());
    expect(input().value).toBe("4");

    await interact(() => {
      itemControl.set?.(lineItem({ quantity: 4 }));
      second.resolve();
    });
    expect(input().value).toBe("4");
  });

  it("keeps the quantity of a callback without a promise until the cart changes", async () => {
    const onChangeQuantity = vi.fn(() => {});
    const { increase, input } = await setup(lineItem(), onChangeQuantity);

    await interact(() => increase().click());
    expect(input().value).toBe("3");

    await interact(() => itemControl.set?.(lineItem({ quantity: 5 })));
    expect(input().value).toBe("5");
  });

  it("does not go below the minimum purchase", async () => {
    const onChangeQuantity = vi.fn(async () => {});
    const { decrease } = await setup(
      lineItem({
        quantity: 2,
        quantityInformation: { minPurchase: 2, maxPurchase: 10 },
      }),
      onChangeQuantity,
    );

    await interact(() => decrease().click());

    expect(onChangeQuantity).not.toHaveBeenCalled();
  });

  it("does not go above the maximum purchase", async () => {
    const onChangeQuantity = vi.fn(async () => {});
    const { increase, input } = await setup(
      lineItem({
        quantity: 10,
        quantityInformation: { minPurchase: 1, maxPurchase: 10 },
      }),
      onChangeQuantity,
    );

    await interact(() => increase().click());
    expect(onChangeQuantity).not.toHaveBeenCalled();

    await interact(() => setInputValue(input(), "25"));
    expect(onChangeQuantity).not.toHaveBeenCalled();
    expect(input().value).toBe("10");
  });

  it("clamps a typed quantity to the purchase limits", async () => {
    const onChangeQuantity = vi.fn(async () => {});
    const { input } = await setup(lineItem(), onChangeQuantity);

    await interact(() => setInputValue(input(), "40"));

    expect(onChangeQuantity).toHaveBeenCalledWith("line-1", 10);
  });

  it("moves in purchase steps", async () => {
    const onChangeQuantity = vi.fn(async () => {});
    const { increase, decrease, input } = await setup(
      lineItem({
        quantity: 4,
        quantityInformation: {
          minPurchase: 2,
          maxPurchase: 20,
          purchaseSteps: 2,
        },
      }),
      onChangeQuantity,
    );

    await interact(() => increase().click());
    expect(onChangeQuantity).toHaveBeenLastCalledWith("line-1", 6);

    await interact(() => decrease().click());
    expect(onChangeQuantity).toHaveBeenLastCalledWith("line-1", 2);

    await interact(() => setInputValue(input(), "7"));
    expect(onChangeQuantity).toHaveBeenLastCalledWith("line-1", 8);
  });

  it("does not offer a quantity change for an item that is not stackable", async () => {
    const { container } = await setup(lineItem({ stackable: false }));

    expect(
      container.querySelector('[data-testid="product-quantity"]'),
    ).toBeNull();
  });
});
