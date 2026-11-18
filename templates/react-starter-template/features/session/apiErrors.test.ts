import { describe, expect, it } from "vitest";

import { resolveApiErrorMessages } from "./apiErrors";
import { errorMessages } from "./errorMessages";
import { apiClientError, apiClientErrorWithBody } from "./session.fixture";

const DEFAULT_MESSAGE = errorMessages.errors["message-default"];

describe("resolveApiErrorMessages", () => {
  it("translates a known code and fills its parameters from meta, stripping the braces", () => {
    const error = apiClientError([
      {
        code: "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE",
        detail: "The email address jane@example.com is already in use",
        meta: { parameters: { "{{ email }}": "jane@example.com" } },
      },
    ]);

    expect(resolveApiErrorMessages(error, "account_registration_form")).toEqual(
      ["The email address jane@example.com is already in use"],
    );
  });

  it("resolves one message per error, in order", () => {
    const error = apiClientError([
      { code: "VIOLATION::CUSTOMER_PASSWORD_NOT_CORRECT" },
      { code: "rateLimitExceeded", meta: { parameters: { seconds: "30" } } },
    ]);

    expect(resolveApiErrorMessages(error)).toEqual([
      "Password incorrect.",
      "Too many requests. Please wait 30 seconds before trying again.",
    ]);
  });

  it("renders a missing parameter as empty, like vue-i18n", () => {
    const error = apiClientError([
      { code: "VIOLATION::TOO_SHORT_ERROR", meta: { parameters: [] } },
    ]);

    expect(resolveApiErrorMessages(error)).toEqual([" is too short."]);
  });

  it("maps the login code 0 to the bad credentials message only in the login context", () => {
    const error = apiClientError(
      [{ code: "0", detail: "No matching customer for the email found." }],
      401,
    );

    expect(resolveApiErrorMessages(error, "account_login")).toEqual([
      errorMessages.errors.login_no_matching_customer_internal,
    ]);
    expect(resolveApiErrorMessages(error, "account_registration_form")).toEqual(
      ["No matching customer for the email found."],
    );
    expect(resolveApiErrorMessages(error)).toEqual([
      "No matching customer for the email found.",
    ]);
  });

  it("returns the backend detail for an unknown code", () => {
    const error = apiClientError([
      {
        code: "CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS",
        detail: "Invalid username and/or password.",
      },
    ]);

    expect(resolveApiErrorMessages(error, "account_login")).toEqual([
      "Invalid username and/or password.",
    ]);
  });

  it("says that no details were provided when the error has neither a known code nor a detail", () => {
    const error = apiClientError([{ code: "UNKNOWN" }, {}]);

    expect(resolveApiErrorMessages(error)).toEqual([
      "No details provided",
      "No details provided",
    ]);
  });

  it("does not treat inherited object keys as known codes", () => {
    const error = apiClientError([{ code: "constructor", detail: "detail" }]);

    expect(resolveApiErrorMessages(error)).toEqual(["detail"]);
    expect(resolveApiErrorMessages(error, "account_login")).toEqual(["detail"]);
  });

  it("returns the default message for an API error without errors", () => {
    expect(resolveApiErrorMessages(apiClientError([], 500))).toEqual([
      DEFAULT_MESSAGE,
    ]);
  });

  it.each([
    ["an HTML error page", "<html>Bad gateway</html>", 502],
    ["a JSON body without errors", { message: "Bad gateway" }, 502],
    ["a JSON body with null errors", { errors: null }, 503],
  ])(
    "returns the default message for an API error with %s",
    (_, body, status) => {
      expect(
        resolveApiErrorMessages(apiClientErrorWithBody(body, status)),
      ).toEqual([DEFAULT_MESSAGE]);
    },
  );

  it.each([
    ["an empty body", ""],
    ["no body", undefined],
  ])(
    "documents that an API error with %s shows the client placeholder detail, like the Vue resolver",
    (_, body) => {
      expect(
        resolveApiErrorMessages(apiClientErrorWithBody(body, 500)),
      ).toEqual([
        "API did not return errors, but request failed. Please check the network tab.",
      ]);
    },
  );

  it.each([
    ["a network error", new TypeError("Failed to fetch")],
    ["a plain value", "boom"],
    ["nothing", undefined],
  ])("returns the default message for %s", (_, error) => {
    expect(resolveApiErrorMessages(error, "account_login")).toEqual([
      DEFAULT_MESSAGE,
    ]);
  });
});
