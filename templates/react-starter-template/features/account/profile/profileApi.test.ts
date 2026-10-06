import { describe, expect, it } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";

import {
  SUBSCRIBE_KEY,
  changeEmail,
  changePassword,
  changeProfile,
  isNewsletterConfirmationNeeded,
  isNewsletterSubscriber,
  readNewsletterStatus,
  subscribeNewsletter,
  unsubscribeNewsletter,
} from "./profileApi";
import type { NewsletterStatus } from "./profileApi";

describe("changeProfile", () => {
  it("posts the body unchanged to change-profile", async () => {
    const shopware = fakeClient();
    const body = {
      firstName: "Jane",
      lastName: "Doe",
      salutationId: "salutation-mrs",
      title: "Dr.",
      accountType: "business" as const,
      company: "Shopware AG",
      vatIds: ["DE123456789"] as [string],
    };

    await changeProfile(shopware.client, body);

    expect(shopware.invocations).toEqual([
      {
        operation: "changeProfile post /account/change-profile",
        params: { body },
      },
    ]);
  });
});

describe("changeEmail", () => {
  it("posts the new email, its confirmation and the current password", async () => {
    const shopware = fakeClient();

    await changeEmail(shopware.client, {
      email: "new@example.com",
      emailConfirmation: "new@example.com",
      password: "secret",
    });

    expect(shopware.invocations).toEqual([
      {
        operation: "changeEmail post /account/change-email",
        params: {
          body: {
            email: "new@example.com",
            emailConfirmation: "new@example.com",
            password: "secret",
          },
        },
      },
    ]);
  });

  it("lets a rejection through", async () => {
    const failure = new Error("Bad request");
    const shopware = fakeClient(() => {
      throw failure;
    });

    await expect(
      changeEmail(shopware.client, {
        email: "a@example.com",
        emailConfirmation: "a@example.com",
        password: "secret",
      }),
    ).rejects.toBe(failure);
  });
});

describe("changePassword", () => {
  it("posts the current password, the new one and its confirmation", async () => {
    const shopware = fakeClient();

    await changePassword(shopware.client, {
      password: "old-secret",
      newPassword: "new-secret",
      newPasswordConfirm: "new-secret",
    });

    expect(shopware.invocations).toEqual([
      {
        operation: "changePassword post /account/change-password",
        params: {
          body: {
            password: "old-secret",
            newPassword: "new-secret",
            newPasswordConfirm: "new-secret",
          },
        },
      },
    ]);
  });
});

describe("readNewsletterStatus", () => {
  it("reads the recipient without a body and returns its status", async () => {
    const shopware = fakeClient(() => ({
      apiAlias: "account_newsletter_recipient",
      status: "optIn",
    }));

    await expect(readNewsletterStatus(shopware.client)).resolves.toBe("optIn");
    expect(shopware.invocations).toEqual([
      {
        operation: "readNewsletterRecipient post /account/newsletter-recipient",
        params: undefined,
      },
    ]);
  });
});

describe("subscribeNewsletter", () => {
  it("subscribes the email with the subscribe option and the storefront url", async () => {
    const shopware = fakeClient(() => ({ status: "notSet", success: true }));

    await expect(
      subscribeNewsletter(shopware.client, {
        email: "jane@example.com",
        storefrontUrl: "https://shop.test/en",
      }),
    ).resolves.toBe("notSet");
    expect(SUBSCRIBE_KEY).toBe("subscribe");
    expect(shopware.invocations).toEqual([
      {
        operation: "subscribeToNewsletter post /newsletter/subscribe",
        params: {
          body: {
            email: "jane@example.com",
            option: "subscribe",
            storefrontUrl: "https://shop.test/en",
          },
        },
      },
    ]);
  });
});

describe("unsubscribeNewsletter", () => {
  it("unsubscribes the email", async () => {
    const shopware = fakeClient(() => ({ success: true }));

    await unsubscribeNewsletter(shopware.client, "jane@example.com");

    expect(shopware.invocations).toEqual([
      {
        operation: "unsubscribeToNewsletter post /newsletter/unsubscribe",
        params: { body: { email: "jane@example.com" } },
      },
    ]);
  });
});

describe("newsletter status rules", () => {
  const cases: [NewsletterStatus, boolean, boolean][] = [
    ["optIn", true, false],
    ["direct", true, false],
    ["notSet", true, true],
    ["optOut", false, false],
    ["undefined", false, false],
  ];

  it.each(cases)(
    "treats %s as subscriber=%s and confirmationNeeded=%s",
    (status, subscriber, confirmationNeeded) => {
      expect(isNewsletterSubscriber(status)).toBe(subscriber);
      expect(isNewsletterConfirmationNeeded(status)).toBe(confirmationNeeded);
    },
  );
});
