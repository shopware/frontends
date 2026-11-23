import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { interact, mount, pressKey, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { Modal } from "./Modal";

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  document.body.style.overflow = "";
  vi.restoreAllMocks();
});

function Harness({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="opener" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal
        open={open}
        title="Change payment method"
        closeLabel="Close"
        onClose={() => {
          onClose();
          setOpen(false);
        }}
        data-testid="modal"
      >
        <button type="button" data-testid="first">
          First
        </button>
        <button type="button" data-testid="last">
          Last
        </button>
      </Modal>
    </>
  );
}

async function openModal(onClose?: () => void) {
  mounted = await mount(<Harness onClose={onClose} />);
  const opener = query<HTMLButtonElement>(
    mounted.container,
    '[data-testid="opener"]',
  );
  opener.focus();
  await interact(() => opener.click());
  return {
    opener,
    dialog: query<HTMLDialogElement>(document.body, '[data-testid="modal"]'),
  };
}

describe("Modal", () => {
  it("renders nothing while closed", async () => {
    mounted = await mount(<Harness />);

    expect(document.querySelector("dialog")).toBeNull();
  });

  it("is a modal dialog labelled by its title, portalled to the body and focused", async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const { dialog } = await openModal();

    expect(showModal).toHaveBeenCalledOnce();
    expect(showModal.mock.contexts[0]).toBe(dialog);

    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    const title = document.getElementById(
      dialog.getAttribute("aria-labelledby") ?? "",
    );
    expect(title?.tagName).toBe("H2");
    expect(title?.textContent).toBe("Change payment method");
    expect(mounted?.container.contains(dialog)).toBe(false);
    expect(document.activeElement).toBe(dialog);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes on Escape and returns the focus to the opener", async () => {
    const onClose = vi.fn();
    const { opener } = await openModal(onClose);

    await interact(() => pressKey(document, "Escape"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.querySelector("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on a click on the backdrop", async () => {
    const onClose = vi.fn();
    await openModal(onClose);

    await interact(() =>
      query<HTMLButtonElement>(
        document.body,
        'button[aria-label="Close"]',
      ).click(),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("closes on the dialog's cancel event and keeps the dialog from closing itself", async () => {
    const onClose = vi.fn();
    const { dialog, opener } = await openModal(onClose);
    const cancel = new Event("cancel", { cancelable: true });

    await interact(() => dialog.dispatchEvent(cancel));

    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.querySelector("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("keeps the backdrop inside the modal dialog so it stays clickable", async () => {
    const { dialog } = await openModal();

    expect(
      dialog.contains(
        query<HTMLButtonElement>(document.body, 'button[aria-label="Close"]'),
      ),
    ).toBe(true);
  });
});
