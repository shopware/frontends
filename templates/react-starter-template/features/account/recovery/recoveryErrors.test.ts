import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { apiClientError } from "@/features/session/session.fixture";
import { testTranslator } from "@/test/i18n";

import { VALID_HASH, violation } from "./recovery.fixture";
import {
  LINK_ERROR_KEYS,
  classifyResetFailure,
  logRecoverRequestFailure,
  logRecoveryFailure,
  recoverRequestErrors,
} from "./recoveryErrors";

const t = testTranslator();

const MESSAGE_DEFAULT = t("errors.message-default");

const SECRET = "Secret123";

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function rateLimit(seconds: unknown) {
  return apiClientError(
    [
      {
        code: "FRAMEWORK__RATE_LIMIT_EXCEEDED",
        status: "429",
        detail: "Too many requests.",
        meta: { parameters: { seconds } },
      } as never,
    ],
    429,
  );
}

describe("LINK_ERROR_KEYS", () => {
  it("names a message for both link problems", () => {
    expect(t(LINK_ERROR_KEYS.expired)).toBe(
      "The password reset link is no longer valid. Please request a new one.",
    );
    expect(t(LINK_ERROR_KEYS.invalid)).toBe(
      "The password reset link is invalid. Please request a new one.",
    );
  });
});

describe("the login's password policy error", () => {
  it.each([
    [
      "en-GB",
      "The password requirements have changed. Please reset your password.",
    ],
    [
      "pl-PL",
      "Wymagania dotyczące hasła uległy zmianie. Zresetuj swoje hasło.",
    ],
    [
      "de-DE",
      "Die Passwortrichtlinien haben sich geändert. Bitte setzen Sie Ihr Passwort zurück.",
    ],
  ] as const)(
    "asks for a reset in %s instead of the English detail",
    (locale, text) => {
      const error = apiClientError([
        {
          code: "CHECKOUT__PASSWORD_POLICIES_UPDATED",
          status: "400",
          detail: "Password policies updated.",
        },
      ]);

      expect(
        resolveApiErrorMessages(error, testTranslator(locale), "account_login"),
      ).toEqual([text]);
    },
  );
});

describe("recoverRequestErrors", () => {
  it("puts an email format violation on the field", () => {
    const error = apiClientError([
      violation("VIOLATION::INVALID_FORMAT_ERROR", "/email"),
    ]);

    expect(recoverRequestErrors(error, t)).toEqual({
      email: "Value is not a valid email address",
    });
  });

  it("puts a blank email on the field", () => {
    const error = apiClientError([
      violation("VIOLATION::IS_BLANK_ERROR", "/email"),
    ]);

    expect(recoverRequestErrors(error, t)).toEqual({
      email: "Value is required",
    });
  });

  it.each(["VIOLATION::NO_SUCH_CHOICE_ERROR", "VIOLATION::IS_BLANK_ERROR"])(
    "shows the default message for a storefront URL rejected with %s",
    (code) => {
      const error = apiClientError([
        violation(code, "/storefrontUrl", {}, "The value is not a domain."),
      ]);

      expect(recoverRequestErrors(error, t)).toEqual({ form: MESSAGE_DEFAULT });
    },
  );

  it("keeps a field and a form message apart", () => {
    const error = apiClientError([
      violation("VIOLATION::INVALID_FORMAT_ERROR", "/email"),
      violation("VIOLATION::NO_SUCH_CHOICE_ERROR", "/storefrontUrl"),
    ]);

    expect(recoverRequestErrors(error, t)).toEqual({
      email: "Value is not a valid email address",
      form: MESSAGE_DEFAULT,
    });
  });

  it("tells the shopper how long to wait when throttled", () => {
    expect(recoverRequestErrors(rateLimit(27), t)).toEqual({
      form: "Too many requests. Please wait 27 seconds before trying again.",
    });
    expect(
      recoverRequestErrors(rateLimit(12), testTranslator("de-DE")),
    ).toEqual({
      form: "Zu viele Anfragen. Bitte warten Sie 12 Sekunden, bevor Sie es erneut versuchen.",
    });
  });

  it("resolves any other API error through the shared resolver", () => {
    const error = apiClientError([
      { code: "SOMETHING__ELSE", status: "400", detail: "Plugin message" },
    ]);

    expect(recoverRequestErrors(error, t)).toEqual({ form: "Plugin message" });
  });

  it.each([
    ["a server error", apiClientError([{ detail: "SQL failure" }], 500)],
    ["a network failure", new TypeError("fetch failed")],
    ["a missing client", new Error("[Shopware] No browser client")],
  ])("shows the default message for %s", (_, error) => {
    expect(recoverRequestErrors(error, t)).toEqual({ form: MESSAGE_DEFAULT });
  });
});

describe("logRecoverRequestFailure", () => {
  it.each([
    [
      "a rejected storefront URL",
      apiClientError([
        violation("VIOLATION::NO_SUCH_CHOICE_ERROR", "/storefrontUrl", {
          "{{ value }}": "jane@example.com",
        }),
      ]),
      { status: 400, codes: ["VIOLATION::NO_SUCH_CHOICE_ERROR"] },
    ],
    [
      "a server error",
      apiClientError([{ code: "X", detail: "jane@example.com" }], 503),
      { status: 503, codes: ["X"] },
    ],
    [
      "a network failure",
      new TypeError("jane@example.com"),
      { name: "TypeError" },
    ],
  ])("logs %s without the address", (_, error, summary) => {
    logRecoverRequestFailure(error);

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "[Recovery] sending the recovery mail failed",
      summary,
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      "jane@example.com",
    );
  });

  it.each([
    [
      "an email violation",
      apiClientError([violation("VIOLATION::INVALID_FORMAT_ERROR", "/email")]),
    ],
    ["a rate limit", rateLimit(30)],
  ])("does not log %s", (_, error) => {
    logRecoverRequestFailure(error);

    expect(consoleError).not.toHaveBeenCalled();
  });
});

describe("classifyResetFailure", () => {
  it("recognises an expired, used or unknown link", () => {
    const error = apiClientError(
      [
        {
          code: "CHECKOUT__CUSTOMER_RECOVERY_HASH_EXPIRED",
          status: "410",
          detail: `The hash "${VALID_HASH}" is expired.`,
        },
      ],
      410,
    );

    expect(classifyResetFailure(error, t)).toEqual({ kind: "expired" });
  });

  it("recognises a link without a customer", () => {
    const error = apiClientError(
      [{ code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH", status: "404" }],
      404,
    );

    expect(classifyResetFailure(error, t)).toEqual({ kind: "invalid" });
  });

  it("puts a blank password on the field", () => {
    const error = apiClientError([
      violation("VIOLATION::IS_BLANK_ERROR", "/newPassword"),
    ]);

    expect(classifyResetFailure(error, t)).toEqual({
      kind: "fields",
      errors: { newPassword: "Value is required" },
    });
  });

  it("shows the shop's own minimum and never the password", () => {
    const error = apiClientError([
      violation(
        "VIOLATION::TOO_SHORT_ERROR",
        "/newPassword",
        { "{{ min }}": "12", "{{ value }}": '"hunter2"', "{{ limit }}": "12" },
        "This value is too short. It should have 12 characters or more.",
      ),
    ]);

    const failure = classifyResetFailure(error, t);

    expect(failure).toEqual({
      kind: "fields",
      errors: { newPassword: "This minimum length should be at least 12" },
    });
    expect(JSON.stringify(failure)).not.toContain("hunter2");
  });

  it("reads a numeric minimum and falls back to the client minimum", () => {
    const numeric = apiClientError([
      violation("VIOLATION::TOO_SHORT_ERROR", "/newPassword", {
        "{{ min }}": 10,
      }),
    ]);
    const missing = apiClientError([
      violation("VIOLATION::TOO_SHORT_ERROR", "/newPassword"),
    ]);

    expect(classifyResetFailure(numeric, t)).toEqual({
      kind: "fields",
      errors: { newPassword: "This minimum length should be at least 10" },
    });
    expect(classifyResetFailure(missing, t)).toEqual({
      kind: "fields",
      errors: { newPassword: "This minimum length should be at least 8" },
    });
    expect(classifyResetFailure(missing, t, 11)).toEqual({
      kind: "fields",
      errors: { newPassword: "This minimum length should be at least 11" },
    });
  });

  it("shows the maximum of a password that is too long", () => {
    const error = apiClientError([
      violation("VIOLATION::TOO_LONG_ERROR", "/newPassword", {
        "{{ max }}": 4096,
        "{{ value }}": `"${SECRET}"`,
      }),
    ]);

    expect(classifyResetFailure(error, t)).toEqual({
      kind: "fields",
      errors: { newPassword: "The maximum length allowed is 4096" },
    });
  });

  it("puts the mismatch without a code on the confirmation and drops its detail", () => {
    const error = apiClientError([
      violation(
        null,
        "/newPassword",
        {},
        `This value should be equal to ${SECRET}.`,
      ),
    ]);

    const failure = classifyResetFailure(error, t);

    expect(failure).toEqual({
      kind: "fields",
      errors: { newPasswordConfirm: "The passwords needs to be the same" },
    });
    expect(JSON.stringify(failure)).not.toContain(SECRET);
  });

  it("speaks Polish", () => {
    const error = apiClientError([
      violation("VIOLATION::TOO_SHORT_ERROR", "/newPassword", {
        "{{ min }}": "12",
      }),
    ]);

    expect(classifyResetFailure(error, testTranslator("pl-PL"))).toEqual({
      kind: "fields",
      errors: { newPassword: "Minimalna długość 12" },
    });
  });

  it.each([
    [
      "an unknown password violation",
      apiClientError([
        violation("VIOLATION::REGEX_FAILED_ERROR", "/newPassword", {}, SECRET),
      ]),
    ],
    [
      "a violation of another field",
      apiClientError([violation("VIOLATION::IS_BLANK_ERROR", "/hash")]),
    ],
    [
      "a password violation next to another field's",
      apiClientError([
        violation("VIOLATION::IS_BLANK_ERROR", "/newPassword"),
        violation("VIOLATION::IS_BLANK_ERROR", "/captcha"),
      ]),
    ],
    [
      "a too-long password without its maximum",
      apiClientError([
        violation("VIOLATION::TOO_LONG_ERROR", "/newPassword", {}, SECRET),
      ]),
    ],
    ["a 400 without errors", apiClientError([])],
    [
      "a server error shaped like a violation",
      apiClientError(
        [violation("VIOLATION::IS_BLANK_ERROR", "/newPassword", {}, SECRET)],
        500,
      ),
    ],
    [
      "a server error",
      apiClientError([{ code: "X", detail: `${SECRET} ${VALID_HASH}` }], 500),
    ],
    ["a network failure", new TypeError(SECRET)],
  ])("shows the default message for %s, never its detail", (_, error) => {
    const failure = classifyResetFailure(error, t);

    expect(failure).toEqual({ kind: "message", message: MESSAGE_DEFAULT });
    expect(JSON.stringify(failure)).not.toContain(SECRET);
  });
});

describe("logRecoveryFailure", () => {
  it("logs only the status and the codes", () => {
    const error = apiClientError(
      [
        violation(null, "/newPassword", {}, `equal to ${SECRET}`),
        {
          code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH",
          detail: `No matching customer for the hash "${VALID_HASH}" was found.`,
          meta: { parameters: { hash: VALID_HASH } },
        },
      ],
      400,
    );

    logRecoveryFailure("resetting the password failed", error);

    expect(consoleError).toHaveBeenCalledWith(
      "[Recovery] resetting the password failed",
      { status: 400, codes: ["CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH"] },
    );
    const logged = JSON.stringify(consoleError.mock.calls);
    expect(logged).not.toContain(SECRET);
    expect(logged).not.toContain(VALID_HASH);
  });

  it("logs the error name of a failure without a response", () => {
    logRecoveryFailure(
      "checking the recovery link failed",
      new TypeError(SECRET),
    );

    expect(consoleError).toHaveBeenCalledWith(
      "[Recovery] checking the recovery link failed",
      { name: "TypeError" },
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(SECRET);
  });
});
