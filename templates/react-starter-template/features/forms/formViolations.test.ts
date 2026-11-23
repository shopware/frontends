import type { ApiError } from "@shopware/api-client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClientError } from "@/features/session/session.fixture";
import { testTranslator } from "@/test/i18n";

import {
  isUnknownNewsletterRecipient,
  logFormFailure,
  resolveFormFailure,
  violationField,
} from "./formViolations";

const t = testTranslator();

const DEFAULT_MESSAGE = t("errors.message-default");

function violation(
  code: string,
  pointer: string,
  detail = "Backend detail",
  parameters: Record<string, string> = {},
): ApiError {
  return {
    code,
    status: "400",
    detail,
    source: { pointer },
    meta: { parameters },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("violationField", () => {
  it.each([
    ["/email", "email"],
    ["/salutationId", "salutationId"],
    ["/billingAddress/street", undefined],
    ["/", undefined],
    ["", undefined],
    ["email", undefined],
    [undefined, undefined],
  ])("reads %s as %s", (pointer, field) => {
    expect(violationField(pointer)).toBe(field);
  });
});

describe("resolveFormFailure", () => {
  it.each([
    ["VIOLATION::IS_BLANK_ERROR", "/subject", "Value is required"],
    [
      "VIOLATION::INVALID_FORMAT_ERROR",
      "/email",
      "Value is not a valid email address",
    ],
    [
      "VIOLATION::REGEX_FAILED_ERROR",
      "/firstName",
      "This field must not contain a link.",
    ],
    [
      "VIOLATION::ENTITY_DOES_NOT_EXISTS",
      "/salutationId",
      "Please choose one of the options.",
    ],
    [
      "VIOLATION::NO_SUCH_CHOICE_ERROR",
      "/option",
      "Please choose one of the options.",
    ],
  ])("gives %s on %s a field-sized message", (code, pointer, message) => {
    const field = pointer.slice(1);

    expect(
      resolveFormFailure(apiClientError([violation(code, pointer)]), t),
    ).toStrictEqual({
      message,
      violations: [{ field, code, message }],
    });
  });

  it("keeps the backend message for a format error outside the email", () => {
    expect(
      resolveFormFailure(
        apiClientError([
          violation("VIOLATION::INVALID_FORMAT_ERROR", "/phone", "Bad phone"),
        ]),
        t,
      ).violations,
    ).toStrictEqual([
      {
        field: "phone",
        code: "VIOLATION::INVALID_FORMAT_ERROR",
        message: "Bad phone",
      },
    ]);
  });

  it("turns the rate limit into the wait message without a field", () => {
    const error = apiClientError(
      [
        {
          code: "FRAMEWORK__RATE_LIMIT_EXCEEDED",
          status: "429",
          detail: "Too many requests, try again in 30 seconds.",
          meta: {
            parameters: { seconds: 30 } as unknown as Record<string, string>,
          },
        },
      ],
      429,
    );

    expect(resolveFormFailure(error, t)).toStrictEqual({
      message: "Too many requests. Please wait 30 seconds before trying again.",
      violations: [
        {
          code: "FRAMEWORK__RATE_LIMIT_EXCEEDED",
          message:
            "Too many requests. Please wait 30 seconds before trying again.",
        },
      ],
    });
  });

  it("keeps the backend message of a rate limit without seconds", () => {
    const error = apiClientError(
      [
        {
          code: "FRAMEWORK__RATE_LIMIT_EXCEEDED",
          status: "429",
          detail: "Too many requests.",
        },
      ],
      429,
    );

    expect(resolveFormFailure(error, t).message).toBe("Too many requests.");
  });

  it("hides a rejected storefront url behind the default message", () => {
    expect(
      resolveFormFailure(
        apiClientError([
          violation(
            "VIOLATION::NO_SUCH_CHOICE_ERROR",
            "/storefrontUrl",
            "The value you selected is not a valid choice.",
          ),
        ]),
        t,
      ),
    ).toStrictEqual({
      message: DEFAULT_MESSAGE,
      violations: [
        { code: "VIOLATION::NO_SUCH_CHOICE_ERROR", message: DEFAULT_MESSAGE },
      ],
    });
  });

  it("uses the backend detail for an unknown code and keeps the field", () => {
    expect(
      resolveFormFailure(
        apiClientError([violation("SOMETHING_NEW", "/comment", "New rule")]),
        t,
      ).violations,
    ).toStrictEqual([
      { field: "comment", code: "SOMETHING_NEW", message: "New rule" },
    ]);
  });

  it("uses an errors message when the template has one", () => {
    expect(
      resolveFormFailure(
        apiClientError([
          {
            code: "CONTENT__NEWSLETTER_RECIPIENT_THROTTLED",
            status: "429",
            detail: "Throttled",
            meta: { parameters: { seconds: "12" } },
          },
        ]),
        t,
      ),
    ).toStrictEqual({
      message: "Too many requests. Please wait 12 seconds before trying again.",
      violations: [
        {
          code: "CONTENT__NEWSLETTER_RECIPIENT_THROTTLED",
          message:
            "Too many requests. Please wait 12 seconds before trying again.",
        },
      ],
    });
  });

  it("summarizes with the first violation without a field", () => {
    expect(
      resolveFormFailure(
        apiClientError([
          violation("VIOLATION::IS_BLANK_ERROR", "/email"),
          { code: "SOMETHING", status: "400", detail: "Form level" },
        ]),
        t,
      ).message,
    ).toBe("Form level");
    expect(
      resolveFormFailure(
        apiClientError([
          violation("VIOLATION::IS_BLANK_ERROR", "/email"),
          violation("VIOLATION::REGEX_FAILED_ERROR", "/lastName"),
        ]),
        t,
      ).message,
    ).toBe("Value is required");
  });

  it.each([
    ["a plain error", new TypeError("Failed to fetch")],
    ["an API error without errors", apiClientError([])],
    [
      "a server error",
      apiClientError(
        [{ code: "FRAMEWORK__X", status: "500", detail: "SQLSTATE[42S02]" }],
        500,
      ),
    ],
  ])("gives the default message for %s", (_case, error) => {
    expect(resolveFormFailure(error, t)).toStrictEqual({
      message: DEFAULT_MESSAGE,
    });
  });

  it("translates under the page locale", () => {
    const pl = testTranslator("pl-PL");

    expect(
      resolveFormFailure(
        apiClientError([
          violation("VIOLATION::IS_BLANK_ERROR", "/email"),
          violation("VIOLATION::REGEX_FAILED_ERROR", "/firstName"),
        ]),
        pl,
      ).violations?.map(({ message }) => message),
    ).toStrictEqual([
      "Wartość jest wymagana",
      "To pole nie może zawierać linku.",
    ]);
  });
});

describe("isUnknownNewsletterRecipient", () => {
  it("recognizes the not-found answer of the unsubscribe route only", () => {
    expect(
      isUnknownNewsletterRecipient(
        apiClientError([
          {
            code: "CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND",
            status: "400",
            detail:
              'The NewsletterRecipient with the identifier "email" - jane@example.com was not found.',
          },
        ]),
      ),
    ).toBe(true);
    expect(
      isUnknownNewsletterRecipient(
        apiClientError([violation("VIOLATION::IS_BLANK_ERROR", "/email")]),
      ),
    ).toBe(false);
    expect(isUnknownNewsletterRecipient(new Error("nope"))).toBe(false);
  });
});

describe("logFormFailure", () => {
  it("stays silent for violations and the rate limit", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    logFormFailure(
      "contact",
      apiClientError([
        violation("VIOLATION::INVALID_FORMAT_ERROR", "/email", "x", {
          "{{ value }}": "jane@example",
        }),
      ]),
    );
    logFormFailure(
      "newsletter",
      apiClientError(
        [{ code: "FRAMEWORK__RATE_LIMIT_EXCEEDED", status: "429" }],
        429,
      ),
    );

    expect(log).not.toHaveBeenCalled();
  });

  it("logs only the status and the codes of a rejected storefront url", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    logFormFailure(
      "newsletter",
      apiClientError([
        violation(
          "VIOLATION::NO_SUCH_CHOICE_ERROR",
          "/storefrontUrl",
          'The value "https://jane@example.com" is not a valid choice.',
          { "{{ value }}": "jane@example.com" },
        ),
      ]),
    );

    expect(log).toHaveBeenCalledWith("[Forms] newsletter failed", {
      status: 400,
      codes: ["VIOLATION::NO_SUCH_CHOICE_ERROR"],
    });
    expect(JSON.stringify(log.mock.calls)).not.toContain("jane@example");
  });

  it("logs server errors and failures without a response by status or name", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    logFormFailure(
      "contact",
      apiClientError(
        [{ code: "FRAMEWORK__X", status: "503", detail: "jane@example.com" }],
        503,
      ),
    );
    logFormFailure("contact", new TypeError("jane@example.com"));
    logFormFailure(
      "newsletter",
      apiClientError(
        [{ code: "FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND", status: "404" }],
        404,
      ),
    );

    expect(log.mock.calls).toStrictEqual([
      ["[Forms] contact failed", { status: 503, codes: ["FRAMEWORK__X"] }],
      ["[Forms] contact failed", { name: "TypeError" }],
      [
        "[Forms] newsletter failed",
        { status: 404, codes: ["FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND"] },
      ],
    ]);
    expect(JSON.stringify(log.mock.calls)).not.toContain("jane@example");
  });
});
