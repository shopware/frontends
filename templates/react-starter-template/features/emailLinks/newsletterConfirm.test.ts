import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";
import { timeoutError } from "@/features/checkout/checkoutTestDoubles";
import {
  apiClientError,
  apiClientErrorWithBody,
} from "@/features/session/session.fixture";

import {
  classifyNewsletterConfirmError,
  confirmNewsletter,
} from "./newsletterConfirm";

const CONFIRM_NEWSLETTER = "confirmNewsletter post /newsletter/confirm";
const HASH = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";
const EM = "5d41402abc4b2a76b9719d911017c592aa5d0123";
const link = { em: EM, hash: HASH };

function statusViolation(value: string) {
  return apiClientError(
    [
      {
        code: "VIOLATION::NOT_EQUAL_ERROR",
        status: "400",
        detail: 'This value should be equal to "notSet".',
        source: { pointer: "/status" },
        meta: {
          parameters: {
            "{{ value }}": `"${value}"`,
            "{{ compared_value }}": '"notSet"',
          },
        },
      },
    ],
    400,
  );
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("classifyNewsletterConfirmError", () => {
  it.each([
    [
      "an unknown hash",
      apiClientError(
        [
          {
            code: "CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND",
            detail: `The NewsletterRecipient with the identifier "hash" - ${HASH} was not found.`,
          },
        ],
        400,
      ),
    ],
    [
      "an email hash that does not match",
      apiClientError(
        [{ code: "VIOLATION::NOT_EQUAL_ERROR", source: { pointer: "/em" } }],
        400,
      ),
    ],
    [
      "a mismatching email hash next to a used link",
      apiClientError(
        [
          {
            code: "VIOLATION::NOT_EQUAL_ERROR",
            source: { pointer: "/status" },
            meta: { parameters: { "{{ value }}": '"optIn"' } },
          },
          { code: "VIOLATION::NOT_EQUAL_ERROR", source: { pointer: "/em" } },
        ],
        400,
      ),
    ],
    ["a subscriber who left", statusViolation("optOut")],
    ["a recipient in an unknown state", statusViolation("undefined")],
    ["any other client error", apiClientError([{ code: "SOMETHING" }], 404)],
  ])("treats %s as an invalid link", (_, error) => {
    expect(classifyNewsletterConfirmError(error)).toBe("invalidLink");
  });

  it.each([["optIn"], ["direct"]])(
    "treats a recipient already in %s as already confirmed",
    (value) => {
      expect(classifyNewsletterConfirmError(statusViolation(value))).toBe(
        "alreadyConfirmed",
      );
    },
  );

  it.each([
    ["a server error", apiClientError([{ code: "FRAMEWORK__ERROR" }], 500)],
    ["an HTML gateway page", apiClientErrorWithBody("<html>502</html>", 502)],
    ["a network failure", new TypeError("Failed to fetch")],
    ["a timeout", timeoutError()],
  ])("treats %s as a failure that can be retried", (_, error) => {
    expect(classifyNewsletterConfirmError(error)).toBe("failed");
  });
});

describe("confirmNewsletter", () => {
  it("posts the email hash and the hash and resolves confirmed", async () => {
    const shopware = fakeClient(() => ({ success: true }));

    await expect(
      confirmNewsletter(async () => shopware.client, link),
    ).resolves.toEqual({ status: "confirmed" });

    expect(shopware.invocations).toEqual([
      {
        operation: CONFIRM_NEWSLETTER,
        params: { body: { em: EM, hash: HASH } },
      },
    ]);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("resolves the classified outcome of an API error without logging it", async () => {
    const shopware = fakeClient(() => {
      throw statusViolation("optIn");
    });

    await expect(
      confirmNewsletter(async () => shopware.client, link),
    ).resolves.toEqual({ status: "alreadyConfirmed" });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("resolves failed and logs only the status and the codes", async () => {
    const shopware = fakeClient(() => {
      throw apiClientError(
        [{ code: "FRAMEWORK__ERROR", detail: `${EM} ${HASH}` }],
        503,
      );
    });

    await expect(
      confirmNewsletter(async () => shopware.client, link),
    ).resolves.toEqual({ status: "failed" });

    expect(consoleError).toHaveBeenCalledExactlyOnceWith(
      "[Newsletter] confirming the subscription failed",
      { status: 503, codes: ["FRAMEWORK__ERROR"] },
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(HASH);
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(EM);
  });

  it("resolves failed when the client cannot be created", async () => {
    await expect(
      confirmNewsletter(async () => {
        throw new Error("config unavailable");
      }, link),
    ).resolves.toEqual({ status: "failed" });

    expect(consoleError).toHaveBeenCalledExactlyOnceWith(
      "[Newsletter] confirming the subscription failed",
      { name: "Error" },
    );
  });
});
