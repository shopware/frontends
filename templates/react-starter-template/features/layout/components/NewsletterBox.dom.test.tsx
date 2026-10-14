import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type {
  CmsActions,
  CmsNewsletterResult,
} from "@shopware/cms-base-layer-react/client";
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
    subscribeNewsletter: vi.fn<CmsActions["subscribeNewsletter"]>(async () => ({
      ok: true,
    })),
    notify: vi.fn<CmsActions["notify"]>(),
    ...overrides,
  };
  const box = (
    <CmsActionsProvider actions={actions}>
      <NewsletterBox />
      <button type="button" data-testid="elsewhere">
        Elsewhere
      </button>
    </CmsActionsProvider>
  );
  mounted = await mount(locale ? withI18n(box, locale) : box);
  const { container } = mounted;
  return {
    actions,
    form: query<HTMLFormElement>(
      container,
      'form[data-testid="footer-newsletter-form"]',
    ),
    input: query<HTMLInputElement>(
      container,
      'input#newsletter-email[data-testid="footer-newsletter-email-input"]',
    ),
    button: query<HTMLButtonElement>(
      container,
      'button[data-testid="footer-newsletter-submit-button"]',
    ),
    elsewhere: query<HTMLButtonElement>(
      container,
      'button[data-testid="elsewhere"]',
    ),
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

  it("asks for the confirmation mail while the subscription waits for it", async () => {
    const { actions, form, input } = await setup({
      subscribeNewsletter: vi.fn<CmsActions["subscribeNewsletter"]>(
        async () => ({ ok: true, status: "notSet" }),
      ),
    });

    await interact(() => setInputValue(input, "jane@example.com"));
    await interact(() => submitForm(form));

    expect(actions.notify).toHaveBeenCalledWith({
      type: "success",
      message:
        "Thank you! Please confirm your subscription with the link in the email we have just sent you.",
    });
    expect(input.value).toBe("");
  });

  it("shows an email violation under the input and focuses it without a toast", async () => {
    const { actions, form, input, error } = await setup({
      subscribeNewsletter: vi.fn(async () => ({
        ok: false,
        message: "Value is not a valid email address",
        violations: [
          {
            field: "email",
            code: "VIOLATION::INVALID_FORMAT_ERROR",
            message: "Value is not a valid email address",
          },
          {
            field: "email",
            code: "VIOLATION::IS_BLANK_ERROR",
            message: "Value is required",
          },
        ],
      })),
    });

    await interact(() => setInputValue(input, "jane@example.com"));
    await interact(() => submitForm(form));

    expect(error()?.textContent).toBe("Value is not a valid email address");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(
      "newsletter-email-error",
    );
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("jane@example.com");
    expect(actions.notify).not.toHaveBeenCalled();

    await interact(() => setInputValue(input, "jane@example.org"));

    expect(error()).toBeNull();
    expect(input.hasAttribute("aria-invalid")).toBe(false);
  });

  it("toasts every other violation once, or the message when there is none", async () => {
    const results: CmsNewsletterResult[] = [
      {
        ok: false,
        message: "Too many requests.",
        violations: [
          {
            code: "FRAMEWORK__RATE_LIMIT_EXCEEDED",
            message: "Too many requests.",
          },
          { field: "storefrontUrl", message: "Something went wrong." },
          { field: "option", message: "Something went wrong." },
        ],
      },
      { ok: false, message: "Something went wrong." },
    ];
    const { actions, form, input, error } = await setup({
      subscribeNewsletter: vi.fn(async () => results.shift() ?? { ok: false }),
    });

    await interact(() => setInputValue(input, "jane@example.com"));
    await interact(() => submitForm(form));
    await interact(() => submitForm(form));

    expect(vi.mocked(actions.notify).mock.calls).toStrictEqual([
      [{ type: "error", message: "Too many requests." }],
      [{ type: "error", message: "Something went wrong." }],
      [{ type: "error", message: "Something went wrong." }],
    ]);
    expect(error()).toBeNull();
    expect(input.value).toBe("jane@example.com");
  });

  it("gives the focus back to the button when it was lost during the request", async () => {
    let finish: (result: CmsNewsletterResult) => void = () => {};
    const { form, input, button } = await setup({
      subscribeNewsletter: vi.fn(
        () =>
          new Promise<CmsNewsletterResult>((resolve) => {
            finish = resolve;
          }),
      ),
    });

    await interact(() => setInputValue(input, "jane@example.com"));
    await interact(() => submitForm(form));
    await interact(() =>
      (document.activeElement as HTMLElement | null)?.blur(),
    );
    await interact(() => finish({ ok: true, status: "direct" }));

    expect(document.activeElement).toBe(button);
  });

  it("leaves the focus alone when the customer moved it elsewhere during the request", async () => {
    let finish: (result: CmsNewsletterResult) => void = () => {};
    const { form, input, elsewhere } = await setup({
      subscribeNewsletter: vi.fn(
        () =>
          new Promise<CmsNewsletterResult>((resolve) => {
            finish = resolve;
          }),
      ),
    });

    await interact(() => setInputValue(input, "jane@example.com"));
    await interact(() => submitForm(form));
    await interact(() => elsewhere.focus());
    await interact(() => finish({ ok: true, status: "direct" }));

    expect(input.value).toBe("");
    expect(document.activeElement).toBe(elsewhere);
  });

  it("sends one request for two quick submits", async () => {
    let finish: (result: CmsNewsletterResult) => void = () => {};
    const { actions, form, input, button } = await setup({
      subscribeNewsletter: vi.fn(
        () =>
          new Promise<CmsNewsletterResult>((resolve) => {
            finish = resolve;
          }),
      ),
    });

    await interact(() => setInputValue(input, "jane@example.com"));
    await interact(() => submitForm(form));
    await interact(() => submitForm(form));

    expect(actions.subscribeNewsletter).toHaveBeenCalledTimes(1);
    expect(button.disabled).toBe(true);
    expect(input.disabled).toBe(true);

    await interact(() => finish({ ok: true, status: "direct" }));

    expect(button.disabled).toBe(false);
    expect(actions.notify).toHaveBeenCalledTimes(1);
  });
});
