import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type { CmsActions } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  query,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { NewsletterBox } from "./NewsletterBox";

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(
  overrides: Partial<CmsActions> = {},
  locale?: "pl-PL" | "de-DE",
) {
  const actions = {
    subscribeNewsletter: vi.fn(async () => ({ ok: true })),
    notify: vi.fn(),
    ...overrides,
  };
  const box = (
    <CmsActionsProvider actions={actions}>
      <NewsletterBox />
    </CmsActionsProvider>
  );
  mounted = await mount(locale ? withI18n(box, locale) : box);
  const { container } = mounted;
  return {
    actions,
    form: query<HTMLFormElement>(container, "form"),
    input: query<HTMLInputElement>(container, "input#newsletter-email"),
    error: () =>
      container.querySelector('[role="alert"]#newsletter-email-error'),
  };
}

describe("NewsletterBox in the browser", () => {
  it("rejects an empty submission and points the input at the error", async () => {
    const { actions, form, input, error } = await setup();

    await interact(() => submitForm(form));

    expect(error()?.textContent).toBe("Value is required");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(
      "newsletter-email-error",
    );
    expect(actions.subscribeNewsletter).not.toHaveBeenCalled();
    expect(actions.notify).not.toHaveBeenCalled();
  });

  it("rejects a malformed address", async () => {
    const { actions, form, input, error } = await setup();

    await interact(() => setInputValue(input, "foo"));
    await interact(() => submitForm(form));

    expect(error()?.textContent).toBe("Value is not a valid email address");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(actions.subscribeNewsletter).not.toHaveBeenCalled();
  });

  it("subscribes a valid address, confirms it and clears the field", async () => {
    const { actions, form, input, error } = await setup();

    await interact(() => setInputValue(input, " jane@example.com "));
    await interact(() => submitForm(form));

    expect(actions.subscribeNewsletter).toHaveBeenCalledWith({
      email: "jane@example.com",
      option: "subscribe",
    });
    expect(actions.notify).toHaveBeenCalledWith({
      type: "success",
      message: "Thank you! We have signed up your address.",
    });
    expect(input.value).toBe("");
    expect(error()).toBeNull();
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.disabled).toBe(false);
  });

  it("validates and confirms in Polish under the pl-PL provider", async () => {
    const { actions, form, input, error } = await setup({}, "pl-PL");

    await interact(() => submitForm(form));
    expect(error()?.textContent).toBe("Wartość jest wymagana");

    await interact(() => setInputValue(input, "jan@example.com"));
    await interact(() => submitForm(form));

    expect(actions.notify).toHaveBeenCalledWith({
      type: "success",
      message: "Dziękujemy! Zapisaliśmy Twój adres.",
    });
  });

  it("keeps the address and reports a failed subscription", async () => {
    const { actions, form, input } = await setup({
      subscribeNewsletter: vi.fn(async () => {
        throw new Error("Service unavailable");
      }),
    });

    await interact(() => setInputValue(input, "jane@example.com"));
    await interact(() => submitForm(form));

    expect(actions.notify).toHaveBeenCalledWith({
      type: "error",
      message: "Service unavailable",
    });
    expect(input.value).toBe("jane@example.com");
    expect(input.disabled).toBe(false);
  });
});
