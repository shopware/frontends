import { afterEach, describe, expect, it, vi } from "vitest";

import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import {
  ENGLISH_DOMAIN,
  apiClientError,
  salesChannelContext,
} from "@/features/session/session.fixture";
import type { StorefrontUrlContext } from "@/features/session/storefrontUrl";
import { testTranslator } from "@/test/i18n";

import { createFormActions } from "./formActions";

const t = testTranslator();

const CONTACT = "sendContactMail post /contact-form";
const SUBSCRIBE = "subscribeToNewsletter post /newsletter/subscribe";
const UNSUBSCRIBE = "unsubscribeToNewsletter post /newsletter/unsubscribe";

const context = salesChannelContext();

function setup(answer?: FakeAnswer) {
  const shopware = fakeClient(answer);
  const getSession = vi.fn(async () => ({ context }));
  const resolveStorefrontUrl = vi.fn(
    async (_context: StorefrontUrlContext | null) => ENGLISH_DOMAIN,
  );
  const actions = createFormActions({
    getClient: async () => shopware.client,
    getSession,
    t,
    resolveStorefrontUrl,
  });
  return { shopware, getSession, resolveStorefrontUrl, actions };
}

const contactInput = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "0123456",
  subject: "Delivery",
  comment: "Where is my order, please?",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createFormActions submitContactForm", () => {
  it("posts the values without the keys the form left out", async () => {
    const { shopware, actions } = setup(() => ({
      individualSuccessMessage: "",
    }));

    await expect(
      actions.submitContactForm({
        ...contactInput,
        salutationId: undefined,
        navigationId: "lp-1",
        entityName: "landing_page",
        slotId: "slot-1",
      }),
    ).resolves.toStrictEqual({ ok: true });

    expect(shopware.invocations).toStrictEqual([
      {
        operation: CONTACT,
        params: {
          body: {
            email: "jane@example.com",
            subject: "Delivery",
            comment: "Where is my order, please?",
            firstName: "Jane",
            lastName: "Doe",
            phone: "0123456",
            navigationId: "lp-1",
            entityName: "landing_page",
            slotId: "slot-1",
          },
        },
      },
    ]);
  });

  it("passes the element's success message on", async () => {
    const { actions } = setup(() => ({
      individualSuccessMessage: "We will call you back.",
    }));

    await expect(
      actions.submitContactForm({ ...contactInput, salutationId: "sal-1" }),
    ).resolves.toStrictEqual({
      ok: true,
      successMessage: "We will call you back.",
    });
  });

  it("resolves violations instead of rejecting and logs nothing for them", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { actions } = setup(() => {
      throw apiClientError([
        {
          code: "VIOLATION::IS_BLANK_ERROR",
          status: "400",
          detail: "This value should not be blank.",
          source: { pointer: "/salutationId" },
        },
      ]);
    });

    await expect(
      actions.submitContactForm(contactInput),
    ).resolves.toStrictEqual({
      ok: false,
      message: "Value is required",
      violations: [
        {
          field: "salutationId",
          code: "VIOLATION::IS_BLANK_ERROR",
          message: "Value is required",
        },
      ],
    });
    expect(log).not.toHaveBeenCalled();
  });

  it("gives the default message when the client cannot be created", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const actions = createFormActions({
      getClient: async () => {
        throw new Error("[Session] /api/shopware/config responded with 500");
      },
      getSession: async () => ({ context }),
      t,
    });

    await expect(
      actions.submitContactForm(contactInput),
    ).resolves.toStrictEqual({
      ok: false,
      message: t("errors.message-default"),
    });
    expect(log).toHaveBeenCalledWith("[Forms] contact failed", {
      name: "Error",
    });
  });
});

describe("createFormActions subscribeNewsletter", () => {
  it("subscribes with the storefront url of the session and returns the status", async () => {
    const { shopware, getSession, resolveStorefrontUrl, actions } = setup(
      () => ({ status: "notSet", success: true }),
    );

    await expect(
      actions.subscribeNewsletter({
        email: "jane@example.com",
        option: "subscribe",
        firstName: "Jane",
        lastName: "Doe",
        salutationId: undefined,
      }),
    ).resolves.toStrictEqual({ ok: true, status: "notSet" });

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(resolveStorefrontUrl).toHaveBeenCalledWith(context);
    expect(shopware.invocations).toStrictEqual([
      {
        operation: SUBSCRIBE,
        params: {
          body: {
            email: "jane@example.com",
            option: "subscribe",
            storefrontUrl: ENGLISH_DOMAIN,
            firstName: "Jane",
            lastName: "Doe",
          },
        },
      },
    ]);
  });

  it("subscribes when no option is given", async () => {
    const { shopware, actions } = setup(() => ({
      status: "direct",
      success: true,
    }));

    await expect(
      actions.subscribeNewsletter({ email: "jane@example.com" }),
    ).resolves.toStrictEqual({ ok: true, status: "direct" });
    expect(shopware.operations()).toStrictEqual([SUBSCRIBE]);
  });

  it("unsubscribes through the unsubscribe route without the session", async () => {
    const { shopware, getSession, actions } = setup(() => ({ success: true }));

    await expect(
      actions.subscribeNewsletter({
        email: "jane@example.com",
        option: "unsubscribe",
      }),
    ).resolves.toStrictEqual({ ok: true, status: "optOut" });

    expect(getSession).not.toHaveBeenCalled();
    expect(shopware.invocations).toStrictEqual([
      {
        operation: UNSUBSCRIBE,
        params: { body: { email: "jane@example.com" } },
      },
    ]);
  });

  it("treats an unknown address on unsubscribe as unsubscribed and logs nothing", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { actions } = setup(() => {
      throw apiClientError([
        {
          code: "CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND",
          status: "400",
          detail:
            'The NewsletterRecipient with the identifier "email" - jane@example.com was not found.',
        },
      ]);
    });

    await expect(
      actions.subscribeNewsletter({
        email: "jane@example.com",
        option: "unsubscribe",
      }),
    ).resolves.toStrictEqual({ ok: true, status: "optOut" });
    expect(log).not.toHaveBeenCalled();
  });

  it("resolves a failed subscription with its messages", async () => {
    const { actions } = setup(() => {
      throw apiClientError([
        {
          code: "VIOLATION::INVALID_FORMAT_ERROR",
          status: "400",
          detail: "This value is not a valid email address.",
          source: { pointer: "/email" },
        },
      ]);
    });

    await expect(
      actions.subscribeNewsletter({ email: "jane@example" }),
    ).resolves.toStrictEqual({
      ok: false,
      message: "Value is not a valid email address",
      violations: [
        {
          field: "email",
          code: "VIOLATION::INVALID_FORMAT_ERROR",
          message: "Value is not a valid email address",
        },
      ],
    });
  });

  it("gives the default message when the storefront url cannot be resolved", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { shopware, resolveStorefrontUrl, actions } = setup();
    resolveStorefrontUrl.mockRejectedValueOnce(new TypeError("offline"));

    await expect(
      actions.subscribeNewsletter({ email: "jane@example.com" }),
    ).resolves.toStrictEqual({
      ok: false,
      message: t("errors.message-default"),
    });
    expect(shopware.invocations).toStrictEqual([]);
    expect(log).toHaveBeenCalledWith("[Forms] newsletter failed", {
      name: "TypeError",
    });
  });
});
