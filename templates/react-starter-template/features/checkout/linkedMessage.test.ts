import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

import { linkedMessageText, splitLinkedMessage } from "./linkedMessage";

describe("splitLinkedMessage", () => {
  it("splits the English terms label around its link", () => {
    expect(
      splitLinkedMessage(
        testTranslator(),
        "checkout.terms.tosLabel",
        "checkout.terms.tosLink",
      ),
    ).toEqual({
      before: "I have read and accepted the ",
      link: "general terms and conditions",
      after: ".",
    });
  });

  it("keeps the link where the German sentence puts it", () => {
    expect(
      splitLinkedMessage(
        testTranslator("de-DE"),
        "checkout.terms.tosLabel",
        "checkout.terms.tosLink",
      ),
    ).toEqual({
      before: "Ich habe die ",
      link: "Allgemeinen Geschäftsbedingungen",
      after: " gelesen und akzeptiert.",
    });
  });

  it("returns the whole message when it has no link placeholder", () => {
    expect(
      splitLinkedMessage(
        testTranslator(),
        "checkout.terms.revocationLabel",
        "checkout.terms.revocationLink",
      ),
    ).toEqual({
      before:
        "I want immediate access to the digital content and I acknowledge that thereby I waive my right to cancel.",
      link: "",
      after: "",
    });
  });
});

describe("linkedMessageText", () => {
  it("puts the link text into the sentence as plain text", () => {
    expect(
      linkedMessageText(
        testTranslator("de-DE"),
        "checkout.terms.tosLabel",
        "checkout.terms.tosLink",
      ),
    ).toBe(
      "Ich habe die Allgemeinen Geschäftsbedingungen gelesen und akzeptiert.",
    );
  });

  it("returns a message without a link placeholder unchanged", () => {
    expect(
      linkedMessageText(
        testTranslator(),
        "checkout.terms.revocationLabel",
        "checkout.terms.revocationLink",
      ),
    ).toBe(
      "I want immediate access to the digital content and I acknowledge that thereby I waive my right to cancel.",
    );
  });
});
