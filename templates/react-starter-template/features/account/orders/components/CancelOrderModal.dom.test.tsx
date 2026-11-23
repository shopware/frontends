import { afterEach, describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  pressKey,
  query,
  queryAll,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { CancelOrderModal } from "./CancelOrderModal";

const MODAL = '[data-testid="cancel-order-modal"]';
const CONFIRM = '[data-testid="cancel-order-confirm-button"]';

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(busy: boolean) {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  mounted = await mount(
    withI18n(
      <CancelOrderModal
        open
        busy={busy}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    ),
  );
  const dialog = query<HTMLDialogElement>(document.body, MODAL);
  const back = queryAll<HTMLButtonElement>(dialog, "button").find(
    (button) => button.textContent === "Back",
  );
  if (!back) throw new Error("No Back button");
  return { dialog, back, onClose, onConfirm };
}

describe("CancelOrderModal", () => {
  it("confirms on submit and closes on Back and Escape", async () => {
    const { dialog, back, onClose, onConfirm } = await setup(false);

    await interact(() => submitForm(query<HTMLFormElement>(dialog, "form")));
    await interact(() => back.click());
    await interact(() => pressKey(document, "Escape"));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("neither confirms again nor closes while the cancellation runs", async () => {
    const { dialog, back, onClose, onConfirm } = await setup(true);
    const confirm = query<HTMLButtonElement>(dialog, CONFIRM);

    await interact(() => submitForm(query<HTMLFormElement>(dialog, "form")));
    await interact(() => confirm.click());
    await interact(() => back.click());
    await interact(() => pressKey(document, "Escape"));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(confirm.getAttribute("aria-busy")).toBe("true");
    expect(confirm.getAttribute("aria-disabled")).toBe("true");
    expect(back.getAttribute("aria-disabled")).toBe("true");
  });
});
