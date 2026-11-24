import { describe, expect, it } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";

import { sendContactForm } from "./formsApi";
import type { ContactFormBody } from "./formsApi";

const body: ContactFormBody = {
  salutationId: "salutation-mrs",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "0123456",
  subject: "Delivery",
  comment: "Where is my order, please?",
  navigationId: "lp-1",
  entityName: "landing_page",
  slotId: "slot-1",
};

describe("sendContactForm", () => {
  it("posts the body unchanged to the contact form route", async () => {
    const shopware = fakeClient(() => ({
      individualSuccessMessage: "",
      apiAlias: "contact_form_result",
    }));

    await sendContactForm(shopware.client, body);

    expect(shopware.invocations).toStrictEqual([
      { operation: "sendContactMail post /contact-form", params: { body } },
    ]);
  });

  it("returns the individual success message of the element", async () => {
    const shopware = fakeClient(() => ({
      individualSuccessMessage: " Thanks, we will call you. ",
      apiAlias: "contact_form_result",
    }));

    await expect(sendContactForm(shopware.client, body)).resolves.toBe(
      "Thanks, we will call you.",
    );
  });

  it.each([
    ["an empty message", { individualSuccessMessage: "" }],
    ["a blank message", { individualSuccessMessage: "   " }],
    ["no message", {}],
    ["a message that is not text", { individualSuccessMessage: 42 }],
    ["no data", undefined],
    ["null data", null],
  ])("returns null for %s", async (_case, data) => {
    const shopware = fakeClient(() => data);

    await expect(sendContactForm(shopware.client, body)).resolves.toBeNull();
  });

  it("lets a rejection through", async () => {
    const failure = new Error("Bad request");
    const shopware = fakeClient(() => {
      throw failure;
    });

    await expect(sendContactForm(shopware.client, body)).rejects.toBe(failure);
  });
});
