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
  CmsNewsletterResult,
} from "../../actions/CmsActionsContext";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementForm as CmsElementFormContent } from "../../types";
import { CmsElementForm } from "../element/CmsElementForm";

const SALUTATIONS = [
  {
    id: "sal-1",
    salutationKey: "mrs",
    displayName: "Mrs.",
    translated: { displayName: "Mrs." },
    apiAlias: "salutation",
  },
] as unknown as Schemas["Salutation"][];

const BENEFITS =
  "Be aware of upcoming sales and events.Receive gifts and special offers!";
const CONFIRMATION_SENT =
  "Thank you! Please confirm your subscription with the link in the email we have just sent you.";
const UNSUBSCRIBED = "You have unsubscribed from the newsletter.";

const newsletterSlot = {
  id: "slot-2",
  apiAlias: "cms_slot",
  type: "form",
  slot: "content",
  blockId: "block-1",
  config: { type: { source: "static", value: "newsletter" } },
  data: SALUTATIONS,
} as unknown as CmsElementFormContent;

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(
  result: () => Promise<CmsNewsletterResult> = async () => ({
    ok: true,
    status: "direct",
  }),
) {
  const subscribeNewsletter = vi.fn<CmsActions["subscribeNewsletter"]>(result);
  const notify = vi.fn<CmsActions["notify"]>();
  mounted = await mount(
    <CmsActionsProvider actions={{ subscribeNewsletter, notify }}>
      <CmsElementForm
        content={newsletterSlot}
        ctx={createCmsContext({ registry: createCmsRegistry() })}
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
    '[data-testid="cms-newsletter-form"]',
  );
  return {
    container,
    form,
    field,
    subscribeNewsletter,
    notify,
    submitButton: () =>
      container.querySelector<HTMLButtonElement>(
        '[data-testid="cms-newsletter-form-submit"]',
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
      interact(() => setFieldValue(field<HTMLInputElement>(name), value)),
    choose: (name: string, value: string) =>
      interact(() => {
        const select = field<HTMLSelectElement>(name);
        select.value = value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }),
    accept: () => interact(() => field<HTMLInputElement>("privacy").click()),
    submit: () => interact(() => submitForm(form)),
  };
}

type Form = Awaited<ReturnType<typeof setup>>;

async function fillSubscription(form: Form) {
  await form.type("email-address", "jane@example.com");
  await form.type("first-name", "Jane");
  await form.type("last-name", "Doe");
  await form.accept();
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

describe("SwNewsletterForm", () => {
  it("subscribes without a salutation and shows the benefits for an active status", async () => {
    const form = await setup();

    await fillSubscription(form);
    await form.submit();

    expect(form.subscribeNewsletter).toHaveBeenCalledTimes(1);
    expect(form.subscribeNewsletter.mock.calls[0]?.[0]).toStrictEqual({
      email: "jane@example.com",
      option: "subscribe",
      firstName: "Jane",
      lastName: "Doe",
      salutationId: undefined,
    });
    expect(form.success()?.textContent).toBe(BENEFITS);
    expect(document.activeElement).toBe(form.success());
  });

  it("sends the chosen salutation", async () => {
    const form = await setup();

    await form.choose("salutation", "sal-1");
    await fillSubscription(form);
    await form.submit();

    expect(form.subscribeNewsletter.mock.calls[0]?.[0]).toMatchObject({
      salutationId: "sal-1",
    });
  });

  it("asks for the confirmation mail when the subscription is not confirmed yet", async () => {
    const form = await setup(async () => ({ ok: true, status: "notSet" }));

    await fillSubscription(form);
    await form.submit();

    expect(form.success()?.textContent).toBe(CONFIRMATION_SENT);
  });

  it("unsubscribes with the email only and says so", async () => {
    const form = await setup(async () => ({ ok: true, status: "optOut" }));

    await form.choose("option", "unsubscribe");
    expect(form.container.querySelector('[id$="first-name"]')).toBeNull();
    await form.type("email-address", "jane@example.com");
    await form.accept();
    await form.submit();

    expect(form.subscribeNewsletter.mock.calls[0]?.[0]).toStrictEqual({
      email: "jane@example.com",
      option: "unsubscribe",
    });
    expect(form.success()?.textContent).toBe(UNSUBSCRIBED);
  });

  it("shows an email violation under the field and focuses it, without a toast", async () => {
    const form = await setup(async () => ({
      ok: false,
      message: "Value is not a valid email address",
      violations: [
        {
          field: "email",
          code: "VIOLATION::INVALID_FORMAT_ERROR",
          message: "Value is not a valid email address",
        },
      ],
    }));

    await fillSubscription(form);
    await form.submit();

    const email = form.field<HTMLInputElement>("email-address");
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(
      document.getElementById(email.getAttribute("aria-describedby") ?? "")
        ?.textContent,
    ).toBe("Value is not a valid email address");
    expect(document.activeElement).toBe(email);
    expect(form.formError()).toBeNull();
    expect(form.notify).not.toHaveBeenCalled();
  });

  it("shows a violation of a hidden field in the alert", async () => {
    const form = await setup(async () => ({
      ok: false,
      violations: [{ field: "firstName", message: "No links" }],
    }));

    await form.choose("option", "unsubscribe");
    await form.type("email-address", "jane@example.com");
    await form.accept();
    await form.submit();

    expect(form.formError()?.textContent).toBe("No links");
  });

  it("clears the server errors when the shopper switches the option", async () => {
    const form = await setup(async () => ({
      ok: false,
      violations: [
        { field: "email", message: "Value is not a valid email address" },
        { message: "Too many requests." },
      ],
    }));

    await fillSubscription(form);
    await form.submit();

    const email = form.field<HTMLInputElement>("email-address");
    expect(form.formError()?.textContent).toBe("Too many requests.");
    expect(email.getAttribute("aria-invalid")).toBe("true");

    await form.choose("option", "unsubscribe");

    expect(form.formError()).toBeNull();
    expect(email.hasAttribute("aria-invalid")).toBe(false);
    expect(email.hasAttribute("aria-describedby")).toBe(false);
  });

  it("leaves the focus where the shopper moved it when the submit fails", async () => {
    const pending = deferred<CmsNewsletterResult>();
    const form = await setup(() => pending.promise);

    await fillSubscription(form);
    await form.submit();
    await interact(() => form.elsewhere().focus());
    await interact(() =>
      pending.resolve({ ok: false, message: "Too many requests." }),
    );

    expect(form.formError()?.textContent).toBe("Too many requests.");
    expect(document.activeElement).toBe(form.elsewhere());
  });

  it("leaves the focus where the shopper moved it when the submit succeeds", async () => {
    const pending = deferred<CmsNewsletterResult>();
    const form = await setup(() => pending.promise);

    await fillSubscription(form);
    await form.submit();
    await interact(() => form.elsewhere().focus());
    await interact(() => pending.resolve({ ok: true, status: "direct" }));

    expect(form.success()?.textContent).toBe(BENEFITS);
    expect(document.activeElement).toBe(form.elsewhere());
  });

  it("ignores a second submit while the first one runs", async () => {
    const pending = deferred<CmsNewsletterResult>();
    const form = await setup(() => pending.promise);

    await fillSubscription(form);
    await form.submit();
    await form.submit();

    expect(form.subscribeNewsletter).toHaveBeenCalledTimes(1);
    expect(form.submitButton()?.disabled).toBe(true);
    expect(form.form.getAttribute("aria-busy")).toBe("true");

    await interact(() => pending.resolve({ ok: true, status: "direct" }));

    expect(form.success()).not.toBeNull();
  });

  it("labels the salutation as optional and states the required fields", async () => {
    const form = await setup();
    const salutation = form.field<HTMLSelectElement>("salutation");
    const label = [...form.container.querySelectorAll("label")].find(
      (candidate) => candidate.htmlFor === salutation.id,
    );

    expect(label?.textContent).toBe("Salutation");
    expect(form.form.noValidate).toBe(true);
    expect(form.container.textContent).toContain(
      "Fields marked with asterisks (*) are required.",
    );
  });

  it("draws a brand focus indicator on every control, valid or invalid", async () => {
    const form = await setup();

    expect(withoutFocusIndicator(form.controls())).toStrictEqual([]);

    await form.submit();

    const invalid = form
      .controls()
      .filter((control) => control.getAttribute("aria-invalid") === "true")
      .map((control) => control.getAttribute("name"));
    expect(form.controls()).toHaveLength(6);
    expect(invalid).toStrictEqual([
      "email",
      "first-name",
      "last-name",
      "privacy",
    ]);
    expect(withoutFocusIndicator(form.controls())).toStrictEqual([]);
  });
});
