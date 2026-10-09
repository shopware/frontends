import { act } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

export type Mounted = {
  container: HTMLElement;
  unmount(): Promise<void>;
};

export async function mount(node: ReactNode): Promise<Mounted> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(node);
  });
  return {
    container,
    async unmount() {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
}

export function interact(action: () => void): Promise<void> {
  return act(async () => {
    action();
  });
}

export function query<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`No element matches "${selector}"`);
  return element;
}

export function queryAll<T extends Element>(
  root: ParentNode,
  selector: string,
): T[] {
  return [...root.querySelectorAll<T>(selector)];
}

export function setInputValue(input: HTMLInputElement, value: string): void {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  );
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export function pressKey(target: EventTarget, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

export function submitForm(form: HTMLFormElement): void {
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}
