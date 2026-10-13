import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CmsActionsProvider } from "../../actions/CmsActionsContext";
import type { CmsActions } from "../../actions/CmsActionsContext";
import { SwProductCardWishlistButton } from "./SwProductCardActions";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const translations = {
  addedToWishlist: "has been added to wishlist.",
  removedFromTheWishlist: "has been removed from wishlist.",
  reason: "Reason",
  cannotAddToWishlist: "cannot be added to wishlist.",
  addToWishlist: "Add to wishlist",
  removeFromWishlist: "Remove from wishlist",
};

type ToggleResult = Awaited<ReturnType<CmsActions["toggleWishlist"]>>;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

let root: Root | undefined;
let container: HTMLElement | undefined;

afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

async function setup(toggleWishlist: CmsActions["toggleWishlist"]) {
  const notify = vi.fn();
  const toggle = vi.fn(toggleWishlist);
  container = document.createElement("div");
  document.body.append(container);
  const mountedRoot = createRoot(container);
  root = mountedRoot;
  await act(async () => {
    mountedRoot.render(
      <CmsActionsProvider
        actions={{ toggleWishlist: toggle, isInWishlist: () => false, notify }}
      >
        <SwProductCardWishlistButton
          productId="product-1"
          productName="Oak Chair"
          translations={translations}
        />
      </CmsActionsProvider>,
    );
  });
  const button = container.querySelector<HTMLButtonElement>(
    '[data-testid="product-box-toggle-wishlist-button"]',
  );
  if (!button) throw new Error("The wishlist button did not render");
  const click = () =>
    act(async () => {
      button.click();
    });
  return { button, notify, toggle, click };
}

describe("SwProductCardWishlistButton", () => {
  it("stays silent and unchanged when the toggle was cancelled", async () => {
    const { button, notify, click } = await setup(async () => ({
      ok: false,
      cancelled: true,
    }));

    await click();

    expect(notify).not.toHaveBeenCalled();
    expect(button.getAttribute("aria-label")).toBe("Add to wishlist");
    expect(button.hasAttribute("aria-disabled")).toBe(false);
  });

  it("ignores further clicks while busy and keeps the button focusable", async () => {
    const pending = deferred<ToggleResult>();
    const { button, notify, toggle, click } = await setup(
      () => pending.promise,
    );
    button.focus();

    await click();
    await click();

    expect(toggle).toHaveBeenCalledTimes(1);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.disabled).toBe(false);
    expect(document.activeElement).toBe(button);

    await act(async () => pending.resolve({ ok: true, inWishlist: true }));

    expect(button.hasAttribute("aria-disabled")).toBe(false);
    expect(button.getAttribute("aria-label")).toBe("Remove from wishlist");
    expect(notify).toHaveBeenCalledWith({
      type: "success",
      message: "Oak Chair has been added to wishlist.",
    });
  });

  it("reports a failed toggle with the reason", async () => {
    const { button, notify, click } = await setup(async () => ({
      ok: false,
      message: "Wishlist is not activated!",
    }));

    await click();

    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message:
        "Oak Chair cannot be added to wishlist.\nReason: Wishlist is not activated!",
      timeout: 5000,
    });
    expect(button.getAttribute("aria-label")).toBe("Add to wishlist");
  });
});
