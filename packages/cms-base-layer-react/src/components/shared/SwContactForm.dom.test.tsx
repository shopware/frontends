import { afterEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import {
  deferred,
  interact,
  mount,
  query,
  setFieldValue,
  submitForm,
} from "../../__fixtures__/dom";
import type { Mounted } from "../../__fixtures__/dom";
import { CmsActionsProvider } from "../../actions/CmsActionsContext";
import type {
  CmsActions,
  CmsContactFormResult,
} from "../../actions/CmsActionsContext";
import { createCmsContext } from "../../context";
import type { CreateCmsContextInput } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementForm as CmsElementFormContent } from "../../types";
import { CmsElementForm } from "../element/CmsElementForm";

const SALUTATIONS = [
  {
    id: "sal-1",
    salutationKey: "mr",
    displayName: "Mr.",
    translated: { displayName: "Mr." },
    apiAlias: "salutation",
  },
] as unknown as Schemas["Salutation"][];

const DEFAULT_CONFIRMATION =
  "We have received your contact request and will process it as soon as possible.";

function formSlot(
  config: Partial<CmsElementFormContent["config"]> = {},
  data: unknown = SALUTATIONS,
): CmsElementFormContent {
  return {
    id: "slot-1",
    apiAlias: "cms_slot",
    type: "form",
    slot: "content",
    blockId: "block-1",
    config,
    data,
  } as unknown as CmsElementFormContent;
}

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

type SetupOptions = {
  result?: () => Promise<CmsContactFormResult>;
  content?: CmsElementFormContent;
  ctx?: Partial<CreateCmsContextInput>;
};

async function setup({ result, content, ctx }: SetupOptions = {}) {
  const submitContactForm = vi.fn<CmsActions["submitContactForm"]>(
    result ?? (async () => ({ ok: true })),
  );
  const notify = vi.fn<CmsActions["notify"]>();
  mounted = await mount(
    <CmsActionsProvider actions={{ submitContactForm, notify }}>
      <CmsElementForm
        content={content ?? formSlot()}
        ctx={createCmsContext({
          registry: createCmsRegistry(),
          routeName: "frontend.landing.page",
          foreignKey: "lp-1",
          ...ctx,
        })}
      />
      <button type="button" data-testid="elsewhere">
        Elsewhere
      </button>
    </CmsActionsProvider>,
  );
  const { container } = mounted;
  const field = <T extends Element>(name: string) =>
    query<T>(container, `[id$="${name}"]`);
  const form = query<HTMLFormElement>(
    container,
    '[data-testid="cms-contact-form"]',
  );
  return {
    container,
    form,
    field,
    submitContactForm,
    notify,
    submitButton: () =>
      container.querySelector<HTMLButtonElement>(
        '[data-testid="cms-contact-form-submit"]',
      ),
    formError: () =>
      container.querySelector<HTMLElement>('[data-testid="cms-form-error"]'),
    success: () =>
      container.querySelector<HTMLElement>('[data-testid="cms-form-success"]'),
    elsewhere: () =>
      query<HTMLButtonElement>(container, '[data-testid="elsewhere"]'),
    controls: () => [
      ...form.querySelectorAll<HTMLElement>("input, select, textarea"),
    ],
    type: (name: string, value: string) =>
      interact(() =>
        setFieldValue(
          field<HTMLInputElement | HTMLTextAreaElement>(name),
          value,
        ),
      ),
    choose: (name: string, value: string) =>
      interact(() => {
        const select = field<HTMLSelectElement>(name);
        select.value = value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }),
    submit: () => interact(() => submitForm(form)),
  };
}

type Form = Awaited<ReturnType<typeof setup>>;

async function fillValid(form: Form, { salutation = true } = {}) {
  if (salutation) await form.choose("salutation", "sal-1");
  await form.type("first-name", "Jane");
  await form.type("last-name", "Doe");
  await form.type("email-address", "jane@example.com");
  await form.type("phone", "0123456");
  await form.type("subject", "Delivery");
  await form.type("comment", "Where is my order, please?");
  await interact(() => form.field<HTMLInputElement>("privacy").click());
}

function withoutFocusIndicator(controls: HTMLElement[]) {
  return controls
    .filter(({ classList }) => {
      const ring =
        classList.contains("focus:ring-2") &&
        classList.contains("focus:ring-brand-primary");
      const outline =
        classList.contains("focus:outline-2") &&
        classList.contains("focus:outline-brand-primary");
      return !ring && !outline;
    })
    .map((control) => control.getAttribute("name"));
}

describe("SwContactForm", () => {
  it("sends the values with the salutation, the page and the slot", async () => {
    const form = await setup();

    await fillValid(form);
    await form.submit();

    expect(form.submitContactForm).toHaveBeenCalledTimes(1);
    expect(form.submitContactForm.mock.calls[0]?.[0]).toStrictEqual({
      salutationId: "sal-1",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "0123456",
      subject: "Delivery",
      comment: "Where is my order, please?",
      navigationId: "lp-1",
      entityName: "landing_page",
      slotId: "slot-1",
    });
  });

  it("sends neither the page nor its entity without a foreign key", async () => {
    const form = await setup({ ctx: { foreignKey: undefined } });

    await fillValid(form);
    await form.submit();

    const input = form.submitContactForm.mock.calls[0]?.[0];
    expect(input).toMatchObject({ slotId: "slot-1" });
    expect(input).not.toHaveProperty("navigationId");
    expect(input).not.toHaveProperty("entityName");
  });

  it("maps a category page to the category entity", async () => {
    const form = await setup({
      ctx: { routeName: "frontend.navigation.page", foreignKey: "cat-1" },
    });

    await fillValid(form);
    await form.submit();

    expect(form.submitContactForm.mock.calls[0]?.[0]).toMatchObject({
      navigationId: "cat-1",
      entityName: "category",
    });
  });

  it("maps a product page to the product entity", async () => {
    const form = await setup({
      ctx: { routeName: "frontend.detail.page", foreignKey: "product-1" },
    });

    await fillValid(form);
    await form.submit();

    expect(form.submitContactForm.mock.calls[0]?.[0]).toMatchObject({
      navigationId: "product-1",
      entityName: "product",
    });
  });

  it("requires a salutation when the slot lists any and focuses the first invalid field", async () => {
    const form = await setup();

    await fillValid(form, { salutation: false });
    await form.submit();

    const select = form.field<HTMLSelectElement>("salutation");
    expect(form.submitContactForm).not.toHaveBeenCalled();
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.getAttribute("aria-required")).toBe("true");
    const describedBy = select.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy ?? "")?.textContent).toBe(
      "Value is required",
    );
    expect(document.activeElement).toBe(select);
  });

  it("needs no salutation when the slot lists none", async () => {
    const form = await setup({ content: formSlot({}, null) });

    const select = form.field<HTMLSelectElement>("salutation");
    expect(select.hasAttribute("aria-required")).toBe(false);
    expect(form.container.textContent).not.toContain("Salutation *");

    await fillValid(form, { salutation: false });
    await form.submit();

    expect(form.submitContactForm).toHaveBeenCalledTimes(1);
    expect(form.submitContactForm.mock.calls[0]?.[0]).toMatchObject({
      salutationId: undefined,
    });
  });

  it("shows the default confirmation when the static text is empty", async () => {
    const form = await setup({
      content: formSlot({
        confirmationText: { source: "static", value: "" },
      }),
    });

    await fillValid(form);
    await form.submit();

    expect(form.success()?.textContent).toBe(DEFAULT_CONFIRMATION);
    expect(document.activeElement).toBe(form.success());
    expect(form.submitButton()).toBeNull();
  });

  it("prefers the backend success message over the configured text", async () => {
    const form = await setup({
      content: formSlot({
        confirmationText: { source: "static", value: "Configured thanks" },
      }),
      result: async () => ({ ok: true, successMessage: "Backend thanks" }),
    });

    await fillValid(form);
    await form.submit();

    expect(form.success()?.textContent).toBe("Backend thanks");
  });

  it("shows a non-empty configured text without a backend message", async () => {
    const form = await setup({
      content: formSlot({
        confirmationText: { source: "static", value: " Configured thanks " },
      }),
    });

    await fillValid(form);
    await form.submit();

    expect(form.success()?.textContent).toBe("Configured thanks");
  });

  it("puts field violations under the field and the rest into the alert, without a toast", async () => {
    const form = await setup({
      result: async () => ({
        ok: false,
        message: "Y",
        violations: [
          {
            field: "firstName",
            code: "VIOLATION::REGEX_FAILED_ERROR",
            message: "X",
          },
          { message: "Y" },
        ],
      }),
    });

    await fillValid(form);
    await form.submit();

    const firstName = form.field<HTMLInputElement>("first-name");
    expect(firstName.getAttribute("aria-invalid")).toBe("true");
    const describedBy = firstName.getAttribute("aria-describedby") ?? "";
    expect(document.getElementById(describedBy)?.textContent).toBe("X");
    expect(form.formError()?.getAttribute("role")).toBe("alert");
    expect(form.formError()?.textContent).toBe("Y");
    expect(document.activeElement).toBe(firstName);
    expect(form.notify).not.toHaveBeenCalled();

    await form.type("first-name", "Janet");

    expect(firstName.hasAttribute("aria-invalid")).toBe(false);
    expect(firstName.hasAttribute("aria-describedby")).toBe(false);
    expect(form.formError()?.textContent).toBe("Y");
  });

  it("shows the message of a failure without violations and gives the focus back to the button", async () => {
    const pending = deferred<CmsContactFormResult>();
    const form = await setup({ result: () => pending.promise });

    await fillValid(form);
    await form.submit();
    await interact(() =>
      (document.activeElement as HTMLElement | null)?.blur(),
    );
    await interact(() => pending.resolve({ ok: false, message: "Too many" }));

    expect(form.formError()?.textContent).toBe("Too many");
    expect(document.activeElement).toBe(form.submitButton());
    expect(form.notify).not.toHaveBeenCalled();
  });

  it("leaves the focus where the shopper moved it when the submit fails", async () => {
    const pending = deferred<CmsContactFormResult>();
    const form = await setup({ result: () => pending.promise });

    await fillValid(form);
    await form.submit();
    await interact(() => form.elsewhere().focus());
    await interact(() => pending.resolve({ ok: false, message: "Too many" }));

    expect(form.formError()?.textContent).toBe("Too many");
    expect(document.activeElement).toBe(form.elsewhere());
  });

  it("leaves the focus where the shopper moved it when the submit succeeds", async () => {
    const pending = deferred<CmsContactFormResult>();
    const form = await setup({ result: () => pending.promise });

    await fillValid(form);
    await form.submit();
    await interact(() => form.elsewhere().focus());
    await interact(() => pending.resolve({ ok: true }));

    expect(form.success()?.textContent).toBe(DEFAULT_CONFIRMATION);
    expect(document.activeElement).toBe(form.elsewhere());
  });

  it("ignores a second submit while the first one runs", async () => {
    const pending = deferred<CmsContactFormResult>();
    const form = await setup({ result: () => pending.promise });

    await fillValid(form);
    await form.submit();
    await form.submit();

    expect(form.submitContactForm).toHaveBeenCalledTimes(1);
    expect(form.submitButton()?.disabled).toBe(true);
    expect(form.form.getAttribute("aria-busy")).toBe("true");

    await interact(() => pending.resolve({ ok: true }));

    expect(form.form.hasAttribute("aria-busy")).toBe(false);
    expect(form.success()).not.toBeNull();
  });

  it("toasts a rejected action and keeps the form", async () => {
    const form = await setup({
      result: async () => {
        throw new Error("Network down");
      },
    });

    await fillValid(form);
    await form.submit();

    expect(form.notify).toHaveBeenCalledWith({
      type: "error",
      message: "Network down",
    });
    expect(form.submitButton()?.disabled).toBe(false);
    expect(form.success()).toBeNull();
  });

  it("does not let the browser validate and states the required fields", async () => {
    const form = await setup();

    expect(form.form.noValidate).toBe(true);
    expect(form.container.textContent).toContain(
      "Fields marked with asterisks (*) are required.",
    );
    expect(
      form
        .field<HTMLInputElement>("email-address")
        .getAttribute("aria-required"),
    ).toBe("true");
  });

  it("draws a brand focus indicator on every control, valid or invalid", async () => {
    const form = await setup();

    expect(withoutFocusIndicator(form.controls())).toStrictEqual([]);

    await form.submit();

    const invalid = form
      .controls()
      .filter((control) => control.getAttribute("aria-invalid") === "true");
    expect(form.controls()).toHaveLength(8);
    expect(invalid).toHaveLength(8);
    expect(withoutFocusIndicator(form.controls())).toStrictEqual([]);
  });
});
