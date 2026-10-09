import { afterEach, describe, expect, it, vi } from "vitest";

import { interact, mount, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { otherAddress } from "../address.fixture";
import { AddressTile } from "./AddressTile";
import type { AddressTileProps } from "./AddressTile";

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

function button(root: ParentNode, text: string): HTMLButtonElement {
  const match = queryAll<HTMLButtonElement>(root, "button").find(
    (candidate) => candidate.textContent === text,
  );
  if (!match) throw new Error(`No button "${text}"`);
  return match;
}

async function setup(props: Partial<AddressTileProps> = {}) {
  const handlers = {
    onDelete: vi.fn<(id: string) => void>(),
    onSetAsDefaultBillingAddress: vi.fn<(id: string) => void>(),
    onSetAsDefaultShippingAddress: vi.fn<(id: string) => void>(),
  };
  mounted = await mount(
    <AddressTile address={otherAddress} {...handlers} {...props} />,
  );
  return { container: mounted.container, ...handlers };
}

describe("AddressTile in the browser", () => {
  it("hands the address id to the delete and default handlers", async () => {
    const { container, ...handlers } = await setup();

    await interact(() => button(container, "Delete address").click());
    await interact(() =>
      button(container, "Use as default billing address").click(),
    );
    await interact(() =>
      button(container, "Use as default shipping address").click(),
    );

    expect(handlers.onDelete).toHaveBeenCalledExactlyOnceWith("address-other");
    expect(
      handlers.onSetAsDefaultBillingAddress,
    ).toHaveBeenCalledExactlyOnceWith("address-other");
    expect(
      handlers.onSetAsDefaultShippingAddress,
    ).toHaveBeenCalledExactlyOnceWith("address-other");
  });

  it("does not react to clicks while the address is being deleted", async () => {
    const { container, ...handlers } = await setup({ isDeleting: true });

    await interact(() => button(container, "Delete address").click());
    await interact(() =>
      button(container, "Use as default billing address").click(),
    );

    expect(handlers.onDelete).not.toHaveBeenCalled();
    expect(handlers.onSetAsDefaultBillingAddress).not.toHaveBeenCalled();
  });

  it("keeps a disabled edit link from navigating", async () => {
    const { container } = await setup({ isDeleting: true });
    const link = container.querySelector<HTMLAnchorElement>("a");
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });

    await interact(() => link?.dispatchEvent(click));

    expect(click.defaultPrevented).toBe(true);
  });
});
